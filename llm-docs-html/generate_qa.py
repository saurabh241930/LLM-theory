import os
import re
import markdown

phases = [
    ("Phase-1-Foundations", "Phase 1: Foundations"),
    ("Phase-2-RAG", "Phase 2: RAG"),
    ("Phase-3-Structured-Outputs", "Phase 3: Structured Outputs & NL-to-SQL"),
    ("Phase-4-Fine-Tuning", "Phase 4: Fine-Tuning"),
    ("Phase-5-Agents", "Phase 5: Agents & Agentic Systems")
]

base_dir = "/home/sp241930/Documents/LLM-theory/llm-docs-html/orignal_document"

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>20. Interview Questions Recap</title>
    <link rel="stylesheet" href="wikipedia.css">
    <style>
        .qa-container {
            margin-bottom: 2em;
            padding: 15px;
            background-color: #f8f9fa;
            border-left: 4px solid var(--wp-accent);
            border-radius: 4px;
        }
        .qa-container h3 {
            margin-top: 0;
            color: var(--wp-title-text);
        }
        .qa-container .answer {
            margin-top: 10px;
        }
        .qa-container pre {
            background: #282c34;
            color: #abb2bf;
            padding: 15px;
            border-radius: 6px;
            overflow-x: auto;
            margin: 1em 0;
            font-family: 'Fira Code', 'Consolas', monospace;
            font-size: 0.9em;
        }
        .qa-container code {
            font-family: 'Fira Code', 'Consolas', monospace;
            background: rgba(0,0,0,0.05);
            padding: 2px 4px;
            border-radius: 3px;
        }
        .qa-container pre code {
            background: none;
            padding: 0;
        }
        .qa-container table {
            border-collapse: collapse;
            width: 100%;
            margin: 1em 0;
        }
        .qa-container th, .qa-container td {
            border: 1px solid var(--wp-border);
            padding: 8px;
            text-align: left;
        }
        .qa-container th {
            background-color: #eaecf0;
        }
    </style>
</head>
<body>
    <header>
        <h1>20. Interview Questions Recap</h1>
        <div class="subtitle">Quick recap of Phase 1 to Phase 5 for interview preparation</div>
    </header>

    <aside class="infobox">
        <div class="infobox-title">Interview Prep</div>
        <div class="infobox-data">
            <div class="infobox-row">
                <div class="infobox-label">Scope</div>
                <div class="infobox-value">Phases 1 - 5</div>
            </div>
            <div class="infobox-row">
                <div class="infobox-label">Type</div>
                <div class="infobox-value">Q&A Recap</div>
            </div>
            <div class="infobox-row">
                <div class="infobox-label">Topics</div>
                <div class="infobox-value">Foundations, RAG, Structured Outputs, Fine-Tuning, Agents</div>
            </div>
        </div>
    </aside>

    <div class="content-wrapper">
"""

for folder, title in phases:
    file_path = os.path.join(base_dir, folder, "QUESTIONS-ANSWERS.md")
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Remove the main title from the markdown
        content = re.sub(r'^#\s+.*$', '', content, flags=re.MULTILINE)
        
        # Convert markdown to html
        md_html = markdown.markdown(content, extensions=['tables', 'fenced_code'])
        
        html_content += f'<h2 id="{folder.lower()}">{title}</h2>\n'
        
        # We need to wrap Q&A pairs in qa-container
        # We can do this by splitting the html on <h3> tags
        parts = re.split(r'(<h3>.*?</h3>)', md_html)
        
        # Add everything before the first h3
        html_content += parts[0]
        
        # Now pair up h3 and the content following it
        for i in range(1, len(parts), 2):
            q_header = parts[i]
            a_content = parts[i+1] if i+1 < len(parts) else ""
            html_content += f'<div class="qa-container">\n{q_header}\n<div class="answer">\n{a_content}\n</div>\n</div>\n'

html_content += """
    </div>

    <!-- Case Study Section -->
    <div class="topic-section">
        <h2>Case Study: RSA Sales QA Dashboard (Interview Perspective)</h2>
        <p>In an interview setting, applying the concepts to a concrete example like the RSA Sales QA Dashboard is crucial. Here's how you might frame the integration of these 5 phases:</p>
        
        <div class="qa-container">
            <h3>How would you architect the RSA QA system end-to-end?</h3>
            <div class="answer">
                <p><strong>1. Foundations & Search:</strong> We use specialized embeddings (like BGE) to encode call transcripts and policy documents, enabling semantic search to find compliance violations even if agents use different phrasing.</p>
                <p><strong>2. RAG Pipeline:</strong> When auditing a call, we retrieve relevant policy clauses (chunked semantically) and inject them into the LLM's context, mitigating hallucinations about company policy.</p>
                <p><strong>3. Structured Outputs:</strong> To populate the QA dashboard, we force the LLM to output a strict JSON schema containing `{ "compliance_score": 85, "violations": [...], "summary": "..." }`. We use NL-to-SQL to allow managers to query the dashboard naturally (e.g., "Show me agents failing the greeting policy").</p>
                <p><strong>4. Fine-Tuning:</strong> If the generic LLM struggles to parse our proprietary insurance jargon (ACV, subrogation) consistently, we apply LoRA to adapt a smaller open-source model like Llama-3 specifically on our past manually-audited calls, improving accuracy while lowering inference costs.</p>
                <p><strong>5. Agency:</strong> We wrap this in a ReAct loop. An auditor agent can decide to search the policy DB first, realize it needs more info, query the CRM for the customer's history, and only then render a final compliance decision.</p>
            </div>
        </div>
    </div>

    <script src="animations.js"></script>
    <script src="sidebar.js"></script>
</body>
</html>
"""

with open("/home/sp241930/Documents/LLM-theory/llm-docs-html/20_interview_questions.html", "w", encoding="utf-8") as f:
    f.write(html_content)

print("Generated 20_interview_questions.html successfully.")
