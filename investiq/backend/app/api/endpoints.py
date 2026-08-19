from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional
from app.orchestration.graph import workflow

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
        # Invoke the graph synchronously
        result = workflow.invoke(initial_state)
        
        return AnalyzeResponse(
            symbol=result.get("symbol"),
            final_decision=result.get("final_decision", {}),
            risk_metrics=result.get("risk_metrics"),
            sentiment_scores=result.get("sentiment_scores")
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
