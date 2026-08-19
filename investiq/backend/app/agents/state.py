from typing import TypedDict, Dict, Any, List, Optional

class AgentState(TypedDict):
    symbol: str
    provider: Optional[str]
    api_key: Optional[str]
    
    # Raw Data
    market_data: Optional[Dict[str, Any]]
    news_data: Optional[List[Dict[str, str]]]
    fundamentals: Optional[Dict[str, Any]]
    
    # Engine Outputs
    risk_metrics: Optional[Dict[str, Any]]
    quant_indicators: Optional[Dict[str, Any]]
    sentiment_scores: Optional[Dict[str, Any]]
    
    # Agent Outputs (from LLM)
    quant_analysis: Optional[Dict[str, Any]]
    fundamental_analysis: Optional[Dict[str, Any]]
    sentiment_analysis: Optional[Dict[str, Any]]
    risk_analysis: Optional[Dict[str, Any]]
    
    # Final Output
    final_decision: Optional[Dict[str, Any]]
