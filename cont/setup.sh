#!/bin/bash
# ─────────────────────────────────────────────────────────────
# MedBrief Setup Script (Mac / Linux)
# Run this ONCE from your project root:  bash setup.sh
# ─────────────────────────────────────────────────────────────

set -e  # Exit on any error

echo ""
echo "── MedBrief Setup ────────────────────────────────────────"
echo ""

# 1. Create virtual environment inside the project
echo "▸ Creating virtual environment (.venv)..."
python3 -m venv .venv
echo "  Done."

# 2. Activate it
echo "▸ Activating .venv..."
source .venv/bin/activate
echo "  Done."

# 3. Upgrade pip quietly
echo "▸ Upgrading pip..."
pip install --upgrade pip --quiet
echo "  Done."

# 4. Install all dependencies
echo "▸ Installing dependencies from requirements.txt..."
pip install -r backend/requirements.txt
echo "  Done."

# 5. Verify critical imports
echo ""
echo "▸ Verifying imports..."
python -c "
import sys
tests = [
    ('anthropic',              'import anthropic'),
    ('langgraph',              'from langgraph.graph import StateGraph, START, END'),
    ('langgraph.types',        'from langgraph.types import interrupt, Command'),
    ('langgraph.checkpoint',   'from langgraph.checkpoint.memory import MemorySaver'),
    ('fastapi',                'import fastapi'),
    ('uvicorn',                'import uvicorn'),
]
all_ok = True
for name, stmt in tests:
    try:
        exec(stmt)
        print(f'  OK  {name}')
    except Exception as e:
        print(f'  FAIL {name}: {e}')
        all_ok = False
if all_ok:
    print()
    print('  All imports OK.')
else:
    print()
    print('  Some imports failed. Check errors above.')
    sys.exit(1)
"

# 6. Print next steps
echo ""
echo "── Setup complete ────────────────────────────────────────"
echo ""
echo "  Next steps:"
echo ""
echo "  1. Copy .env.example to .env and add your API key:"
echo "     cp .env.example .env"
echo ""
echo "  2. In VS Code:"
echo "     Ctrl+Shift+P → 'Python: Select Interpreter'"
echo "     Choose:  ./.venv/bin/python"
echo ""
echo "  3. Start the server:"
echo "     source .venv/bin/activate"
echo "     uvicorn backend.server:app --reload --port 8000"
echo ""
echo "  4. Open the app:"
echo "     http://localhost:8000/app"
echo ""
