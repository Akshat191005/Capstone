from langgraph.graph import StateGraph, START, END
from app.agents.state import AgentState
from app.agents.quantitative import quant_agent
from app.agents.fundamental import fundamental_agent
from app.agents.sentiment import sentiment_agent
from app.agents.risk import risk_agent
from app.agents.meta import meta_agent
from app.data.market_data import MarketDataAdapter
from app.data.news_data import NewsDataAdapter
from app.risk.engine import RiskEngine
from app.quantitative.indicators import QuantitativeEngine
from app.sentiment.engine import SentimentEngine

# Lazy load sentiment engine
_sentiment_engine = None

def get_sentiment_engine():
    global _sentiment_engine
    if _sentiment_engine is None:
        _sentiment_engine = SentimentEngine()
    return _sentiment_engine

def ingest_data_node(state: AgentState) -> dict:
    symbol = state.get("symbol")
    
    # 1. Fetch Data
    historical_df = MarketDataAdapter.get_historical_data(symbol)
    if historical_df is None or historical_df.empty:
        raise ValueError(f"No market data found for symbol: {symbol}")
        
    fundamentals = MarketDataAdapter.get_fundamentals(symbol)
    news = NewsDataAdapter.get_company_news(symbol)
    
    # 2. Run Engines
    risk_metrics = RiskEngine.calculate_metrics(historical_df)
    
    # Quant indicators and signals
    quant_df = QuantitativeEngine.calculate_indicators(historical_df)
    quant_signals = QuantitativeEngine.generate_signals(quant_df)
    
    # Sentiment analysis
    engine = get_sentiment_engine()
    news_sentiment = engine.analyze_news(news)
    aggregate_sentiment = engine.get_aggregate_sentiment(news_sentiment)
    
    return {
        "market_data": None, # Removed historical_df.to_dict() to prevent state bloat
        "news_data": news,
        "fundamentals": fundamentals,
        "risk_metrics": risk_metrics,
        "quant_indicators": quant_signals,
        "sentiment_scores": aggregate_sentiment
    }

def build_graph():
    builder = StateGraph(AgentState)
    
    # Add nodes
    builder.add_node("ingest", ingest_data_node)
    builder.add_node("quant", quant_agent)
    builder.add_node("fundamental", fundamental_agent)
    builder.add_node("sentiment", sentiment_agent)
    builder.add_node("risk", risk_agent)
    builder.add_node("meta", meta_agent)
    
    # Define edges (Sequential for simplicity)
    builder.add_edge(START, "ingest")
    builder.add_edge("ingest", "quant")
    builder.add_edge("quant", "fundamental")
    builder.add_edge("fundamental", "sentiment")
    builder.add_edge("sentiment", "risk")
    builder.add_edge("risk", "meta")
    builder.add_edge("meta", END)
    
    # Compile graph
    return builder.compile()

# Global graph instance
workflow = build_graph()
