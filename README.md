# MedBrief — Patient Health Briefing Prototype

A warm, patient-friendly medical information tool powered by LangGraph and Claude.

## Project structure

```
medbrief/
├── backend/
│   ├── __init__.py
│   ├── state.py                  ← PatientState TypedDict (shared by all nodes)
│   ├── graph.py                  ← LangGraph StateGraph assembly
│   ├── server.py                 ← FastAPI REST API
│   ├── requirements.txt
│   └── nodes/
│       ├── __init__.py
│       ├── guardrail_node.py     ← Node 1: Safety, crisis, relevance check
│       ├── extraction_node.py    ← Node 2: Entity extraction from patient input
│       ├── normalization_node.py ← Node 3: Map to clinical terms + condition ID
│       ├── confirmation_node.py  ← Node 4: Human-in-loop interrupt checkpoint
│       └── briefing_node.py      ← Node 5: Full sourced briefing (web search)
└── frontend/
    └── index.html                ← Complete UI (vanilla HTML/CSS/JS)
```

## Setup

```bash
# 1. Create and activate a virtual environment
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate

# 2. Install dependencies
pip install -r backend/requirements.txt

# 3. Set your API key
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY

# 4. Load environment
export $(cat .env | xargs)         # Windows: set ANTHROPIC_API_KEY=sk-ant-...
```

## Run

```bash
uvicorn backend.server:app --reload --port 8000
```

Open your browser: **http://localhost:8000/app**

## Pipeline nodes

| # | Node | Type | What it does |
|---|------|------|--------------|
| 1 | guardrail | LLM | Classifies input: pass / emergency / crisis / off_topic / invalid |
| 2 | extraction | LLM | Pulls symptoms, duration, body parts from patient's own words |
| 3 | normalization | LLM | Maps patient language → clinical terms + identifies condition |
| 4 | confirmation | Human-in-loop | Patient confirms or corrects the identified condition |
| 5 | briefing | LLM + Web Search | Generates full sourced patient briefing |

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/session/start` | Start pipeline — runs nodes 1-3, pauses for confirmation |
| POST | `/session/{id}/confirm` | Resume — runs node 5, returns briefing |
| GET  | `/session/{id}/state` | Debug: inspect raw LangGraph state |
| GET  | `/health` | Health check |

## API flow example

```bash
# Step 1: Start
curl -X POST http://localhost:8000/session/start \
  -H "Content-Type: application/json" \
  -d '{"raw_input": "My blood sugar is high and my feet tingle"}'

# Response includes thread_id and status: "awaiting_confirmation"

# Step 2: Confirm
curl -X POST http://localhost:8000/session/{thread_id}/confirm \
  -H "Content-Type: application/json" \
  -d '{"confirmed": true}'

# Response includes status: "complete" and full briefing
```
