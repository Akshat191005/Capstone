import os
import glob

old_str = '''        content = response.content.strip()
        if content.startswith("`json"):
            content = content[7:-3]'''

new_str = '''        content = response.content
        if isinstance(content, list):
            content = content[0].get("text", "") if isinstance(content[0], dict) else str(content[0])
        elif not isinstance(content, str):
            content = str(content)
        content = content.strip()
        if content.startswith("`json"):
            content = content[7:-3].strip()
        elif content.startswith("`"):
            content = content[3:-3].strip()'''

for file_path in glob.glob('c:/Users/DELL/Desktop/Capstone/investiq/backend/app/agents/*.py'):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Try different newline combinations
    old_str_win = old_str.replace('\n', '\r\n')
    
    if old_str in content:
        content = content.replace(old_str, new_str)
    elif old_str_win in content:
        content = content.replace(old_str_win, new_str.replace('\n', '\r\n'))
        
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
