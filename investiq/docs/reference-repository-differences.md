# Reference Repository Differences

This document explains how InvestIQ differs from the reference repository (https://github.com/ankitakulkarnigit/finance-intelligence-agent).

## Architecture Differences
* **Frontend:** The reference repository uses a Streamlit frontend. InvestIQ requires a fully-fledged professional React + TypeScript frontend.
* **Backend:** InvestIQ enforces a strict separation of concerns with a dedicated FastAPI REST backend that runs independently.
* **Agent Roles:** 
  * Reference: Research, Analysis, Sentiment, Prediction, and Report agents.
  * InvestIQ: Quantitative, Fundamental, Sentiment, Risk specialist agents, orchestrated by a Meta-Agent.
* **Risk Engine:** InvestIQ requires a deterministic Python-based risk engine (calculating Volatility and 95% VaR) that the LLM interprets, rather than delegating calculations to the LLM.
* **Predictive ML:** The reference repo centers on a generic explicit ML price prediction feature, whereas InvestIQ centers on explainable financial decision support (BUY/HOLD/SELL) via consensus.
* **Orchestration:** InvestIQ requires explicit multi-agent deliberation via a state graph (e.g., LangGraph), focusing on consensus and conflict resolution.
