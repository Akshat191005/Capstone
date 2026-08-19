import os
from langchain_core.prompts import ChatPromptTemplate
from .state import AgentState
from .llm_factory import get_llm
import json


def sentiment_agent(state: AgentState) -> dict:
    """Analyzes news sentiment scores and generates a sentiment signal."""
    llm = get_llm(state)
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are an expert Sentiment Analyst. Analyze the aggregated sentiment scores from recent news and provide a trading signal (BUY/HOLD/SELL) with reasoning. Your output must be valid JSON with keys: 'signal' and 'reasoning'."),
        ("human", "Symbol: {symbol}\nSentiment Scores: {sentiment}")
    ])
    
    chain = prompt | llm
    response = chain.invoke({
        "symbol": state.get("symbol"),
        "sentiment": json.dumps(state.get("sentiment_scores", {}))
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
        
    return {"sentiment_analysis": analysis}
