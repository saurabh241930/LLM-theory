import re

def split_html(file_path, base_name1, title1, sub1, base_name2, title2, sub2, split_regex):
    with open(file_path, 'r') as f:
        content = f.read()

    # Find the header section to reuse
    header_match = re.search(r'(<!DOCTYPE html>.*?<header>)\s*<h1>.*?</h1>\s*<div class="subtitle">.*?</div>\s*(</header>\s*<div class="content-wrapper">)', content, flags=re.DOTALL)
    if not header_match:
        print(f"Error parsing header in {file_path}")
        return
    
    pre_header = header_match.group(1)
    post_header = header_match.group(2)
    
    # Find all QA containers
    qa_blocks = re.findall(r'<div class="qa-container" id="q(\d+)">.*?</div>\s*</div>\s*</div>', content, flags=re.DOTALL)
    
    # Alternatively, just split the content string at the specified question ID
    # split_regex is the literal string like '<div class="qa-container" id="q52">'
    parts = content.split(split_regex)
    
    if len(parts) != 2:
        print(f"Could not split {file_path}")
        return
        
    part1_content = parts[0]
    
    # part1 needs the closing tags
    part1_full = re.sub(r'<h1>.*?</h1>', f'<h1>{title1}</h1>', pre_header) + f'\n        <div class="subtitle">{sub1}</div>\n    ' + post_header + part1_content.split('<div class="content-wrapper">')[1] + '    </div>\n    <script src="animations.js"></script>\n    <script src="sidebar.js"></script>\n</body>\n</html>\n'
    
    # part2 needs the opening tags
    part2_full = re.sub(r'<h1>.*?</h1>', f'<h1>{title2}</h1>', pre_header) + f'\n        <div class="subtitle">{sub2}</div>\n    ' + post_header + '\n' + split_regex + parts[1]
    
    with open(base_name1, 'w') as f:
        f.write(part1_full)
        
    with open(base_name2, 'w') as f:
        f.write(part2_full)

# Split System Design (1-13, 14-26)
split_html('system_design.html', 'system_design_patterns.html', 'System Design Patterns', 'Core Architectures & Components', 'system_design_scaling.html', 'System Design Scaling', 'High Availability & Traffic Management', '<div class="qa-container" id="q14">')

# Split API & Security (27-33, 34-41)
split_html('api_security.html', 'api_design.html', 'API Design', 'REST, GraphQL & Webhooks', 'api_security_auth.html', 'API Security', 'Authentication & Authorization', '<div class="qa-container" id="q34">')

# Split Frontend (42-52, 53-62)
split_html('frontend.html', 'frontend_architecture.html', 'Frontend Architecture', 'Core Rendering & Layout', 'frontend_performance.html', 'Frontend Performance', 'State, Components & Optimization', '<div class="qa-container" id="q53">')

# Split Backend (63-67, 68-72)
split_html('backend.html', 'backend_core.html', 'Backend Core', 'Microservices & Async Processing', 'backend_scaling.html', 'Backend Scaling', 'Concurrency & Load Balancing', '<div class="qa-container" id="q68">')

# Split Database (73-77, 78-82)
split_html('database.html', 'database_internals.html', 'Database Internals', 'ACID, Indexes & Transactions', 'database_scaling.html', 'Database Scaling', 'Sharding, Replication & NoSQL', '<div class="qa-container" id="q78">')

print("Split completed.")
