# Requirements Traceability

| Requirement | Source | File/Module | API | Frontend Screen |
|---|---|---|---|---|
| Professional React + TS frontend | AI Build Prompt | `frontend/` | N/A | All |
| FastAPI REST backend | AI Build Prompt | `backend/app/api/` | All | N/A |
| Ingest OHLCV/Fundamentals (yfinance) | AI Build Prompt | `backend/app/data/` | `/stocks/` | Dashboard |
| Ingest News (DuckDuckGo) | AI Build Prompt | `backend/app/data/` | `/stocks/{symbol}/news` | News/Sentiment |
| Deterministic Risk Engine | AI Build Prompt | `backend/app/risk/` | `/analysis/{id}/risk` | Risk Dashboard |
| FinBERT Sentiment Engine | AI Build Prompt | `backend/app/sentiment/` | `/stocks/{symbol}/news` | News/Sentiment |
| Quant Agent | AI Build Prompt | `backend/app/agents/quantitative.py` | `/analysis/` | Multi-Agent View |
| Fundamental Agent | AI Build Prompt | `backend/app/agents/fundamental.py` | `/analysis/` | Multi-Agent View |
| Sentiment Agent | AI Build Prompt | `backend/app/agents/sentiment.py` | `/analysis/` | Multi-Agent View |
| Risk Agent | AI Build Prompt | `backend/app/agents/risk.py` | `/analysis/` | Multi-Agent View |
| Meta-Agent | AI Build Prompt | `backend/app/agents/meta.py` | `/analysis/` | Analysis Result |
| State-based Orchestration | AI Build Prompt | `backend/app/orchestration/` | `/analysis/` | N/A |
