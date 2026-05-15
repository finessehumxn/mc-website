"""
state.py
────────
Single source of truth for the entire MedBrief LangGraph pipeline.
Every node receives the full PatientState and returns only the fields it changes.
LangGraph merges partial updates automatically between nodes.
"""

from typing import TypedDict, List, Optional, Dict, Any


class PatientState(TypedDict):

    # ── 1. RAW INPUT ───────────────────────────────────────────────────────
    raw_input: str                       # Exactly what the patient typed — never modified

    # ── 2. GUARDRAIL NODE ─────────────────────────────────────────────────
    # Populated after guardrail_node runs. Controls routing before extraction.
    guardrail_status: str                # "pass" | "emergency" | "crisis" | "off_topic" | "invalid"
    guardrail_message: Optional[str]     # Human-friendly message shown when guardrail blocks

    # ── 3. EXTRACTION NODE ────────────────────────────────────────────────
    # Populated after extraction_node runs.
    symptoms: List[str]                  # e.g. ["tingling in feet", "always thirsty"]
    duration: List[str]                  # e.g. ["for the past few months", "started last year"]
    severity: List[str]                  # e.g. ["really bad", "comes and goes", "constant"]
    medications: List[str]               # e.g. ["metformin 500mg"] or []
    body_parts: List[str]                # e.g. ["feet", "hands", "chest"]
    emotional_context: List[str]         # e.g. ["scared", "worried", "frustrated"]

    # ── 4. NORMALIZATION NODE ─────────────────────────────────────────────
    # Populated after normalization_node runs.
    term_mappings: List[Dict[str, str]]  # [{patient_said, doctors_call_it, icd_snippet, simple_meaning}]
    primary_condition: str               # Clinical name e.g. "Type 2 Diabetes Mellitus"
    plain_condition_name: str            # Everyday name e.g. "Type 2 Diabetes"
    icd_code: str                        # e.g. "E11.9"
    confidence: str                      # "High" | "Medium" | "Low"
    plain_reason: str                    # Why this condition fits, in plain English
    alternate_conditions: List[str]      # Other possibilities in plain language

    # ── 5. CONFIRMATION NODE (human-in-the-loop) ──────────────────────────
    # Populated after patient confirms or overrides via the frontend.
    user_confirmed: bool                 # True = patient agreed with AI suggestion
    user_override_condition: Optional[str]  # Non-empty if patient typed their own condition
    final_condition: str                 # The resolved condition name used for briefing

    # ── 6. BRIEFING NODE ──────────────────────────────────────────────────
    # Populated after briefing_node runs. This is what the frontend renders.
    briefing: Optional[Dict[str, Any]]   # Full structured briefing dict (see briefing_node.py)

    # ── 7. PIPELINE METADATA ──────────────────────────────────────────────
    current_node: str                    # Name of the last node that wrote to state
    error: Optional[str]                 # Non-null if any node encountered an error
    thread_id: Optional[str]             # LangGraph MemorySaver thread ID
