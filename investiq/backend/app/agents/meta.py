import os
from langchain_core.prompts import ChatPromptTemplate
from .state import AgentState
from .llm_factory import get_llm
import json


def meta_agent(state: AgentState) -> dict:
    """Synthesizes all specialist agent outputs into a final decision."""
    llm = get_llm(state)
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are the Chief Investment Officer (Meta-Agent). Review the signals from the Quant, Fundamental, Sentiment, and Risk agents. Resolve any conflicts, weigh the evidence, and make a final investment decision (BUY/HOLD/SELL). Provide detailed reasoning that references the sub-agents' findings. Your output must be valid JSON with keys: 'final_signal', 'confidence_score' (0.0 to 1.0), and 'reasoning'."),
        ("human", "Symbol: {symbol}\n\nQuant: {quant}\nFundamental: {fundamental}\nSentiment: {sentiment}\nRisk: {risk}")
    ])
    
    chain = prompt | llm
    response = chain.invoke({
        "symbol": state.get("symbol"),
        "quant": json.dumps(state.get("quant_analysis", {})),
        "fundamental": json.dumps(state.get("fundamental_analysis", {})),
        "sentiment": json.dumps(state.get("sentiment_analysis", {})),
        "risk": json.dumps(state.get("risk_analysis", {}))
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
        analysis = {"final_signal": "HOLD", "confidence_score": 0.0, "reasoning": f"Failed to parse LLM output: {e}"}
        
    return {"final_decision": analysis}
