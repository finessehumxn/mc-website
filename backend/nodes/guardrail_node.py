"""
guardrail_node.py
──────────────────
Node 1 in the MedBrief pipeline. Runs BEFORE any medical processing.

Classifies the patient's raw input into one of five buckets and writes
guardrail_status + guardrail_message to state. The graph.py routing
function reads guardrail_status to decide the next node.

Routing outcomes:
  "pass"      → extraction_node  (normal medical inquiry)
  "emergency" → emergency_handler → END  (active medical crisis, call 911)
  "crisis"    → crisis_handler   → END  (mental health / self-harm signals)
  "off_topic" → off_topic_handler → END (nothing to do with health)
  "invalid"   → invalid_handler  → END (too vague / gibberish / too short)

Design decisions:
  - Uses low max_tokens (300) because classification needs no long output.
  - On ANY exception, defaults to "pass" — a guardrail error must never
    block a patient who has a genuine health question.
  - Hard-coded length guard (< 5 chars) runs before the API call to save cost.
"""

import json
import logging
import anthropic
from ..state import PatientState

logger = logging.getLogger(__name__)
client = anthropic.Anthropic()

SYSTEM_PROMPT = """
You are a compassionate triage specialist for a patient health information service.
Your job is to read what someone typed and decide which of five categories fits best.

Return ONLY valid JSON — no preamble, no markdown fences, no extra text. Schema:
{
  "status": "pass | emergency | crisis | off_topic | invalid",
  "message": "A warm, human-written message (see rules below, null for pass)"
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CATEGORY DEFINITIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

pass
  Any genuine health question, symptom, condition name, medication question,
  or something a doctor said — even if vague. Give the benefit of the doubt.
  Examples: "my knee hurts", "doctor said high a1c", "i feel off lately",
            "what is rheumatoid arthritis", "i have lupus"
  message: null

emergency
  Patient describes something happening RIGHT NOW that could be immediately
  life-threatening. Key signals: chest pain + right now, can't breathe,
  stroke symptoms (face drooping, arm weakness, slurred speech), uncontrolled
  bleeding, severe allergic reaction, loss of consciousness, overdose.
  Do NOT classify as emergency if they are just describing past symptoms.
  message: Write 2 calm, warm sentences. Tell them to call 911 or go to the
           nearest ER immediately. Do not be dramatic or alarming.

crisis
  Patient expresses thoughts of suicide, self-harm, harming others, or uses
  language that suggests they may be in severe emotional distress or crisis.
  Examples: "I don't want to be here anymore", "thinking about hurting myself",
            "I can't go on like this"
  message: Write 2-3 warm, non-judgmental sentences. Acknowledge their pain.
           Include: "Please reach out to the 988 Suicide and Crisis Lifeline —
           just call or text 988, any time of day or night."

off_topic
  Clearly has nothing to do with health, medicine, body, symptoms, or wellbeing.
  Examples: "what's the weather", "help me write an email", "fix my code",
            "tell me a joke", "what is 2+2"
  message: Write 1-2 warm sentences. Gently note this service is for health
           questions. Invite them to share anything health-related.

invalid
  Too short (under 3 meaningful words), complete gibberish, random characters,
  or so vague it's impossible to identify any intent.
  Examples: "aaa", "???", "hi", "idk", "asdfghjkl"
  message: Write 1-2 warm sentences. Ask them to share a little more about
           what they've been experiencing so we can better help them.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TONE RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Always be warm, calm, and human. Never robotic or clinical.
- Never lecture, shame, or catastrophize.
- These are real people who may be scared or vulnerable.
- If in doubt between pass and another status, choose pass.
- A message is required for all statuses except pass.
"""


def guardrail_node(state: PatientState) -> dict:
    """
    Classifies raw patient input for safety and relevance.
    Returns a partial PatientState dict with guardrail_status and guardrail_message.
    """
    raw = (state.get("raw_input") or "").strip()

    # ── Hard-coded length guard (no API call needed) ──
    if len(raw) < 5:
        return {
            "guardrail_status": "invalid",
            "guardrail_message": (
                "I'd love to help — could you tell me a little more about "
                "what you've been experiencing? Even a sentence about how "
                "you're feeling is a great start."
            ),
            "current_node": "guardrail",
            "error": None,
        }

    try:
        response = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=300,
            system=SYSTEM_PROMPT,
            messages=[{
                "role": "user",
                "content": f'Classify this patient input:\n\n"{raw}"'
            }]
        )

        text = response.content[0].text.strip()
        text = text.replace("```json", "").replace("```", "").strip()
        data = json.loads(text)

        status  = data.get("status", "pass")
        message = data.get("message") or None

        # Reject unexpected status values — never block the patient
        valid_statuses = {"pass", "emergency", "crisis", "off_topic", "invalid"}
        if status not in valid_statuses:
            logger.warning(f"Guardrail returned unexpected status '{status}', defaulting to pass")
            status  = "pass"
            message = None

        return {
            "guardrail_status":  status,
            "guardrail_message": message,
            "current_node":      "guardrail",
            "error":             None,
        }

    except json.JSONDecodeError as exc:
        logger.error(f"Guardrail JSON parse error: {exc}")
        return {
            "guardrail_status":  "pass",   # Safe default — never block on error
            "guardrail_message": None,
            "current_node":      "guardrail",
            "error":             None,
        }
    except Exception as exc:
        logger.error(f"Guardrail node unexpected error: {exc}")
        return {
            "guardrail_status":  "pass",   # Safe default — never block on error
            "guardrail_message": None,
            "current_node":      "guardrail",
            "error":             None,
        }
