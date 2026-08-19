import os
from langchain_core.prompts import ChatPromptTemplate
from .state import AgentState
from .llm_factory import get_llm
import json


def risk_agent(state: AgentState) -> dict:
    """Analyzes the risk metrics (VaR, Volatility) and generates a risk signal."""
    llm = get_llm(state)
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are an expert Risk Manager. Analyze the VaR, Volatility, and Drawdown metrics and provide a trading signal (BUY/HOLD/SELL) with reasoning. Be very cautious of high volatility or VaR. Your output must be valid JSON with keys: 'signal' and 'reasoning'."),
        ("human", "Symbol: {symbol}\nRisk Metrics: {risk}")
    ])
    
    chain = prompt | llm
    response = chain.invoke({
        "symbol": state.get("symbol"),
        "risk": json.dumps(state.get("risk_metrics", {}))
    })
    
    try:
        content = response.content
        if isinstance(content, list):
            content = content[0].get("text", "") if isinstance(content[0], dict) else str(content[0])
        elif not isinstance(content, str):
            content = str(content)
            
        content = content.strip()
        if content.startswith("```json"):
            content = content[7:-3].strip()
        elif content.startswith("```"):
            content = content[3:-3].strip()
        analysis = json.loads(content)
    except Exception as e:
        analysis = {"signal": "HOLD", "reasoning": f"Failed to parse LLM output: {e}"}
        
    return {"risk_analysis": analysis}
