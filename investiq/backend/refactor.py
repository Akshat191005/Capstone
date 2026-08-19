import os
import glob
import re

for file_path in glob.glob('c:/Users/DELL/Desktop/Capstone/investiq/backend/app/agents/*.py'):
    # skip llm_factory.py and state.py
    if 'llm_factory.py' in file_path or 'state.py' in file_path or '__init__.py' in file_path:
        continue
        
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove import of ChatGoogleGenerativeAI
    content = re.sub(r'from langchain_google_genai import ChatGoogleGenerativeAI\r?\n', '', content)
    
    # Add import of llm_factory
    if 'from .llm_factory import get_llm' not in content:
        content = content.replace('from .state import AgentState', 'from .state import AgentState\nfrom .llm_factory import get_llm')
    
    # Remove old get_llm definition
    # Need to remove:
    # def get_llm():
    #     return ChatGoogleGenerativeAI(model="gemini-3.5-flash", temperature=0, google_api_key=os.environ.get("GEMINI_API_KEY"))
    
    pattern = r'def get_llm\(\):\s*return ChatGoogleGenerativeAI\([^)]+\)'
    content = re.sub(pattern, '', content)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
