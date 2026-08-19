import glob

for file_path in glob.glob('c:/Users/DELL/Desktop/Capstone/investiq/backend/app/agents/*.py'):
    if 'llm_factory.py' in file_path or 'state.py' in file_path or '__init__.py' in file_path:
        continue
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Clean up floating parenthesis and empty lines
    content = content.replace('\n)\n', '\n')
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
