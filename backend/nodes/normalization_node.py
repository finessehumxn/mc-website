"""normalization_node.py — Node 3"""
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

SYSTEM = """You are a clinical terminology mapper. Map patient language to medical terms.
Return ONLY a valid JSON object with no extra text:
{
  "term_mappings": [
    {
      "patient_said": "the exact words the patient used",
      "doctors_call_it": "the clinical term (always spell out acronyms first time)",
      "simple_meaning": "one plain sentence explaining what this means"
    }
  ],
  "primary_condition": "most likely clinical condition name",
  "plain_condition_name": "everyday plain language name for this condition",
  "plain_reason": "2 warm sentences explaining why this fits what they described",
  "alternate_conditions": ["other possible conditions to consider"],
  "confidence": "high"
}
Return ONLY the JSON object. No extra text."""

@traceable(name="normalization_node", tags=["clinical"])
def normalization_node(state: PatientState) -> dict:
    if state.get("error") or state.get("guardrail_status") not in ("pass", None):
        return {"current_node": "normalization"}
    raw = state.get("raw_input", "")
    extraction = state.get("extraction", {})
    if not raw:
        return {"normalization": {}, "current_node": "normalization", "error": "No input"}
    logger.info("normalization_node running")
    try:
        prompt = f"Patient said: {raw}\n\nExtracted entities: {json.dumps(extraction)}\n\nMap these to clinical terms."
        resp = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=800,
            system=SYSTEM,
            messages=[{"role": "user", "content": prompt}]
        )
        text = resp.content[0].text.strip()
        text = text.replace("```json", "").replace("```", "").strip()
        start = text.find("{")
        end = text.rfind("}") + 1
        if start == -1:
            raise ValueError(f"No JSON found: {text[:100]}")
        norm = json.loads(text[start:end])
        logger.info(f"normalization_node done: {norm.get('primary_condition','?')}")
        return {"normalization": norm, "current_node": "normalization", "error": None}
    except Exception as e:
        logger.error(f"normalization_node error: {e}")
        return {"normalization": {}, "current_node": "normalization", "error": f"Normalization failed: {e}"}
