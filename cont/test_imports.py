"""
test_imports.py
────────────────
Run this from the project root to diagnose all import issues before
starting the server. Shows exactly which packages are missing or broken.

Usage:
    python test_imports.py

Run this AFTER activating your virtual environment:
    source .venv/bin/activate     (Mac/Linux)
    .venv\\Scripts\\activate        (Windows)
"""

import sys
import subprocess

print()
print("── MedBrief Import Diagnostics ──────────────────────────")
print(f"   Python: {sys.executable}")
print(f"   Version: {sys.version.split()[0]}")
print()

tests = [
    # Third-party packages (must be installed via pip)
    ("anthropic",                "import anthropic",                                    "pip"),
    ("fastapi",                  "import fastapi",                                      "pip"),
    ("uvicorn",                  "import uvicorn",                                      "pip"),
    ("pydantic",                 "import pydantic",                                     "pip"),
    ("langgraph",                "from langgraph.graph import StateGraph, START, END",  "pip"),
    ("langgraph.checkpoint",     "from langgraph.checkpoint.memory import MemorySaver","pip"),
    ("langgraph.types.interrupt","from langgraph.types import interrupt",               "pip"),
    ("langgraph.types.Command",  "from langgraph.types import Command",                 "pip"),
    ("python_dotenv",            "from dotenv import load_dotenv",                      "pip"),

    # Project modules (relative imports from project root)
    ("backend package",          "import backend",                                      "project"),
    ("backend.state",            "from backend.state import PatientState",              "project"),
    ("backend.nodes package",    "import backend.nodes",                                "project"),
    ("guardrail_node",           "from backend.nodes.guardrail_node import guardrail_node",          "project"),
    ("extraction_node",          "from backend.nodes.extraction_node import extraction_node",        "project"),
    ("normalization_node",       "from backend.nodes.normalization_node import normalization_node",  "project"),
    ("confirmation_node",        "from backend.nodes.confirmation_node import confirmation_node",    "project"),
    ("briefing_node",            "from backend.nodes.briefing_node import briefing_node",            "project"),
    ("backend.graph",            "from backend.graph import graph",                     "project"),
    ("backend.server",           "from backend.server import app",                     "project"),
]

pip_failures    = []
project_failures = []

for name, stmt, category in tests:
    try:
        exec(stmt)
        print(f"  ✓  {name}")
    except Exception as e:
        print(f"  ✗  {name}")
        print(f"       {e}")
        if category == "pip":
            pip_failures.append((name, str(e)))
        else:
            project_failures.append((name, str(e)))

print()
print("── Summary ──────────────────────────────────────────────")

if not pip_failures and not project_failures:
    print()
    print("  All imports passed. You're ready to start the server:")
    print()
    print("  uvicorn backend.server:app --reload --port 8000")
    print()

if pip_failures:
    print()
    print(f"  {len(pip_failures)} package(s) missing. Fix with:")
    print()
    print("  pip install -r backend/requirements.txt")
    print()
    print("  If that doesn't fix it, your venv may not be active.")
    print("  Run:  source .venv/bin/activate  (Mac/Linux)")
    print("  Or:   .venv\\Scripts\\activate     (Windows)")
    print()

if project_failures:
    print()
    print(f"  {len(project_failures)} project import(s) failed.")
    print()
    print("  Make sure you're running this from the project root:")
    print("  (the folder that contains the 'backend/' directory)")
    print()
    print("  Check that these files exist:")
    print("    backend/__init__.py")
    print("    backend/nodes/__init__.py")
    print()

sys.exit(1 if (pip_failures or project_failures) else 0)
