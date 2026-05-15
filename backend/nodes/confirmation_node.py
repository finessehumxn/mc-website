"""
confirmation_node.py
─────────────────────
Node 4 in the MedBrief pipeline — the Human-in-the-Loop checkpoint.

This node uses LangGraph's interrupt() primitive to PAUSE the graph
mid-execution and hand control back to the API caller. The graph does
not resume until the frontend sends a POST to /session/{thread_id}/confirm.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HOW THE INTERRUPT PATTERN WORKS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Step 1 — graph.py compiles with: interrupt_before=["confirmation"]
         This tells LangGraph to checkpoint state BEFORE this node
         runs, then pause and return control to the invoker.

Step 2 — server.py's /session/start endpoint calls graph.invoke()
         The graph runs: guardrail → extraction → normalization
         Then hits the interrupt, saves state to MemorySaver, and
         returns the current state snapshot to the server.

Step 3 — server.py returns status="awaiting_confirmation" plus
         the normalization results to the frontend.

Step 4 — The frontend renders the confirmation card. Patient reads
         the identified condition and either:
           a) Taps "Yes, that sounds right" → confirmed=True
           b) Types their own condition  → override="Crohn's disease"

Step 5 — Frontend POSTs to /session/{thread_id}/confirm with the
         patient's decision.

Step 6 — server.py calls graph.invoke(Command(resume={...}), config)
         LangGraph loads the checkpointed state from MemorySaver,
         enters THIS node, and the interrupt() call returns the
         patient's response dict as its return value.

Step 7 — This node writes final_condition to state and returns.
         The graph proceeds to briefing_node.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Reads from state  : primary_condition, plain_condition_name, icd_code,
                    plain_reason, confidence, alternate_conditions
Writes to state   : user_confirmed, user_override_condition,
                    final_condition, current_node
"""

import logging
from langgraph.types import interrupt
from ..state import PatientState

logger = logging.getLogger(__name__)


def confirmation_node(state: PatientState) -> dict:
    """
    Human-in-the-loop checkpoint. Pauses graph and waits for patient input.

    The dict passed to interrupt() is the payload the API returns to the
    frontend as the "awaiting_confirmation" response — the frontend renders
    the confirmation card directly from this data.

    After the patient responds and graph.invoke(Command(resume=...)) is called,
    execution continues at the line AFTER interrupt() with user_response
    containing whatever the frontend POSTed to /confirm.
    """

    # If a prior node failed, skip the interrupt and pass a fallback condition
    if state.get("error"):
        logger.warning("confirmation_node skipping interrupt due to prior error")
        return {
            "user_confirmed":           False,
            "user_override_condition":  None,
            "final_condition":          state.get("primary_condition", ""),
            "current_node":             "confirmation",
        }

    # ── PAUSE HERE — control returns to the API ──────────────────────────
    # Everything in this dict is sent to the frontend as the confirmation payload.
    user_response = interrupt({
        "primary_condition":    state.get("primary_condition",    ""),
        "plain_condition_name": state.get("plain_condition_name", ""),
        "icd_code":             state.get("icd_code",             ""),
        "confidence":           state.get("confidence",           ""),
        "plain_reason":         state.get("plain_reason",         ""),
        "alternate_conditions": state.get("alternate_conditions", []),
        "question":             "Does this sound like what you've been experiencing?",
    })
    # ── GRAPH RESUMES HERE after POST /session/{thread_id}/confirm ───────

    confirmed = user_response.get("confirmed", True)
    override  = (user_response.get("override") or "").strip()

    # Determine the final condition that briefing_node will use
    if override:
        final_condition = override
    else:
        final_condition = state.get("primary_condition", "")

    logger.info(
        f"confirmation_node resolved: confirmed={confirmed}, "
        f"override='{override}', final='{final_condition}'"
    )

    return {
        "user_confirmed":           confirmed,
        "user_override_condition":  override or None,
        "final_condition":          final_condition,
        "current_node":             "confirmation",
        "error":                    None,
    }
