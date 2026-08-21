from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Dict, Any, Optional, List
from app.orchestration.graph import workflow
from app.data.symbol_resolver import resolve_symbol, search_symbols
from starlette.concurrency import run_in_threadpool

router = APIRouter()

class AnalyzeRequest(BaseModel):
    symbol: str
    provider: Optional[str] = None
    api_key: Optional[str] = None

class AnalyzeResponse(BaseModel):
    symbol: str
    resolved_symbol: str
    final_decision: Dict[str, Any]
    risk_metrics: Optional[Dict[str, Any]]
    sentiment_scores: Optional[Dict[str, Any]]
    is_demo_mode: bool = False

class SymbolSuggestion(BaseModel):
    symbol: str
    name: str
    exchange: str
    type: str
    logo_url: str = ""

@router.get("/search", response_model=List[SymbolSuggestion])
async def search_stock_symbols(q: str = Query(..., min_length=1, description="Company name or partial ticker")):
    """
    Search for stock symbols by company name or ticker (used for autocomplete).
    """
    try:
        results = await run_in_threadpool(search_symbols, q)
        return results
    except Exception as e:
        print(f"Symbol search error: {e}")
        return []

@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_stock(request: AnalyzeRequest):
    """
    Run the full LangGraph orchestration pipeline for a given stock symbol.
    Accepts company names, typos, or exact tickers — resolves to the correct symbol automatically.
    """
    try:
        raw_input = request.symbol.strip()
        
        # Resolve company name / typo → actual ticker symbol
        resolved = await run_in_threadpool(resolve_symbol, raw_input)
        if not resolved:
            raise ValueError(
                f"Could not find a stock symbol for '{raw_input}'. "
                f"Try a specific ticker like 'RELIANCE.NS', 'AAPL', or 'TCS.NS'."
            )

        initial_state = {
            "symbol": resolved,
            "provider": request.provider,
            "api_key": request.api_key
        }
        # Invoke the graph in a threadpool so it doesn't block the event loop
        result = await run_in_threadpool(workflow.invoke, initial_state)
        
        final_decision = result.get("final_decision", {})
        final_decision["quant_analysis"] = result.get("quant_analysis")
        final_decision["fundamental_analysis"] = result.get("fundamental_analysis")
        final_decision["sentiment_analysis"] = result.get("sentiment_analysis")
        final_decision["risk_analysis"] = result.get("risk_analysis")

        news_data = result.get("news_data", [])
        is_demo = False
        if news_data and isinstance(news_data, list):
            if news_data[0].get("source") == "Demo Dataset":
                is_demo = True

        return AnalyzeResponse(
            symbol=raw_input,          # original user input
            resolved_symbol=resolved,  # what was actually analyzed
            final_decision=final_decision,
            risk_metrics=result.get("risk_metrics"),
            sentiment_scores=result.get("sentiment_scores"),
            is_demo_mode=is_demo
        )
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        print(f"Server Error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error during analysis.")
