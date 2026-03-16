import re

def create_page(filename, title, subtitle, content_blocks):
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
        .qa-container h3 {{ margin-top: 0; color: var(--wp-title-text); }}
        .qa-container .answer {{ margin-top: 10px; }}
        .one-liner {{ font-weight: bold; margin-bottom: 10px; }}
    </style>
</head>
<body>
    <header>
        <h1>{title}</h1>
        <div class="subtitle">{subtitle}</div>
    </header>
    <div class="content-wrapper">
"""
    for block in content_blocks:
        html += f"""
        <div class="qa-container" id="{block['id']}">
            <h3>{block['title']}</h3>
            <div class="answer">
                <div class="one-liner">{block['one_liner']}</div>
                {block['content']}
            </div>
        </div>
"""
    html += """
    </div>
    <script src="animations.js"></script>
    <script src="sidebar.js"></script>
</body>
</html>
"""
    with open(f"/home/sp241930/Documents/LLM-theory/llm-docs-html/{filename}", "w") as f:
        f.write(html)

# 1. RAG Types
create_page('rag_types.html', 'RAG Types', 'Types of Retrieval-Augmented Generation', [
    {
        'id': 'rag-types-overview',
        'title': 'What are the main architectural types of RAG?',
        'one_liner': 'RAG has evolved from simple vector retrieval (Naive) to Advanced (pre/post retrieval optimization) to Modular and Agentic RAG.',
        'content': """
<p>There are several distinct types of RAG topologies:</p>
<ul>
    <li><strong>Naive RAG:</strong> The standard Index -> Retrieve -> Generate flow using basic chunking and a single vector DB.</li>
    <li><strong>Advanced RAG:</strong> Incorporates Query Translation, Reranking, Hybrid Search, and advanced chunking (Parent-child).</li>
    <li><strong>Modular RAG:</strong> Decoupled RAG where specific modules (routing, predicting, verifying) can be swapped dynamically.</li>
    <li><strong>Graph RAG:</strong> Uses Knowledge Graphs (Neo4j) alongside Vectors for deep relation traversal.</li>
    <li><strong>Agentic RAG:</strong> LLM agents actively orchestrate the retrieval process, invoking different tools and databases iteratively.</li>
</ul>
<div class="mermaid">
flowchart LR
  A[Naive RAG] --> B[Advanced RAG]
  B --> C[Modular RAG]
  C --> D[Agentic & Graph RAG]
</div>
"""
    }
])

# 2. Hybrid Search
create_page('hybrid_search.html', 'Hybrid Search', 'Combining Sparse and Dense Retrieval', [
    {
        'id': 'hybrid-search-core',
        'title': 'How does Hybrid Search work?',
        'one_liner': 'Hybrid Search combines Keyword Match (BM25) with Semantic Vector Search, merging results via Reciprocal Rank Fusion (RRF).',
        'content': """
<p>Vector search excels at meaning, but fails at exact keyword matches (like specific IDs or acronyms). Sparse search (BM25) is perfect for exact keywords but fails at semantics.</p>
<h4>Core Concepts</h4>
<ul>
    <li><strong>Sparse Vector (BM25):</strong> Calculates Term Frequency-Inverse Document Frequency. Fast and exact.</li>
    <li><strong>Dense Vector (Embeddings):</strong> Captures semantic meaning across multiple dimensions.</li>
    <li><strong>Reciprocal Rank Fusion (RRF):</strong> The algorithm used to combine both scoring mechanisms. <code>RRF_Score = 1 / (k + rank_dense) + 1 / (k + rank_sparse)</code></li>
</ul>
<div class="mermaid">
flowchart TD
  Q[User Query] --> S1[BM25 / Sparse Index]
  Q --> S2[Embedding / Dense Index]
  S1 --> R1[Ranked List A]
  S2 --> R2[Ranked List B]
  R1 --> RRF[Reciprocal Rank Fusion (RRF)]
  R2 --> RRF
  RRF --> F[Final Reranked List]
</div>
"""
    }
])

# 3. Query Rewriting
create_page('query_rewriting.html', 'Query Rewriting', 'Query Translation and Expansion', [
    {
        'id': 'query-rewrite',
        'title': 'Why and how do we rewrite queries in RAG?',
        'one_liner': 'User queries are often vague or poorly phrased. We use LLMs to translate the query into a better representation before retrieving documents.',
        'content': """
<h4>Key Methods</h4>
<ul>
    <li><strong>HyDE (Hypothetical Document Embeddings):</strong> The LLM answers the user query from memory, and we embed that hallucinated answer to find similar real documents.</li>
    <li><strong>Query Expansion:</strong> Breaking a complex query into multiple sub-queries, retrieving for all, and concatenating results.</li>
    <li><strong>Step-back Prompting:</strong> Generating a more general, high-level version of the query to grab broader context.</li>
</ul>
<div class="mermaid">
flowchart TD
  U[User: "How to fix engine light?"] --> LLM[LLM Query Rewriter]
  LLM --> Q1[Query 1: "OBD2 Engine Codes"]
  LLM --> Q2[Query 2: "Check engine dashboard warning"]
  Q1 --> DB[(Vector DB)]
  Q2 --> DB[(Vector DB)]
</div>
"""
    }
])

# 4. Graph RAG
create_page('graph_rag.html', 'Graph RAG', 'Knowledge Graphs & Entity Extraction', [
    {
        'id': 'graph-rag-concepts',
        'title': 'What makes Graph RAG powerful compared to Vector RAG?',
        'one_liner': 'Graph RAG extracts entities and relationships into a Knowledge Graph, enabling multi-hop reasoning over connected concepts.',
        'content': """
<p>Standard vector RAG struggles with questions that span multiple unconnected documents. Graph RAG resolves this by pre-computing relationships.</p>
<h4>Implementation Flow</h4>
<ol>
    <li>Pass documents to an LLM to extract Entities (Nodes) and Relationships (Edges).</li>
    <li>Store in a Graph DB (like Neo4j) and a Vector DB.</li>
    <li>At query time, retrieve relevant entities via Vector lookup, then traverse their graph neighbors to fetch deep context.</li>
</ol>
<div class="mermaid">
graph LR
  A[User: John Doe] -- WORKS_FOR --> B[Acme Corp]
  B -- LOCATED_IN --> C[New York]
  A -- HAS_SKILL --> D[Python]
  style A fill:#f9f,stroke:#333
  style B fill:#bbf,stroke:#333
</div>
"""
    }
])

# 5. Agentic RAG
create_page('agentic_rag.html', 'Agentic RAG', 'Autonomous Routing and Tool Use', [
    {
        'id': 'agentic-rag',
        'title': 'How does Agentic RAG change the retrieval paradigm?',
        'one_liner': 'Instead of a static sequence, an LLM Agent dynamically decides what, when, and how many times to retrieve information.',
        'content': """
<p>Agentic RAG provides the LLM with a <strong>Routing Agent</strong> and access to multiple tools (SQL DB, Vector DB, Web Search).</p>
<h4>Agent Tool Options:</h4>
<ul>
    <li><strong>Vector Store Tool:</strong> For conceptual or unstructured text queries.</li>
    <li><strong>SQL Tool:</strong> For aggregations and relational data.</li>
    <li><strong>Web Search Tool:</strong> For real-time context missing from the DB.</li>
</ul>
<div class="mermaid">
flowchart TD
  Q[User Query] --> Agent[LLM Router / Agent]
  Agent -- "Decides Needs SQL" --> SQL[(SQL DB)]
  Agent -- "Decides Needs Concepts" --> Vector[(Vector DB)]
  Agent -- "Needs Web Info" --> Web[Tavily / Google Search]
  
  SQL --> Eval[Agent Evaluates Result]
  Vector --> Eval
  Web --> Eval
  Eval -- "Information Sufficient" --> Output[Final Answer]
  Eval -- "Needs more info" --> Agent
</div>
"""
    }
])

print("Generated new Gen AI pages.")
