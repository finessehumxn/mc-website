"""extraction_node.py — Node 2"""
import json
import logging
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

SYSTEM = """Extract health entities from the patient message. Return ONLY valid JSON with no extra text:
{
  "symptoms": ["list of symptoms the patient described"],
  "body_parts": ["body areas they mentioned"],
  "duration": ["any time expressions like 'for 3 days'"],
  "severity": ["severity words like 'severe', 'mild', 'a lot of'"],
  "medications": ["any medications mentioned"],
  "emotional_context": ["emotional states like 'scared', 'worried', 'confused'"]
}
If a field has nothing, use an empty list []. Return ONLY the JSON object."""

@traceable(name="extraction_node", tags=["nlp"])
def extraction_node(state: PatientState) -> dict:
    if state.get("guardrail_status") not in ("pass", None):
        return {"current_node": "extraction"}
    raw = state.get("raw_input", "")
    if not raw:
        return {"extraction": {}, "current_node": "extraction", "error": "No input"}
    logger.info(f"extraction_node running for: {raw[:50]}")
    try:
        resp = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=600,
            system=SYSTEM,
            messages=[{"role": "user", "content": raw}]
        )
        text = resp.content[0].text.strip()
        text = text.replace("```json", "").replace("```", "").strip()
        start = text.find("{")
        end = text.rfind("}") + 1
        if start == -1:
            raise ValueError(f"No JSON found in response: {text[:100]}")
        extraction = json.loads(text[start:end])
        logger.info(f"extraction_node done: {len(extraction.get('symptoms',[]))} symptoms")
        return {"extraction": extraction, "current_node": "extraction", "error": None}
    except Exception as e:
        logger.error(f"extraction_node error: {e}")
        return {"extraction": {}, "current_node": "extraction", "error": f"Extraction failed: {e}"}
