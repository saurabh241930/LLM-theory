import re

with open('sidebar.js', 'r') as f:
    content = f.read()

# Extract the GEN AI array block
gen_ai_pattern = re.compile(r"category:\s*'GEN AI',\s*links:\s*\[\s*(.*?)\s*\]\s*\}", re.DOTALL)
match = gen_ai_pattern.search(content)

if match:
    links_block = match.group(1)
    # Extract individual link objects
    link_objs = re.findall(r"\{\s*id:\s*'[^']+',\s*title:\s*'[^']+'\s*\}", links_block)
    
    # Separate Contents Hub which has no number
    hub = link_objs[0]
    rest = link_objs[1:]
    
    # Find Memory
    memory_obj = None
    for obj in rest:
        if 'genai_memory.html' in obj:
            memory_obj = obj
            break
            
    if memory_obj:
        rest.remove(memory_obj)
        # Insert at index 3 (after embeddings, token, prompt engineering)
        rest.insert(3, memory_obj)
        
        # Renumber
        new_rest = []
        for i, obj in enumerate(rest):
            id_match = re.search(r"id:\s*'([^']+)'", obj)
            title_match = re.search(r"title:\s*'([^']+)'", obj)
            
            if id_match and title_match:
                cid = id_match.group(1)
                old_title = title_match.group(1)
                
                # Strip old number
                clean_title = re.sub(r'^\d+\.\s*', '', old_title)
                new_title = f"{i+1}. {clean_title}"
                new_obj = f"{{ id: '{cid}', title: '{new_title}' }}"
                new_rest.append(new_obj)
        
        # Reconstruct block
        all_links = [hub] + new_rest
        new_links_block = ",\n                ".join(all_links)
        
        new_content = content.replace(links_block, new_links_block)
        
        with open('sidebar.js', 'w') as f:
            f.write(new_content)
        print("Updated sidebar.js successfully!")
    else:
        print("Memory link not found in Gen AI block.")
else:
    print("GEN AI block not found.")
