# InvestIQ

InvestIQ is an autonomous multi-agent system for financial consensus and risk-weighted investment advisory, targeting Indian equities (NSE/BSE).

## Architecture
- **Frontend:** React + TypeScript
- **Backend:** FastAPI (Python 3.11+)
- **LLM/Orchestration:** LangGraph (State-based multi-agent deliberation)

## Setup Instructions

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows
venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Set your API keys in .env
uvicorn app.main:app --reload
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. Docker (Optional)
```bash
docker-compose up -d
```
