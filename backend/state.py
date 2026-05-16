from typing import TypedDict, List, Optional, Dict, Any


class PatientState(TypedDict, total=False):
    # ── INPUT ──────────────────────────────────────────────────────────────
    raw_input: str
    image_data: Optional[str]
    image_media_type: Optional[str]
    user_id: Optional[str]

    # ── GUARDRAIL NODE OUTPUT ──────────────────────────────────────────────
    guardrail_status: str
    guardrail_message: Optional[str]

    # ── EXTRACTION NODE OUTPUT ─────────────────────────────────────────────
    extraction: Optional[Dict[str, Any]]

    # ── NORMALIZATION NODE OUTPUT ──────────────────────────────────────────
    normalization: Optional[Dict[str, Any]]

    # ── VISION NODE OUTPUT ────────────────────────────────────────────────
    image_analysis: Optional[Dict[str, Any]]

    # ── CONFIRMATION NODE (human-in-the-loop) ─────────────────────────────
    confirmed: bool
    final_condition: Optional[str]

    # ── BRIEFING NODE OUTPUT ──────────────────────────────────────────────
    briefing: Optional[Dict[str, Any]]

    # ── METADATA ──────────────────────────────────────────────────────────
    current_node: str
    error: Optional[str]
