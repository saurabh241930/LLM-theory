# Gen AI section: gap notes

Audit date: 2026-09-15. Baseline: 39 pages under `GEN AI` in `sidebar.js`, plus `ADVANCED RAG DEEP DIVES` (6) and `LLMOps & PRODUCTION` (6).

Reference for "what depth should look like": `SAFAgenticSimulationRuns.pdf` (61 pages, Parts 0-4), which covers one agent end to end with file paths, cost tables, failure modes, and 88 rehearsed questions.

**Status: built.** All 21 items in the build plan (section 5) are done. 17 new pages, 4 rewrites, the RSA page deleted, the RSA case study replaced in 18 files, sidebar and index rewired, one broken link fixed. Every internal link across 184 pages resolves and `sidebar.js` parses.

---

## 1. What the measurement says

Visible word count per page, `sed 's/<[^>]*>/ /g' | wc -w`:

| Page | Words | Verdict |
|---|---|---|
| `graph_rag.html` | 158 | stub |
| `query_rewriting.html` | 165 | stub |
| `agentic_rag.html` | 181 | stub |
| `hybrid_search.html` | 181 | stub |
| `llm_security.html` | 394 | thin |
| `hallucination_detection.html` | 410 | thin |
| `llm_tracing_observability.html` | 463 | thin |
| `token_optimization_strategies.html` | 562 | thin |
| `genai_memory.html` | 622 | thin |
| `chunking_strategies.html` | 688 | thin |
| `mcp_protocol.html` | 686 | thin |
| `tokenization_context_windows.html` | 1297 | acceptable |

Median Gen AI page: ~640 words. One SAF operation (Op 5a, retrieval funnel) runs longer than that on its own and carries four tables.

`agentic_rag.html` in full is one question, three bullets naming tools, and a mermaid box. It never says when the agent stops, what it costs, or what happens when retrieval returns nothing.

**Broken link:** `sidebar.js:141` points to `evaluation_ragas_langsmith.html`, which does not exist. Clicking "33. Evaluation Hub" 404s.

---

## 2. Missing outright

These have no page. Each is standard in 2026 agent work and appears by name in job specs and system-design rounds.

| Topic | Why it belongs | SAF anchor |
|---|---|---|
| **Agent skills** | Progressive disclosure is how you carry dozens of playbooks without burning context. Frontmatter (~100 tokens) stays resident; the body loads on a trigger. | Operation 6 — `skills/fluent-divergence/SKILL.md`, loaded by tag, versioned via `verified_against` |
| **Sandboxes / code execution** | Agents that write and run code need an isolation boundary. Nothing in the course covers it. | Zone 3 trust boundary; `scripts/classify_residuals.py` bundled inside a skill |
| **Context engineering** | The discipline that replaced prompt engineering: what occupies the window, in what order, at what cost. Course has `prompt_engineering.html` only. | Layering figure — resources → tools → skills → assembled system prompt |
| **Short vs long-term memory** | `genai_memory.html` (622 words) treats memory as conversation buffer. It never distinguishes working state from durable cross-run memory. | Operation 8 — workflow history vs `mem_nodes`/`mem_edges` in Postgres |
| **Loop engineering** | Bounded loops, stop conditions, iteration caps, budget checks. The single most common production failure is an unbounded loop. | Operation 5 — `MAX_ITERS = 4`, `MIN_CORRECT = 3`, 9-call ceiling, three stop conditions |
| **Durable execution / agentic workflow** | Temporal-style replay, idempotency keys, signals, timers. Any agent waiting on a long job needs it. | Operation 2 — `RunSolutionWorkflow`, `continue_as_new`, `workflow.patched` |
| **Structured outputs** | Constrained decoding against a JSON Schema. Course teaches function calling but not schema-constrained decoding, and never says structural validity ≠ semantic correctness. | Teaching pause before Operation 1 — `Plan.model_json_schema()` |
| **Guardrails and policy** | Allow-lists, budgets, action-class gates. Deterministic code around the model, not a second prompt. | Operation 9 — `policy/allowlist.py`, `check_budget()`, Table 3.2 |
| **Human-in-the-loop** | Approval as a durable timed wait, gated on action class, with an escalation path. | Operation 7 — two-window gate, default reject on timeout |
| **Evals beyond RAGAS** | The eval pyramid: unit → component → end-to-end → LLM-as-judge. Course has RAG eval only, and the link is broken. | Operation 10 — Table 3.3, five metrics with targets |

---

## 2b. Also missing (found in the audit, not on the original list)

These did not come up in the brief but are standard 2026 production concerns and have no page.

| Topic | Why it belongs | SAF anchor |
|---|---|---|
| **Indirect prompt injection** | The agent security problem. A retrieved solver log or scraped doc carries "ignore prior guidance" and the model obeys. `llm_security.html` (394 words) covers jailbreaks, not retrieved-content injection. | "Treat every line quoted from a solver log as untrusted data, not instruction"; delimited labelled blocks; `RemediationKind` closed enum as the backstop |
| **Multi-tenancy and data isolation** | Zero coverage anywhere in the course. One tenant seeing another's chunks ends an enterprise deal. The control has to be a SQL predicate, never a prompt instruction. | `WHERE tenant_id = $1` in the funnel and the memory graph; CI test asserting zero cross-hits on a two-tenant fixture |
| **Model routing and cost engineering** | Running one model for every call is the default and the expensive mistake. Routing by job (plan / diagnose / grade) changes cost per run by 5-10x. | Table 2.2 and Table 3.4 — Opus 5 plans, Sonnet 5 proposes, Haiku 4.5 grades; $0.11 worst case, $0.046 typical |
| **Prompt caching mechanics** | `llm_cost_caching.html` exists but treats caching as response caching. Prefix caching needs a stable prompt prefix and a minimum cacheable length, and short prompts do not benefit. | "Haiku 4.5's minimum cacheable prefix is 4,096 tokens, the prompt a few hundred, so cache grader *verdicts* instead, keyed by `(query_hash, evidence_id, model)`" |
| **Extended thinking / test-time compute** | Reasoning-model budgets, when thinking tokens pay for themselves, how they interact with structured outputs and caching. Nothing in the course mentions it. | Model routing rationale: planning gets the most capable reasoning over the largest context, grading does not need it |
| **Embedding migration and index versioning** | Everyone hits it on the first embedding-model upgrade and there is no page. Vectors from two models are not comparable in one index. | Chokepoint — "Embedding-model upgrade forces a full re-embed": stamp `embedding_model` per row, dual-write, backfill off-peak, cut over, drop |
| **Corpus versioning and index drift** | Docs reissue per product release; stale chunks keep retrieving and the grader cannot tell stale from current without a version field. | `solver_version` as both filter predicate and grader rule; retire with `valid_to = now()` |
| **Document parsing and ingestion** | Every RAG page starts from clean text. Real corpora are PDFs with tables and figures. The chunker is downstream of a parser nobody teaches. | Four ingestion lanes, each with a different parse and chunk stage |
| **Tool design** | `function_calling.html` covers the mechanics of a call, not how to design the tool: typed enums over `Any`, error messages that guide the next call, when to add a tool versus a skill. | Chokepoint — "`value: Any` is not a contract"; `ValueError(f"Step '{step_name}' not found.")` enumerating valid options |
| **Claim-check for large payloads** | Agents pass files, logs, and long plans through context and hit payload limits. The fix is passing a URI and a hash. | Chokepoint — "A plan too big for history"; `log_ref`, `payload_ref` as object-storage URIs |
| **The retrieval funnel as one priced pipeline** | Hybrid search, RRF, and reranking exist as three disconnected pages with no candidate counts and no costs, so nobody learns the ordering rule. | Figure 3.7b — 120,000 → 8,000 → 200 → 50 → 8 → 5, ~$0.046, and "each stage costs 10-100x more per candidate, so it must see 10-100x fewer" |
| **Agent observability with OTel GenAI conventions** | `llm_tracing_observability.html` (463 words) predates the GenAI semantic conventions that are now the standard span attributes. | `gen_ai.provider.name`, `gen_ai.usage.input_tokens`, prompt stored externally behind `saf.prompt_ref` |
| **Grader / judge drift** | LLM-as-judge is now common and silently degrades when the provider moves a floating model alias. | Chokepoint — "Grader drift": pin exact model IDs, frozen labelled triples in CI, alert on verdict-distribution shift |

---

## 3. Pages that exist but under-deliver

**`agentic_rag.html` (181 words).** Says an agent "decides what, when, and how many times to retrieve." Never answers: how many times is too many, what makes it stop, what one query costs, what happens when nothing relevant exists. SAF answers all four in code: 4 iterations, three stop conditions, ~$0.046 per diagnosis, and escalation as a *result* rather than a bug.

**`graph_rag.html` (158 words).** Presents Graph RAG as a better RAG. Misses the actual decision: full Graph RAG costs an LLM-built index that must be rebuilt per corpus release. SAF scopes it to a small durable memory graph queried by a two-hop recursive CTE, zero LLM calls, and says why the docs corpus is the wrong place for it.

**`chunking_strategies.html` (688 words).** Lists fixed/recursive/semantic chunking generically. No page says different *sources* need different chunkers in the same system. SAF's four ingestion lanes do: solver logs get structure-aware chunks, docs get ~800-token prose chunks then contextualised, skills are never chunked, past-run records are already structured.

**`hallucination_detection.html` (410 words).** Detection framed as a scoring problem. The practical fixes are structural, and the course does not show them: constrained decoding kills malformed JSON; validating a plan against a real DAG kills hallucinated step names; an evidence-ID check kills invented citations; a closed enum kills invented actions. Each is a different failure class with a different fix.

**`hybrid_search.html` (181 words)** and **`reranking.html` (743 words)** are separate pages that never connect into a funnel with candidate counts and per-stage cost. SAF Figure 3.7b does: 120,000 → 8,000 → 200 → 50 → 8 → 5, priced per stage.

**`multi_agent_systems.html` (591 words)** presents swarms without the trade-off. SAF Part 1 scores a swarm against a durable orchestrator on six criteria and rejects it, which is the answer an interviewer wants.

---

## 4. Removing the RSA page

`sysdesign_agentic_rag_rsa.html` ("Designing a RSA NLP Dashboard") is a text-to-SQL dashboard over a sales board: intent classification, a SQL layer, a doc RAG layer, model selection, tradeoffs.

It is deleted, not archived, and the sidebar entry goes with it. Reasons:

- Text-to-SQL over a sales DB is already covered by `nl_to_sql.html` and `improving_nl_to_sql.html`.
- It is a read-only question-answering system. Nothing waits hours, nothing crashes mid-run, nothing needs approval, nothing retries.
- Because nothing can fail expensively, it cannot teach durability, idempotency, budgets, approval gates, or diagnosis, which are the topics the section is missing.

The SAF design carries all of them because a solver run costs cluster-hours and can fail six ways. One running example across twenty pages beats twenty unrelated toy examples, and this is the one that has failure modes worth teaching.

Git history keeps the old file if anything in it is worth salvaging later.

---

## 5. Build plan

Agent core (new):

1. `context_engineering.html` — what occupies the window, layering, token budget
2. `agent_skills.html` — SKILL.md, progressive disclosure, versioning, skill vs tool vs prompt vs resource
3. `agent_sandboxes.html` — isolation, untrusted-content boundary, bundled scripts
4. `agent_memory_systems.html` — working vs durable memory, memory graph schema, write-back discipline, poisoning
5. `loop_engineering.html` — iteration caps, stop conditions, budget checks, runaway loops
6. `agentic_workflows.html` — durable execution, replay determinism, idempotency, signals and timers, claim-check, HITL
7. `structured_outputs_guardrails.html` — constrained decoding, allow-lists, action-class gates
8. `tool_design.html` — typed schemas, error messages that guide the next call, tool vs skill

Retrieval (new):

9. `retrieval_funnel.html` — filter, hybrid, RRF, rerank, grade, with candidate counts and per-stage cost
10. `document_parsing_ingestion.html` — parsers, per-source lanes, contextualisation, refresh cadence
11. `embedding_migration_versioning.html` — dual-write cutover, corpus versioning, index drift

Production (new):

12. `agent_evals.html` — eval pyramid, metrics with targets, grader drift; replaces the broken `evaluation_ragas_langsmith.html` link
13. `prompt_injection_defense.html` — indirect injection through retrieved content, structural defences
14. `multi_tenancy_isolation.html` — SQL-level tenant predicates, partial indexes, CI cross-hit tests
15. `model_routing_cost.html` — routing by job, prefix caching mechanics, per-run budgets
16. `extended_thinking.html` — test-time compute, thinking budgets, interaction with schemas and caching

Case study (new):

17. `sysdesign_saf_agent.html` — the whole system end to end

Rewrites:

18. `agentic_rag.html` — bounded agentic loop, real use cases, cost
19. `graph_rag.html` — when a graph beats an index, and when it does not
20. `chunking_strategies.html` — per-source chunkers, contextualisation, refresh cadence
21. `hallucination_detection.html` — failure taxonomy with a structural fix per class

Rules for every page: at least one number, at least one named failure mode with symptom / cause / mitigation, and a mapping to the SAF example. Prose follows the `no-ai-slop` skill.
