document.addEventListener('DOMContentLoaded', () => {
    const menu = [
        {
            category: 'TRADITIONAL ML',
            links: [
                { id: 'ml_fundamentals.html', title: '1. ML Foundations' },
                { id: 'classical_algorithms.html', title: '2. Classical Algorithms' },
                { id: 'optimization_math.html', title: '3. Optimization Math' },
                { id: 'feature_engineering.html', title: '4. Feature Engineering' },
                { id: 'deep_learning_origins.html', title: '5. Deep Learning Origins' },
                { id: 'nlp_evolution.html', title: '6. Evolution of GPT' }
            ]
        },
        {
            category: 'GEN AI',
            links: [
                { id: 'index.html', title: 'Contents Hub' },
                { id: 'embeddings_vector_search.html', title: '1. Embeddings & Vector Search' },
                { id: 'tokenization_context_windows.html', title: '2. Tokenization & Context' },
                { id: 'prompt_engineering.html', title: '3. Prompt Engineering' },
                { id: 'genai_memory.html', title: '4. Memory in Gen AI' },
                { id: 'genai_frameworks.html', title: '5. Frameworks & Libraries' },
                { id: 'rag_types.html', title: '6. RAG Types' },
                { id: 'chunking_strategies.html', title: '7. Better chunking' },
                { id: 'naive_rag.html', title: '8. Naive RAG Foundations' },
                { id: 'hybrid_search.html', title: '9. Hybrid Search' },
                { id: 'advanced_rag.html', title: '10. Advanced RAG' },
                { id: 'reranking.html', title: '11. Re-ranking' },
                { id: 'query_rewriting.html', title: '12. Query Rewriting' },
                { id: 'rag_evaluation.html', title: '13. Evaluation Hub' },
                { id: 'function_calling.html', title: '14. Function Calling' },
                { id: 'nl_to_sql.html', title: '15. Text-to-SQL' },
                { id: 'improving_nl_to_sql.html', title: '16. Schema Retrieval' },
                { id: 'graph_rag.html', title: '17. Graph RAG' },
                { id: 'agentic_rag.html', title: '18. Agentic RAG' },
                { id: 'fine_tuning_intro.html', title: '19. Fine-Tuning Intro' },
                { id: 'lora_peft.html', title: '20. LoRA & PEFT' },
                { id: 'alignment_rlhf_dpo.html', title: '21. Model Alignment' },
                { id: 'inference_optimization.html', title: '22. Inference Optimization' },
                { id: 'react_pattern.html', title: '23. ReAct Pattern' },
                { id: 'multi_agent_systems.html', title: '24. Multi-Agent Systems' },
                { id: 'agent_failure_recovery.html', title: '25. Failure Recovery' },
                { id: 'scaling_rag_millions.html', title: '26. Scaling RAG' },
                { id: 'high_efficiency_indexing.html', title: '27. CRAG / Self-RAG' },
                { id: 'evaluation_ragas_langsmith.html', title: '28. Evaluation Hub' },
                { id: '20_interview_questions.html', title: '29. Interview Recap' },
                { id: '21_real_world_questions.html', title: '30. Real World Production' },
                { id: 'llm_serving.html', title: '31. LLM Serving' },
                { id: 'mcp_protocol.html', title: '32. MCP Protocol' }
            ]
        },
        {
            category: 'Backend',
            links: [
                { id: 'backend_core.html', title: 'Backend Core' },
                { id: 'backend_fastapi.html', title: 'FastAPI Mastery' },
                { id: 'backend_nodejs.html', title: 'Node.js Mastery' },
                { id: 'backend_scaling.html', title: 'Backend Scaling' }
            ]
        },
        {
            category: 'Frontend',
            links: [
                { id: 'frontend_architecture.html', title: 'Frontend Architecture' },
                { id: 'frontend_performance.html', title: 'Frontend Performance' }
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
                { id: 'database_internals.html', title: 'Database Internals' },
                { id: 'database_scaling.html', title: 'Database Scaling' }
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
                { id: 'sysdesign_high_throughput_rag.html', title: 'High-Throughput RAG' }
            ]
        },
        {
            category: 'API & Security',
            links: [
                { id: 'api_design.html', title: 'API Design' },
                { id: 'api_security_auth.html', title: 'API Security' }
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
});
