import re

def update_qa():
    with open('20_interview_questions.html', 'r', encoding='utf-8') as f:
        content = f.read()

    # Define the new category 0: LLM Fundamentals
    llm_fundamentals = """
<h2 id="phase-0-fundamentals">Phase 0: LLM Fundamentals</h2>
<div class="qa-container">
<h3>Q1: What is the Transformer architecture and why did it replace RNNs?</h3>
<div class="answer">
<p><strong>A:</strong>
The Transformer (introduced in "Attention Is All You Need") is a sequence-to-sequence architecture based entirely on <strong>Attention mechanisms</strong>, dispensing with recurrence (RNNs) and convolutions.</p>
<p><strong>Why it replaced RNNs:</strong></p>
<ul>
    <li><strong>Parallelization:</strong> RNNs process word-by-word (sequential), which is slow. Transformers process the entire sequence at once.</li>
    <li><strong>Long-range dependencies:</strong> RNNs suffer from "vanishing gradients," forgetting the start of a long sentence. Attention allows every word to "look" at every other word directly, regardless of distance.</li>
    <li><strong>Scaling:</strong> Because they can be parallelized, they can be trained on massive datasets (Petabytes), leading to the emergence of LLMs.</li>
</ul>
<hr />
</div>
</div>

<div class="qa-container">
<h3>Q2: What is the core difference between LLMs and traditional Machine Learning (Random Forest, SVM)?</h3>
<div class="answer">
<p><strong>A:</strong></p>
<table>
<thead>
<tr>
<th>Feature</th>
<th>Traditional ML</th>
<th>Large Language Models (LLMs)</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Feature Engineering</strong></td>
<td>Manual (Humans define features)</td>
<td>Automated (Model learns features)</td>
</tr>
<tr>
<td><strong>Data Dependency</strong></td>
<td>Small to Medium (Tabular)</td>
<td>Massive (Unstructured Text/Code)</td>
</tr>
<tr>
<td><strong>Generalization</strong></td>
<td>Single-task specific</td>
<td>Generalists (Zero-shot/Few-shot)</td>
</tr>
<tr>
<td><strong>Training</strong></td>
<td>Supervised (Labeled data)</td>
<td>Self-Supervised (Predict next token)</td>
</tr>
</tbody>
</table>
<p><strong>The "Emergence" factor:</strong> LLMs show abilities at scale (reasoning, coding) that weren't explicitly programmed or present in smaller ML models.</p>
<hr />
</div>
</div>

<div class="qa-container">
<h3>Q3: Explain the Multi-Head Self-Attention mechanism in simple terms.</h3>
<div class="answer">
<p><strong>A:</strong>
Attention is the math behind how an LLM decides which words in a sentence are most relevant to the current word being processed.</p>
<p><strong>The Query, Key, Value (QKV) Analogy:</strong></p>
<ul>
    <li><strong>Query (Q):</strong> What I am looking for (e.g., the word "bank").</li>
    <li><strong>Key (K):</strong> What other words offer (e.g., "river" vs "money").</li>
    <li><strong>Value (V):</strong> The information I actually take from them.</li>
</ul>
<p><strong>The Process:</strong></p>
<ol>
    <li>We calculate a compatibility score between Q and K (Dot product).</li>
    <li>We normalize these scores (Softmax) to get "Attention Weights."</li>
    <li>We multiply these weights by the Values (V).</li>
</ol>
<p><strong>"Multi-Head"</strong> means the model does this multiple times in parallel, allowing it to focus on different aspects simultaneously (e.g., one head for grammar, another for semantic meaning).</p>
<hr />
</div>
</div>
"""

    # Add RAG vs Fine-Tuning towards the end of Phase 2 or start of Phase 2
    rag_vs_ft = """
<div class="qa-container">
<h3>Q11: When should you choose RAG vs. Fine-Tuning? Why is RAG often preferred for enterprise?</h3>
<div class="answer">
<p><strong>A:</strong></p>
<table>
<thead>
<tr>
<th>Criteria</th>
<th>RAG</th>
<th>Fine-Tuning</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Knowledge</strong></td>
<td>Dynamic (updates in seconds)</td>
<td>Static (frozen at training time)</td>
</tr>
<tr>
<td><strong>Citations</strong></td>
<td>Yes (Cite source documents)</td>
<td>No (Black box)</td>
</tr>
<tr>
<td><strong>Hallucination</strong></td>
<td>Low (Grounded in facts)</td>
<td>High (Likely to make up facts)</td>
</tr>
<tr>
<td><strong>Cost</strong></td>
<td>Inference cost + Vector DB</td>
<td>High Training cost</td>
</tr>
<tr>
<td><strong>Specialization</strong></td>
<td>General reasoning on new data</td>
<td>Deep style/format alignment</td>
</tr>
</tbody>
</table>
<p><strong>Why RAG is preferred:</strong> For company policies or medical data, "accuracy" is more important than "style." RAG allows you to update the database without retraining the model, and it provides auditability (citations).</p>
<hr />
</div>
</div>
"""

    # Add Fine-Tuning questions in Phase 4
    ft_details = """
<div class="qa-container">
<h3>Q27: What is LoRA (Low-Rank Adaptation) and QLoRA?</h3>
<div class="answer">
<p><strong>A:</strong>
Standard fine-tuning updates all billions of parameters, which is incredibly slow and expensive.</p>
<ul>
    <li><strong>LoRA:</strong> We freeze the original weights of the LLM and add tiny, trainable "adapter" matrices to each layer. This reduces the number of trainable parameters by 10,000x, but achieves similar accuracy.</li>
    <li><strong>QLoRA:</strong> Is a more advanced version that <strong>quantizes</strong> the base model to 4-bit (NF4) before adding the adapters. This allows you to fine-tune massive models (like Llama-3 70B) on a single consumer GPU.</li>
</ul>
<hr />
</div>
</div>

<div class="qa-container">
<h3>Q28: What is the difference between Fine-Tuning and Prompt Engineering?</h3>
<div class="answer">
<p><strong>A:</strong></p>
<ul>
    <li><strong>Prompt Engineering:</strong> Changes the <strong>Context</strong>. It is "in-context learning." No weights are changed. Limited by the context window.</li>
    <li><strong>Fine-Tuning:</strong> Changes the <strong>Weights</strong>. The model "learns" the pattern inherently. Can handle thousands of examples that would never fit in a prompt.</li>
</ul>
<p><strong>Mnemonic:</strong> Prompting is like an <em>Open book exam</em> (referencing the prompt). Fine-tuning is like <em>Studying for weeks</em> before the exam (changing the brain's knowledge).</p>
<hr />
</div>
</div>
"""

    # Prompt Engineering: Self-Consistency
    self_consistency = """
<div class="qa-container">
<h3>Q11: What is the Self-Consistency technique in prompting?</h3>
<div class="answer">
<p><strong>A:</strong>
Self-Consistency (Wang et al.) is an evolution of Chain-of-Thought (CoT) prompting.</p>
<ol>
    <li>Instead of asking the model for <strong>one</strong> step-by-step reasoning path...</li>
    <li>You ask it to generate <strong>multiple</strong> different reasoning paths for the same question.</li>
    <li>You take the <strong>majority vote</strong> of the final answers.</li>
</ol>
<p><strong>Why it works:</strong> Complex problems often have multiple ways to reach the same correct answer, but many ways to fail. If 4 out of 5 reasoning paths reach "Apple", it's likely the correct answer even if one path hallucinated.</p>
<hr />
</div>
</div>
"""

    # Injection logic
    # 1. Insert Fundamentals at top of content-wrapper
    content = re.sub(r'(<div class="content-wrapper">)', r'\1' + llm_fundamentals, content)

    # 2. Insert RAG vs FT at start of Phase 2
    content = re.sub(r'(<h2 id="phase-2-rag">Phase 2: RAG</h2>)', r'\1' + rag_vs_ft, content)

    # 3. Insert FT details at start of Phase 4
    content = re.sub(r'(<h2 id="phase-4-fine-tuning">Phase 4: Fine-Tuning</h2>)', r'\1' + ft_details, content)
    
    # 4. Insert Self-Consistency at end of Prompt Engineering Category
    # Category 3 ends around line 426 in original. Let's findCategory 4 and insert before it.
    content = re.sub(r'(<h2>Category 4: Integration)', self_consistency + r'\1', content)

    # RENUMBERING
    # This is tricky because Q numbers are hardcoded.
    # I'll use a regex to find all <h3>Q\d+: ... </h3> and renumber them sequentially.
    
    def renumber(match):
        if not hasattr(renumber, "count"):
            renumber.count = 0
        renumber.count += 1
        return re.sub(r'Q\d+', f'Q{renumber.count}', match.group(0))

    content = re.sub(r'<h3>Q\d+:.*?</h3>', renumber, content)

    with open('20_interview_questions.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Injected and renumbered questions successfully!")

if __name__ == '__main__':
    update_qa()
