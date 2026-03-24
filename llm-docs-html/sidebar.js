document.addEventListener('DOMContentLoaded', () => {
    const menu = [
        {
            category: 'TRADITIONAL ML',
            links: [
                { id: 'ml_fundamentals.html', title: '1. ML Foundations' },
                { id: 'overfitting_underfitting.html', title: '2. Overfitting & Underfitting' },
                { id: 'super_unsuper_semi.html', title: '3. Supervised vs Unsupervised' },
                { id: 'cross_validation.html', title: '4. Cross-Validation & Splits' },
                { id: 'eval_metrics.html', title: '5. Evaluation Metrics' },
                { id: 'bayesian_fundamentals.html', title: '6. Bayesian Fundamentals' },
                { id: 'classical_algorithms.html', title: '7. Classical Algorithms' },
                { id: 'curse_of_dimensionality.html', title: '8. Curse of Dimensionality' },
                { id: 'optimization_math.html', title: '9. Optimization Math' },
                { id: 'feature_engineering.html', title: '10. Feature Engineering' },
                { id: 'deep_learning_origins.html', title: '11. Deep Learning Origins' },
                { id: 'nlp_evolution.html', title: '12. Evolution of GPT' }
            ]
        },
        {
            category: 'PROBABILITY & MATH FOUNDATIONS',
            links: [
                { id: 'information_theory_basics.html', title: '1. Information Theory' },
                { id: 'perplexity_evaluation.html', title: '2. Perplexity Rating' },
                { id: 'linear_algebra_transformers.html', title: '3. Linear Algebra Math' }
            ]
        },
        {
            category: 'DEEP LEARNING CORE',
            links: [
                { id: 'softmax_temperature.html', title: '1. Softmax & Temperature' },
                { id: 'perceptron_math.html', title: '2. Perceptron Math & XOR' },
                { id: 'backpropagation_math.html', title: '3. Backpropagation & Chain Rule' },
                { id: 'cnn_architecture.html', title: '4. CNNs & Inductive Biases' },
                { id: 'rnn_architecture.html', title: '5. RNN & Vanishing Gradients' },
                { id: 'lstm_architecture.html', title: '6. LSTM & Cell State' },
                { id: 'weight_initialization.html', title: '7. Weight Initialization' },
                { id: 'dropout_mechanics.html', title: '8. Dropout Mechanics' },
                { id: 'feed_forward_animation.html', title: '9. Feed-Forward Networks' },
                { id: 'residual_connections_animation.html', title: '10. Residual Connections' },
                { id: 'layer_normalization_animation.html', title: '11. Layer Normalization' }
            ]
        },
        {
            category: 'TRANSFORMER INTERNALS',
            links: [
                { id: 'attention_math.html', title: '1. Attention Math' },
                { id: 'positional_encoding.html', title: '2. Positional Encoding' },
                { id: 'transformer_ffn.html', title: '3. Feed-Forward Network' },
                { id: 'encoder_decoder.html', title: '4. Encoder vs Decoder' },
                { id: 'bert_architecture.html', title: '5. BERT Masked Language Model' },
                { id: 'gpt_pretraining.html', title: '6. Pretraining & Scaling' },
                { id: 'moe_architecture.html', title: '7. Mixture of Experts' },
                { id: 'layer_normalization.html', title: '8. Layer Norm & Residuals' },
                { id: 'kv_cache_efficiency.html', title: '9. KV Cache Efficiency' },
                { id: 'transformer_walkthrough.html', title: '10. The Full Pipeline Walkthrough' },
                { id: 'transformer_animation.html', title: '11. 3B1B Transformer Animation' },
                { id: 'encoder_animation.html', title: '12. Encoder Layer Animation' },
                { id: 'decoder_animation.html', title: '13. Decoder Layer Animation' },
                { id: 'deepseek_animation.html', title: '14. DeepSeek v2 MoE & MLA' },
                { id: 'bert_vs_gpt_animation.html', title: '15. BERT vs GPT Animation' },
                { id: 'cross_attention.html', title: '16. Self vs Cross Attention' },
                { id: 'transformer_math_story.html', title: '17. Micro-Math Matrix Story' },
                { id: 'attention_modifier_math.html', title: '18. Attention Intuition & Math' },
                { id: 'qkv_matrix_animation.html', title: '19. QKV Matrix Projections' },
                { id: 'multihead_attention_intuition.html', title: '20. Why Multi-Head Attention?' }
            ]
        },
        {
            category: 'OPTIMIZATION & TRAINING',
            links: [
                { id: 'lr_schedules_warmup.html', title: '1. Learning Rate & Warmup' },
                { id: 'mixed_precision_training.html', title: '2. Mixed Precision (FP16/BF16)' },
                { id: 'gradient_clipping.html', title: '3. Gradient Clipping' },
                { id: 'distributed_training.html', title: '4. Distributed Training Hub' }
            ]
        },
        {
            category: 'GEN AI',
            links: [
                { id: 'index.html', title: 'Contents Hub' },
                { id: 'embeddings_vector_search.html', title: '1. Embeddings & Vector Search' },
                { id: 'tokenization_context_windows.html', title: '2. Tokenization & Context' },
                { id: 'llm_decoding.html', title: '3. Decoding Strategies' },
                { id: 'prompt_engineering.html', title: '4. Prompt Engineering' },
                { id: 'genai_memory.html', title: '5. Memory in Gen AI' },
                { id: 'genai_frameworks.html', title: '6. Frameworks & Libraries' },
                { id: 'rag_types.html', title: '7. RAG Types' },
                { id: 'chunking_strategies.html', title: '8. Better chunking' },
                { id: 'naive_rag.html', title: '9. Naive RAG Foundations' },
                { id: 'hybrid_search.html', title: '10. Hybrid Search' },
                { id: 'advanced_rag.html', title: '11. Advanced RAG' },
                { id: 'reranking.html', title: '12. Re-ranking' },
                { id: 'query_rewriting.html', title: '13. Query Rewriting' },
                { id: 'rag_evaluation.html', title: '14. Evaluation Hub' },
                { id: 'function_calling.html', title: '15. Function Calling' },
                { id: 'nl_to_sql.html', title: '16. Text-to-SQL' },
                { id: 'improving_nl_to_sql.html', title: '17. Schema Retrieval' },
                { id: 'graph_rag.html', title: '18. Graph RAG' },
                { id: 'agentic_rag.html', title: '19. Agentic RAG' },
                { id: 'fine_tuning_intro.html', title: '20. Fine-Tuning Intro' },
                { id: 'lora_peft.html', title: '21. LoRA & PEFT' },
                { id: 'alignment_rlhf_dpo.html', title: '22. Model Alignment' },
                { id: 'inference_optimization.html', title: '23. Inference Optimization' },
                { id: 'react_pattern.html', title: '24. ReAct Pattern' },
                { id: 'multi_agent_systems.html', title: '25. Multi-Agent Systems' },
                { id: 'agent_failure_recovery.html', title: '26. Failure Recovery' },
                { id: 'scaling_rag_millions.html', title: '27. Scaling RAG' },
                { id: 'high_efficiency_indexing.html', title: '28. CRAG / Self-RAG' },
                { id: 'evaluation_ragas_langsmith.html', title: '29. Evaluation Hub' },
                { id: '20_interview_questions.html', title: '30. Interview Recap' },
                { id: '21_real_world_questions.html', title: '31. Real World Production' },
                { id: 'llm_serving.html', title: '32. LLM Serving' },
                { id: 'mcp_protocol.html', title: '33. MCP Protocol' },
                { id: 'interview_scenario_based.html', title: '34. Scenario Interviews' }
            ]
        },
        {
            category: 'ADVANCED RAG DEEP DIVES',
            links: [
                { id: 'rag_query_expansion.html', title: '1. Query Expansion' },
                { id: 'embedding_finetuning.html', title: '2. Embedding Fine-Tuning' },
                { id: 'metadata_filtering.html', title: '3. Metadata Filtering' },
                { id: 'colbert_retrieval.html', title: '4. ColBERT & Multi-Vector' },
                { id: 'rag_vs_long_context.html', title: '5. RAG vs Long Context' },
                { id: 'parent_document_retrieval.html', title: '6. Parent Document Retrieval' }
            ]
        },
        {
            category: 'LLMOps & PRODUCTION',
            links: [
                { id: 'llm_tracing_observability.html', title: '1. Tracing & Observability' },
                { id: 'llm_cost_caching.html', title: '2. Cost & Caching' },
                { id: 'hallucination_detection.html', title: '3. Hallucination Detection' },
                { id: 'llm_deployment_safety.html', title: '4. Deployment Safety' }
            ]
        },
        {
            category: 'AZURE AI & ENTERPRISE RAG',
            links: [
                { id: 'azure_ai_search_masterclass.html', title: '1. Azure AI Search' },
                { id: 'azure_openai_masterclass.html', title: '2. Azure OpenAI & Security' }
            ]
        },
        {
            category: 'Backend',
            links: [
                { id: 'backend_core.html', title: 'Backend Core' },
                { id: 'backend_fastapi.html', title: 'FastAPI Mastery' },
                { id: 'backend_nodejs.html', title: 'Node.js Mastery' },
                { id: 'backend_nodejs_advanced.html', title: 'Advanced Node.js' },
                { id: 'backend_scaling.html', title: 'Backend Scaling' }
            ]
        },
        {
            category: 'Frontend',
            links: [
                { id: 'frontend_architecture.html', title: 'Frontend Architecture' },
                { id: 'frontend_performance.html', title: 'Frontend Performance' },
                { id: 'frontend_react_advanced.html', title: 'Advanced React' }
            ]
        },
        {
            category: 'JS/TS MASTERY',
            links: [
                { id: 'js_mastery.html', title: 'Senior JS/TS Mastery' }
            ]
        },
        {
            category: 'PYTHON MASTERY',
            links: [
                { id: 'python_mastery.html', title: 'Senior Python Mastery' }
            ]
        },
        {
            category: 'Database',
            links: [
                { id: 'database_internals.html', title: '1. ACID & Indexes' },
                { id: 'database_scaling.html', title: '2. Database Scaling' },
                { id: 'database_postgres_advanced.html', title: '3. PostgreSQL Mastery' },
                { id: 'database_vector_internals.html', title: '4. Vector DB Internals' },
                { id: 'database_vector_production.html', title: '5. Production Vector Ops' },
                { id: 'database_mongodb_advanced.html', title: '6. Advanced MongoDB' }
            ]
        },
        {
            category: 'System Design',
            links: [
                { id: 'system_design_company_assistant.html', title: 'Company AI Assistant' },
                { id: 'system_design_patterns.html', title: 'System Design Patterns' },
                { id: 'system_design_scaling.html', title: 'System Design Scaling' },
                { id: 'system_design_chatgpt.html', title: 'ChatGPT Case Study' },
                { id: 'system_design_ecommerce_agents.html', title: 'E-commerce AI Agents' },
                { id: 'sysdesign_enterprise_search.html', title: 'Enterprise Search (Glean)' },
                { id: 'sysdesign_high_throughput_rag.html', title: 'High-Throughput RAG' },
                { id: 'sysdesign_cap_theorem.html', title: 'S1. CAP Theorem' },
                { id: 'sysdesign_consistent_hashing.html', title: 'S2. Consistent Hashing' },
                { id: 'sysdesign_db_replication.html', title: 'S3. Database Replication' },
                { id: 'sysdesign_message_queues.html', title: 'S4. Message Queues' },
                { id: 'sysdesign_cdn_caching.html', title: 'S5. CDN & Caching' },
                { id: 'sysdesign_circuit_breaker.html', title: 'S6. Circuit Breakers' },
                { id: 'sysdesign_cqrs_splitting.html', title: 'S7. CQRS & Read Splitting' },
                { id: 'sysdesign_service_mesh.html', title: 'S8. Service Mesh & API GW' },
                { id: 'sysdesign_bloom_filters.html', title: 'S9. Bloom Filters' },
                { id: 'sysdesign_distributed_transactions.html', title: 'S10. Distributed Transactions' },
                { id: 'sysdesign_discord_slack.html', title: 'S11. Discord / Slack Design' }
            ]
        },
        {
            category: 'DATA STRUCTURES & ALGORITHMS',
            links: [
                { id: 'dsa_arrays_strings.html', title: '1. Arrays & Strings' },
                { id: 'dsa_hash_maps.html', title: '2. Hash Maps & Sets' },
                { id: 'dsa_linked_lists.html', title: '3. Linked Lists' },
                { id: 'dsa_trees.html', title: '4. Trees & Traversals' },
                { id: 'dsa_graphs.html', title: '5. Graphs & Algorithms' },
                { id: 'dsa_heaps.html', title: '6. Heaps & Priority Queues' },
                { id: 'dsa_dp.html', title: '7. Dynamic Programming' },
                { id: 'dsa_backtracking.html', title: '8. Backtracking Pattern' },
                { id: 'dsa_tries.html', title: '9. Tries (Prefix Trees)' },
                { id: 'dsa_union_find.html', title: '10. Union Find / DSU' }
            ]
        },
        {
            category: 'API & Security',
            links: [
                { id: 'api_design.html', title: 'A1. API Design' },
                { id: 'api_security_auth.html', title: 'A2. API Security' },
                { id: 'llm_security.html', title: 'A3. LLM & Prompt Security' }
            ]
        }
    ];

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // Create Toggle Button
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'sidebar-toggle';
    toggleBtn.innerHTML = '&#9776;'; // Proper HTML entity for hamburger
    document.body.appendChild(toggleBtn);

    // Create Sidebar
    const sidebar = document.createElement('aside');
    sidebar.className = 'sidebar';

    // Start CLOSED on mobile/tablet, OPEN on desktop
    if (window.innerWidth < 1024) {
        sidebar.classList.add('closed');
        document.body.classList.add('sidebar-closed');
    }

    let sidebarContent = `
        <div class="sidebar-title">Ultimate Cheatsheet</div>
        <div class="sidebar-content-scroll">
    `;

    menu.forEach(section => {
        // Check if any link in this section is currently active
        const isSectionActive = section.links.some(link => link.id === currentPage);
        const navClass = isSectionActive ? 'sidebar-nav open' : 'sidebar-nav';
        const chevronClass = isSectionActive ? 'chevron open' : 'chevron';

        sidebarContent += `
            <div class="sidebar-category">
                ${section.category}
                <svg class="${chevronClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </div>
            <ul class="${navClass}">
        `;
        section.links.forEach(ch => {
            const isActive = currentPage === ch.id ? 'active' : '';
            sidebarContent += `<li class="${isActive}"><a href="${ch.id}">${ch.title}</a></li>`;
        });
        sidebarContent += `</ul>`;
    });

    sidebarContent += `</div>`;
    sidebar.innerHTML = sidebarContent;
    document.body.appendChild(sidebar);

    // Interactive Submenu Toggle Logic
    const categories = sidebar.querySelectorAll('.sidebar-category');
    categories.forEach(category => {
        category.addEventListener('click', () => {
            const nav = category.nextElementSibling;
            const chevron = category.querySelector('.chevron');

            // Toggle open class
            nav.classList.toggle('open');
            chevron.classList.toggle('open');
        });
    });

    // Toggle Sidebar Logic
    toggleBtn.addEventListener('click', () => {
        const isClosed = sidebar.classList.toggle('closed');
        document.body.classList.toggle('sidebar-closed', isClosed);
    });

    // Inject Mermaid Script if not already present
    if (!document.querySelector('script[src*="mermaid"]')) {
        const mermaidScript = document.createElement('script');
        mermaidScript.type = 'module';
        mermaidScript.innerHTML = `
            import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
            mermaid.initialize({ 
                startOnLoad: false, 
                theme: 'base',
                themeVariables: {
                    primaryColor: '#eef2ff',
                    primaryTextColor: '#202122',
                    primaryBorderColor: '#a2a9b1',
                    lineColor: '#3366cc',
                    secondaryColor: '#f8f9fa',
                    tertiaryColor: '#fff'
                }
            });
            setTimeout(async () => {
                try {
                    await mermaid.run({ querySelector: '.mermaid' });
                } catch(e) { console.error("Mermaid run error:", e); }
            }, 100);
        `;
        document.body.appendChild(mermaidScript);
    }

    // --- Inject "Next Page" Button Dynamically ---
    const allLinks = menu.flatMap(section => section.links);
    const currentIndex = allLinks.findIndex(link => link.id === currentPage);

    if (currentIndex !== -1 && currentIndex < allLinks.length - 1) {
        const nextLink = allLinks[currentIndex + 1];

        const navContainer = document.createElement('div');
        navContainer.style.cssText = 'margin-top: 40px; padding-top: 20px; border-top: 1px solid var(--wp-border, #eaecf0); display: flex; justify-content: flex-end; margin-bottom: 40px;';

        const nextBtn = document.createElement('a');
        nextBtn.href = nextLink.id;
        nextBtn.style.cssText = 'display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; background-color: var(--wp-accent, #3366cc); color: white; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 1.1em; transition: opacity 0.2s; box-shadow: 0 2px 4px rgba(0,0,0,0.1);';
        nextBtn.innerHTML = `Next: ${nextLink.title} <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;

        nextBtn.addEventListener('mouseover', () => nextBtn.style.opacity = '0.85');
        nextBtn.addEventListener('mouseout', () => nextBtn.style.opacity = '1');

        navContainer.appendChild(nextBtn);

        const contentWrapper = document.querySelector('.content-wrapper');
        if (contentWrapper) {
            contentWrapper.appendChild(navContainer);
        } else {
            document.body.appendChild(navContainer);
        }
    }
});
