"""
extraction_node.py
───────────────────
Node 2 in the MedBrief pipeline.

Reads the patient's raw words and extracts structured medical entities
exactly as the patient described them — no clinical translation yet.
Plain-English labels are intentionally preserved so the normalization
node can show patients the "patient said → doctor calls it" mapping.

Reads from state  : raw_input
Writes to state   : symptoms, duration, severity, medications,
                    body_parts, emotional_context, current_node
Short-circuits on : state["error"] being non-null from a prior node

LangGraph note: This node only runs when guardrail_status == "pass".
The conditional edge in graph.py enforces this.
"""

import json
import logging
import anthropic
from ..state import PatientState

logger = logging.getLogger(__name__)
client = anthropic.Anthropic()

SYSTEM_PROMPT = """
You are a compassionate medical NLP specialist whose job is to carefully listen
to what a patient typed and pull out the key pieces of information they mentioned.

CRITICAL: Preserve the patient's exact words. Do NOT translate to medical terms.
Do NOT rephrase. If they said "tingling in my feet," write "tingling in my feet"
— not "peripheral neuropathy" or "paraesthesia." That translation comes later.

Return ONLY valid JSON — no preamble, no markdown fences. Schema:
{
  "symptoms": [
    "list every symptom or body complaint the patient mentioned, in their own words"
  ],
  "duration": [
    "any time references: 'for the past few months', 'started last year', 'recently', 'for a while'"
  ],
  "severity": [
    "any intensity or frequency words: 'really bad', 'constant', 'comes and goes',
     'a bit', 'severe', 'mild', 'getting worse', 'not too bad'"
  ],
  "medications": [
    "any medicines, supplements, or treatments the patient mentioned by name.
     If none mentioned, return empty array []."
  ],
  "body_parts": [
    "every body area or organ the patient referenced: 'feet', 'chest', 'joints',
     'hands', 'stomach', 'heart', 'kidneys', 'eyes', etc."
  ],
  "feelings": [
    "any emotional or psychological words: 'scared', 'worried', 'frustrated',
     'confused', 'hopeful', 'overwhelmed', 'not sure what to think'"
  ],
  "has_data": true
}

Rules:
- If nothing was mentioned for a field, return an empty array [].
- Never return null for any field.
- Always include "has_data": true so the caller can confirm parsing succeeded.
- A single symptom can appear in both "symptoms" and "body_parts" if relevant.
- Do not infer or guess. Only extract what the patient explicitly stated.
- Keep entries concise — one phrase or short sentence each.
"""

_EMPTY_EXTRACTION = {
    "symptoms":          [],
    "duration":          [],
    "severity":          [],
    "medications":       [],
    "body_parts":        [],
    "emotional_context": [],
}


def extraction_node(state: PatientState) -> dict:
    """
    Extracts structured medical entities from the patient's raw text.
    Returns a partial PatientState dict. LangGraph merges it into full state.
    """

    # Short-circuit if a prior node (guardrail) set an error
    if state.get("error"):
        logger.warning("extraction_node skipped due to prior error in state")
        return {"current_node": "extraction"}

    raw_input = (state.get("raw_input") or "").strip()
    if not raw_input:
        return {
            **_EMPTY_EXTRACTION,
            "current_node": "extraction",
            "error": "Patient input was empty when extraction_node ran.",
        }

    try:
        response = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=1000,
            system=SYSTEM_PROMPT,
            messages=[{
                "role": "user",
                "content": (
                    f"Extract all medical entities from this patient input, "
                    f"preserving their exact words:\n\n\"{raw_input}\""
                )
            }]
        )

        text = response.content[0].text.strip()
        text = text.replace("```json", "").replace("```", "").strip()

        # Find the JSON object in the response
        start = text.find("{")
        end   = text.rfind("}")
        if start == -1 or end == -1:
            raise ValueError("No JSON object found in extraction response")

        data = json.loads(text[start:end + 1])

        return {
            "symptoms":          data.get("symptoms",    []),
            "duration":          data.get("duration",    []),
            "severity":          data.get("severity",    []),
            "medications":       data.get("medications", []),
            "body_parts":        data.get("body_parts",  []),
            "emotional_context": data.get("feelings",    []),
            "current_node":      "extraction",
            "error":             None,
        }

    except json.JSONDecodeError as exc:
        logger.error(f"extraction_node JSON parse error: {exc}")
        return {
            **_EMPTY_EXTRACTION,
            "current_node": "extraction",
            "error": f"Extraction failed — could not parse AI response: {exc}",
        }
    except Exception as exc:
        logger.error(f"extraction_node unexpected error: {exc}")
        return {
            **_EMPTY_EXTRACTION,
            "current_node": "extraction",
            "error": f"Extraction failed: {exc}",
        }
