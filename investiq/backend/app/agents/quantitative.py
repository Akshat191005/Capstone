import os
from langchain_core.prompts import ChatPromptTemplate
from .state import AgentState
from .llm_factory import get_llm
import json


def quant_agent(state: AgentState) -> dict:
    """Analyzes the technical indicators and generates a quantitative signal."""
    llm = get_llm(state)
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are an expert Quantitative Analyst. Analyze the technical indicators and provide a trading signal (BUY/HOLD/SELL) with reasoning. Your output must be valid JSON with keys: 'signal' and 'reasoning'."),
        ("human", "Symbol: {symbol}\nQuant Indicators: {indicators}")
    ])
    
    chain = prompt | llm
    response = chain.invoke({
        "symbol": state.get("symbol"),
        "indicators": json.dumps(state.get("quant_indicators", {}))
    })
    
    try:
        # Assuming the LLM returns JSON text, we parse it
        # If it includes markdown code blocks, strip them
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
        
    return {"quant_analysis": analysis}
