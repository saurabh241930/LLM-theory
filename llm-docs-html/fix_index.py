import re

def fix_index():
    with open('index.html', 'r', encoding='utf-8') as f:
        content = f.read()

    match = re.search(r'(<ul class="chapter-list">\s*)(<li class="chapter-item">.*?)(</ul>)', content, re.DOTALL)
    if not match:
        print("Could not find the GEN AI list.")
        return

    prefix = match.group(1)
    list_items_raw = match.group(2)
    suffix = match.group(3)

    blocks = re.split(r'(<li class="chapter-item">)', list_items_raw)
    
    items = []
    for i in range(1, len(blocks), 2):
        items.append(blocks[i] + blocks[i+1])

    new_memory_item = """<li class="chapter-item">
                <span class="chapter-number">4</span>
                <a href="genai_memory.html" class="chapter-link">Memory in Gen AI</a>
                <span class="chapter-desc">Statelessness, Buffer, Sliding Windows, and Vector Memory.</span>
            </li>\n            """
            
    # Insert it at index 3 (which will be the 4th item)
    items.insert(3, new_memory_item)
    
    # Renumber all items sequentially up to the end
    new_items = []
    for idx, item in enumerate(items):
        new_item = re.sub(
            r'(<span class="chapter-number">)\d+(</span>)', 
            f'\\g<1>{idx + 1}\\g<2>', 
            item
        )
        new_items.append(new_item)
        
    new_list_content = "".join(new_items)
    new_content = content[:match.start(2)] + new_list_content + content[match.end(2):]
    
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Inserted Memory at #4 and resequenced index.html successfully!")

if __name__ == '__main__':
    fix_index()
