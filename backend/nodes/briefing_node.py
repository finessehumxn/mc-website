"""briefing_node.py — Node 5"""
import json, re, logging
import anthropic
from ..state import PatientState

logger = logging.getLogger(__name__)
client = anthropic.Anthropic()

try:
    from langsmith import traceable
except ImportError:
    def traceable(**kw):
        def decorator(fn): return fn
        return decorator

SYSTEM_PROMPT = """You are a warm, patient-friendly medical information specialist helping everyday people understand health conditions.

Generate a complete health briefing as a SINGLE valid JSON object. 

CRITICAL JSON RULES:
- Return ONLY the JSON. No text before or after.
- No apostrophes in ANY text field — reword to avoid them completely
- No citation markers like [1] or [2] anywhere  
- No markdown inside JSON values
- Spell out ALL acronyms first time (e.g. "Endometriosis (endo)")
- Double quotes only for JSON strings
- No trailing commas

CRITICAL CONTENT RULES:
- Always generate a full briefing even for complex or rare conditions
- If two conditions are mentioned together (e.g. pneumothorax and endometriosis), treat the combination as the topic
- Never return empty arrays — always include at least 2-3 items in treatments, options, companies, sources
- Use web search to find current, accurate information

JSON structure — fill EVERY field:
{
  "condition_name": "Full clinical name of condition",
  "plain_name": "Plain everyday name",
  "opening": "2-3 warm sentences acknowledging what the patient is going through",
  "standard_of_care": {
    "plain_summary": "2-3 sentences about how doctors treat this in plain language",
    "treatments": [
      {
        "name": "Treatment name",
        "phase": "First-line treatment",
        "plain_description": "What this treatment is and how it helps",
        "what_this_means_for_you": "One sentence personalizing this for the patient"
      }
    ]
  },
  "emerging": [
    {
      "name": "Research or emerging treatment name",
      "phase": "Research stage",
      "plain_description": "What researchers are working on and why it matters"
    }
  ],
  "holistic": {
    "intro": "Brief intro to complementary approaches for this condition",
    "options": [
      {
        "name": "Complementary approach name",
        "type": "Lifestyle or Mind-Body or Supplement",
        "plain_description": "What it is and how it may support the patient",
        "note": "Any important safety note"
      }
    ],
    "reminder": "Always discuss any complementary approach with your doctor before starting"
  },
  "companies": [
    {
      "name": "Organization or hospital or research center name",
      "type": "Research or Nonprofit or Medical Center",
      "focus": "What they do for this condition specifically"
    }
  ],
  "sources": [
    {
      "title": "Source title",
      "url": "https://real-url.org/page"
    }
  ],
  "closing": "1-2 warm closing sentences encouraging the patient to take the next step"
}"""


@traceable(name="briefing_node", tags=["briefing", "pipeline"])
def briefing_node(state: PatientState) -> dict:
    if state.get("error"):
        return {"current_node": "briefing"}

    # Get condition from multiple fallback locations
    condition = (state.get("final_condition") or "").strip()
    if not condition:
        norm = state.get("normalization", {})
        condition = (
            norm.get("primary_condition") or
            norm.get("plain_condition_name") or
            ""
        ).strip()
    if not condition:
        raw = state.get("raw_input", "").strip()
        if raw:
            condition = raw[:120]  # use raw input as last resort

    if not condition:
        return {
            "briefing": None,
            "current_node": "briefing",
            "error": "No condition name available to generate a briefing.",
        }

    logger.info(f"briefing_node generating for: {condition}")

    try:
        response = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=4000,
            system=SYSTEM_PROMPT,
            tools=[{"type": "web_search_20250305", "name": "web_search"}],
            messages=[{
                "role": "user",
                "content": (
                    f"Generate a complete patient-friendly health briefing for: {condition}\n\n"
                    f"Search for current medical information about this condition.\n"
                    f"Include standard treatments, emerging research, holistic options, "
                    f"key organizations, and reliable sources.\n"
                    f"If this involves multiple conditions or a relationship between conditions, "
                    f"cover that relationship specifically.\n\n"
                    f"IMPORTANT: Return ONLY valid JSON. "
                    f"Do NOT use apostrophes in any text field. "
                    f"Do NOT use citation markers. "
                    f"Fill every array with at least 2-3 items."
                )
            }]
        )

        # Collect text from all content blocks
        texts = ""
        for block in response.content:
            if hasattr(block, "text") and block.text:
                texts += " " + block.text

        # Clean up
        texts = re.sub(r'<cite[^>]*>.*?</cite>', '', texts, flags=re.DOTALL)
        texts = re.sub(r'<cite[^>]*>', '', texts)
        texts = re.sub(r'</cite>', '', texts)
        texts = re.sub(r'\[\d+\]', '', texts)
        texts = texts.replace("```json", "").replace("```", "").strip()

        # Extract JSON object
        s = texts.find("{")
        e = texts.rfind("}")
        if s == -1:
            raise ValueError(f"No JSON found. Response preview: {texts[:200]}")

        json_str = texts[s:e+1]

        # Parse with fallback cleanup
        try:
            briefing = json.loads(json_str)
        except json.JSONDecodeError as je:
            logger.warning(f"JSON parse attempt 1 failed: {je}")
            # Remove control characters and fix trailing commas
            json_str = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]', '', json_str)
            json_str = re.sub(r',(\s*[}\]])', r'\1', json_str)
            try:
                briefing = json.loads(json_str)
            except json.JSONDecodeError as je2:
                logger.error(f"JSON parse attempt 2 failed: {je2}")
                # Last resort: extract what we can
                raise ValueError(f"JSON parsing failed after cleanup: {je2}")

        logger.info(f"briefing_node complete: {condition}")
        return {
            "briefing": briefing,
            "current_node": "briefing",
            "error": None,
        }

    except Exception as exc:
        logger.error(f"briefing_node error for '{condition}': {exc}")
        return {
            "briefing": None,
            "current_node": "briefing",
            "error": f"Briefing failed: {exc}",
        }
