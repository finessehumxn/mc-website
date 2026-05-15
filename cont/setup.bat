@echo off
REM ─────────────────────────────────────────────────────────────
REM MedBrief Setup Script (Windows)
REM Run this ONCE from your project root:  setup.bat
REM ─────────────────────────────────────────────────────────────

echo.
echo ── MedBrief Setup ────────────────────────────────────────
echo.

echo Creating virtual environment (.venv)...
python -m venv .venv
if errorlevel 1 (echo ERROR: Could not create venv. Is Python installed? & exit /b 1)
echo   Done.

echo Activating .venv...
call .venv\Scripts\activate.bat
echo   Done.

echo Upgrading pip...
pip install --upgrade pip --quiet
echo   Done.

echo Installing dependencies...
pip install -r backend\requirements.txt
if errorlevel 1 (echo ERROR: pip install failed. & exit /b 1)
echo   Done.

echo.
echo Verifying imports...
python -c "tests=[('anthropic','import anthropic'),('langgraph','from langgraph.graph import StateGraph'),('langgraph.types','from langgraph.types import interrupt, Command'),('fastapi','import fastapi')]; [print('  OK  '+n) if not exec(s) else None for n,s in tests]"
echo.

echo ── Setup complete ────────────────────────────────────────
echo.
echo   Next steps:
echo.
echo   1. Copy .env.example to .env and add your API key
echo      copy .env.example .env
echo.
echo   2. In VS Code:
echo      Ctrl+Shift+P → Python: Select Interpreter
echo      Choose: .\.venv\Scripts\python.exe
echo.
echo   3. Start the server:
echo      .venv\Scripts\activate
echo      uvicorn backend.server:app --reload --port 8000
echo.
echo   4. Open: http://localhost:8000/app
echo.
pause
