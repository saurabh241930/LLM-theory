import re

def process_cheat_sheet(input_file):
    with open(input_file, 'r') as f:
        lines = f.readlines()

    questions = {}
    current_q = None
    current_section = None
    
    q_pattern = re.compile(r'^Q(\d+)$')
    
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        
        # Match Q1, Q2, etc.
        m = q_pattern.match(line)
        if m:
            q_num = int(m.group(1))
            current_q = q_num
            i += 1
            # Next line is the question title
            title = lines[i].strip()
            
            # Now we look for ONE-LINER, CORE POINTS, DEPTH, TRAP
            one_liner = ""
            core_points = []
            depth = []
            trap = ""
            
            while i < len(lines):
                i += 1
                if i >= len(lines): break
                l = lines[i].strip()
                if q_pattern.match(l) or l.startswith("Page "):
                    if q_pattern.match(l):
                        i -= 1 # Step back so the main loop catches the next Q
                    break
                
                if l == "ONE-LINER":
                    current_section = "one_liner"
                    continue
                elif l == "CORE POINTS":
                    current_section = "core_points"
                    continue
                elif l.startswith("DEPTH"):
                    current_section = "depth"
                    continue
                elif "TRAP / WATCH OUT" in l:
                    current_section = "trap"
                    continue
                
                if not l: continue
                # Skip page headers
                if "Full Stack + GenAI Interview Cheat Sheet" in l or l.startswith("Questions ") or l == "REST API Design" or l == "Backend & Databases":
                    continue
                
                if current_section == "one_liner":
                    one_liner += " " + l
                elif current_section == "core_points":
                    if l: core_points.append(l)
                elif current_section == "depth":
                    if l: depth.append(l)
                elif current_section == "trap":
                    trap += " " + l
            
            questions[q_num] = {
                'title': title,
                'one_liner': one_liner.strip(),
                'core_points': core_points,
                'depth': depth,
                'trap': trap.strip()
            }
        else:
            i += 1

    return questions

def generate_html(filename, title, subtitle, q_start, q_end, questions):
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    <link rel="stylesheet" href="wikipedia.css">
    <style>
        .qa-container {{
            margin-bottom: 2em;
            padding: 15px;
            background-color: #f8f9fa;
            border-left: 4px solid var(--wp-accent);
            border-radius: 4px;
        }}
        .qa-container h3 {{
            margin-top: 0;
            color: var(--wp-title-text);
        }}
        .qa-container .answer {{
            margin-top: 10px;
        }}
        .one-liner {{ font-weight: bold; margin-bottom: 10px; }}
        .trap {{ background-color: #fff3cd; padding: 10px; border-left: 4px solid #ffc107; margin-top: 10px; }}
        .depth {{ background-color: #e2e3e5; padding: 10px; border-left: 4px solid #6c757d; margin-top: 10px; }}
    </style>
</head>
<body>
    <header>
        <h1>{title}</h1>
        <div class="subtitle">{subtitle}</div>
    </header>

    <div class="content-wrapper">
"""
    for q_num in range(q_start, q_end + 1):
        if q_num in questions:
            q = questions[q_num]
            html += f"""
        <div class="qa-container" id="q{q_num}">
            <h3>Q{q_num}: {q['title']}</h3>
            <div class="answer">
                <div class="one-liner">{q['one_liner']}</div>
                <h4>Core Points</h4>
                <ul>
"""
            for cp in q['core_points']:
                # clean up the bullets
                cp = cp.replace("◆", "").replace("■", "").strip()
                if cp:
                    html += f"                    <li>{cp}</li>\n"
            html += """                </ul>
"""
            if q['depth']:
                html += """                <div class="depth">
                    <strong>Depth (Senior Signal):</strong>
                    <ul>
"""
                for dp in q['depth']:
                    dl = dp.replace("◆", "").strip()
                    if dl:
                        html += f"                        <li>{dl}</li>\n"
                html += """                    </ul>
                </div>
"""
            if q['trap']:
                html += f"""                <div class="trap">
                    <strong>Trap / Watch Out:</strong> {q['trap']}
                </div>
"""
            html += """            </div>
        </div>
"""
    html += """    </div>
    <script src="animations.js"></script>
    <script src="sidebar.js"></script>
</body>
</html>
"""
    with open(f"/home/sp241930/Documents/LLM-theory/llm-docs-html/{filename}", "w") as f:
        f.write(html)
        
questions = process_cheat_sheet('/tmp/pdf_text.txt')

# Generate pages
generate_html('system_design.html', 'System Design', 'System Design & Architecture Questions', 1, 26, questions)
generate_html('api_security.html', 'API & Security', 'REST API Design & Security', 27, 41, questions)
generate_html('frontend.html', 'Frontend', 'React & Angular Frontend', 42, 62, questions)
# Backend: Q63 - 72 (approx)
generate_html('backend.html', 'Backend', 'Backend Engineering', 63, 72, questions)
# Database: Q73 - 82 (approx)
generate_html('database.html', 'Database', 'Databases & Storage', 73, 82, questions)

print("Generated HTML files.")
