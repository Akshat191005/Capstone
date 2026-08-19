import os
import logging
from typing import Optional, Dict, Any

logger = logging.getLogger(__name__)

def get_llm(state: Optional[Dict[str, Any]] = None):
    """
    Returns the appropriate LangChain chat model.
    Prioritizes the provider and api_key passed in from the frontend via the state.
    Falls back to .env variables if no user-provided key is available.
    """
    
    # 1. User-provided key from the frontend UI
    if state and state.get("api_key") and state.get("provider"):
        provider = state.get("provider", "").lower()
        api_key = state.get("api_key")
        
        if provider == "openai":
            from langchain_openai import ChatOpenAI
            return ChatOpenAI(model="gpt-4o-mini", temperature=0, api_key=api_key)
            
        elif provider == "anthropic":
            from langchain_anthropic import ChatAnthropic
            return ChatAnthropic(model="claude-3-5-sonnet-latest", temperature=0, api_key=api_key)
            
        elif provider == "gemini":
            from langchain_google_genai import ChatGoogleGenerativeAI
            return ChatGoogleGenerativeAI(model="gemini-3.5-flash", temperature=0, google_api_key=api_key)
            
        else:
            raise ValueError(f"Unsupported provider from UI: {provider}")

    # 2. Server-side fallback from .env
    # Priority: OpenAI > Anthropic > Gemini > Groq
    if os.environ.get("OPENAI_API_KEY"):
        from langchain_openai import ChatOpenAI
        return ChatOpenAI(model="gpt-4o-mini", temperature=0)
        
    elif os.environ.get("ANTHROPIC_API_KEY"):
        from langchain_anthropic import ChatAnthropic
        return ChatAnthropic(model="claude-3-5-sonnet-latest", temperature=0)
        
    elif os.environ.get("GEMINI_API_KEY"):
        from langchain_google_genai import ChatGoogleGenerativeAI
        return ChatGoogleGenerativeAI(model="gemini-3.5-flash", temperature=0)
        
    elif os.environ.get("GROQ_API_KEY"):
        from langchain_groq import ChatGroq
        return ChatGroq(model_name="llama-3.1-70b-versatile", temperature=0)
        
    else:
        raise ValueError("No valid API key found. Please provide an API key in the UI or in the server .env file.")
