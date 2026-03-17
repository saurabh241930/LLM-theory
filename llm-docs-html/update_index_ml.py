import re

def update_index():
    with open('index.html', 'r', encoding='utf-8') as f:
        content = f.read()

    # The Traditional ML HTML section
    ml_section = """
        <h2 class="category-title"
            style="margin-top: 30px; border-bottom: 2px solid var(--wp-accent); padding-bottom: 5px; color: var(--wp-title-text);">
            TRADITIONAL ML & FOUNDATIONS</h2>
        <ul class="chapter-list">
            <li class="chapter-item">
                <span class="chapter-number">1</span>
                <a href="ml_fundamentals.html" class="chapter-link">ML Foundations</a>
                <span class="chapter-desc">Regression, Classification, and the Bias-Variance tradeoff.</span>
            </li>
            <li class="chapter-item">
                <span class="chapter-number">2</span>
                <a href="classical_algorithms.html" class="chapter-link">Classical Algorithms</a>
                <span class="chapter-desc">Decision Trees, Random Forests, and XGBoost.</span>
            </li>
            <li class="chapter-item">
                <span class="chapter-number">3</span>
                <a href="optimization_math.html" class="chapter-link">Optimization Math</a>
                <span class="chapter-desc">Gradient Descent, Loss Functions, and Adam Optimizer.</span>
            </li>
            <li class="chapter-item">
                <span class="chapter-number">4</span>
                <a href="feature_engineering.html" class="chapter-link">Feature Engineering</a>
                <span class="chapter-desc">Data cleaning, Encoding, Scaling, and PCA.</span>
            </li>
            <li class="chapter-item">
                <span class="chapter-number">5</span>
                <a href="deep_learning_origins.html" class="chapter-link">Deep Learning Origins</a>
                <span class="chapter-desc">Perceptrons, MLPs, and Backpropagation basics.</span>
            </li>
            <li class="chapter-item">
                <span class="chapter-number">6</span>
                <a href="nlp_evolution.html" class="chapter-link">Evolution to GPT</a>
                <span class="chapter-desc">Historical roadmap from RNNs and LSTMs to Transformers.</span>
            </li>
        </ul>
"""
    
    # Insert before the first category title (GEN AI)
    # The first <h2 class="category-title" ...>
    content = re.sub(r'(<h2 class="category-title".*?>\s*GEN AI)', ml_section + r'\1', content, flags=re.DOTALL)

    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated index.html with Traditional ML section.")

if __name__ == '__main__':
    update_index()
