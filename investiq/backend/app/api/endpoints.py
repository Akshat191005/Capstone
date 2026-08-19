from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional
from app.orchestration.graph import workflow
from starlette.concurrency import run_in_threadpool

router = APIRouter()

class AnalyzeRequest(BaseModel):
    symbol: str
    provider: Optional[str] = None
    api_key: Optional[str] = None

class AnalyzeResponse(BaseModel):
    symbol: str
    final_decision: Dict[str, Any]
    risk_metrics: Optional[Dict[str, Any]]
    sentiment_scores: Optional[Dict[str, Any]]
    is_demo_mode: bool = False

@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_stock(request: AnalyzeRequest):
    """
    Run the full LangGraph orchestration pipeline for a given stock symbol.
    """
    try:
        initial_state = {
            "symbol": request.symbol.upper(),
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
            symbol=result.get("symbol"),
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
