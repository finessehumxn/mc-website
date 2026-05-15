"""
normalization_node.py
──────────────────────
Node 3 in the MedBrief pipeline.

Takes the patient-language entities from extraction_node and maps them to
standardized clinical terminology with ICD-10 codes. Also identifies the
most likely primary condition with a confidence rating and plain-English
explanation — which feeds the confirmation card the patient sees.

Reads from state  : symptoms, duration, body_parts, severity, raw_input
Writes to state   : term_mappings, primary_condition, plain_condition_name,
                    icd_code, confidence, plain_reason, alternate_conditions
Short-circuits on : state["error"] being non-null
"""

import json
import logging
import anthropic
from ..state import PatientState

logger = logging.getLogger(__name__)
client = anthropic.Anthropic()

SYSTEM_PROMPT = """
You are a compassionate medical terminology specialist working for a patient-facing
health information service. Your job is to:

1. Take what a patient described in their own words
2. Map each key term to the proper clinical name and ICD-10 code
3. Identify the single most likely primary condition
4. Explain everything in plain, warm, everyday language

The patients reading this are non-medical. Many are elderly, anxious, or both.
Write every single word as if you are a kind, knowledgeable family member
who happens to have medical expertise. Never be cold, clinical, or alarming.

Return ONLY valid JSON — no preamble, no markdown fences. Schema:
{
  "mappings": [
    {
      "patient_said":    "The patient's exact words or close paraphrase",
      "doctors_call_it": "The official clinical/medical term",
      "icd_snippet":     "ICD-10 code if well-established (e.g. 'R73.09'), else empty string",
      "simple_meaning":  "One plain-English sentence: what does this medical word actually mean?"
    }
  ],
  "primary": {
    "name":         "Full official clinical name of the most likely condition",
    "plain_name":   "Simple everyday name that most people would recognise",
    "icd_code":     "ICD-10 code for the primary condition, e.g. 'E11.9'",
    "confidence":   "High | Medium | Low",
    "plain_reason": "One warm, reassuring sentence explaining why this condition fits what they described"
  },
  "also_possible": [
    "Second most likely condition in plain everyday language",
    "Third most likely condition in plain everyday language"
  ]
}

Rules:
- Include 3 to 6 mappings maximum (most clinically significant terms only).
- Include 2 to 3 alternate conditions.
- "plain_reason" must be warm and reassuring — never alarming or catastrophic.
- If confidence is Low, acknowledge uncertainty honestly but kindly.
- Use common names people recognise: "Type 2 Diabetes" not just "Diabetes Mellitus Type 2".
- For ICD codes, use only well-established codes you are confident about. If unsure, use empty string.
- Do not list every possible differential — only the most clinically plausible ones given the symptoms.
"""

_EMPTY_NORMALIZATION = {
    "term_mappings":        [],
    "primary_condition":    "",
    "plain_condition_name": "",
    "icd_code":             "",
    "confidence":           "Low",
    "plain_reason":         "",
    "alternate_conditions": [],
}


def normalization_node(state: PatientState) -> dict:
    """
    Maps extracted patient-language entities to clinical terminology.
    Returns a partial PatientState dict with normalization results.
    """

    if state.get("error"):
        logger.warning("normalization_node skipped due to prior error in state")
        return {"current_node": "normalization"}

    # Build the user message from extraction results + original text
    symptoms   = state.get("symptoms",   [])
    body_parts = state.get("body_parts", [])
    duration   = state.get("duration",   [])
    severity   = state.get("severity",   [])
    raw_input  = state.get("raw_input",  "")

    symptom_str   = ", ".join(symptoms)   or "None specified"
    body_str      = ", ".join(body_parts) or "None specified"
    duration_str  = ", ".join(duration)   or "Not mentioned"
    severity_str  = ", ".join(severity)   or "Not mentioned"

    user_content = (
        f"Map the following patient-reported information to clinical terminology "
        f"and identify the most likely condition.\n\n"
        f"Symptoms (patient's words): {symptom_str}\n"
        f"Body areas mentioned: {body_str}\n"
        f"Duration: {duration_str}\n"
        f"Severity: {severity_str}\n"
        f"Full patient text: \"{raw_input}\""
    )

    try:
        response = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=1500,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": user_content}]
        )

        text = response.content[0].text.strip()
        text = text.replace("```json", "").replace("```", "").strip()

        start = text.find("{")
        end   = text.rfind("}")
        if start == -1 or end == -1:
            raise ValueError("No JSON object found in normalization response")

        data    = json.loads(text[start:end + 1])
        primary = data.get("primary", {})

        return {
            "term_mappings":        data.get("mappings",      []),
            "primary_condition":    primary.get("name",        ""),
            "plain_condition_name": primary.get("plain_name",  ""),
            "icd_code":             primary.get("icd_code",    ""),
            "confidence":           primary.get("confidence",  "Medium"),
            "plain_reason":         primary.get("plain_reason",""),
            "alternate_conditions": data.get("also_possible",  []),
            "current_node":         "normalization",
            "error":                None,
        }

    except json.JSONDecodeError as exc:
        logger.error(f"normalization_node JSON parse error: {exc}")
        return {
            **_EMPTY_NORMALIZATION,
            "current_node": "normalization",
            "error": f"Normalization failed — could not parse AI response: {exc}",
        }
    except Exception as exc:
        logger.error(f"normalization_node unexpected error: {exc}")
        return {
            **_EMPTY_NORMALIZATION,
            "current_node": "normalization",
            "error": f"Normalization failed: {exc}",
        }
