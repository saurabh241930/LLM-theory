# Phase 5: Agents & Agentic Systems — Questions & Answers

## Category 1: ReAct Pattern & Loops

### Q1: Define the ReAct pattern and explain what happens in each step.

**Define:**
ReAct (Reasoning + Acting) is a prompting pattern that gives LLMs a structured loop to solve problems. Instead of jumping straight to action, they think → act on tools → observe → repeat. This mimics human problem-solving.

**Mechanism Explained:**

The loop has 4 components:
- **Thought:** LLM reasons about what to do next
- **Action:** LLM decides which tool to call and with what parameters
- **Observation:** System returns tool result to LLM
- **Answer:** When confident, LLM outputs final answer

Visual flow:
```
User Query
    ↓
[THOUGHT] "I need to find..."
    ↓
[ACTION] Call tool X with params
    ↓
[OBSERVATION] Tool returns result
    ↓
Does LLM know answer?
├─ YES → [ANSWER] Output result
└─ NO → Loop back to THOUGHT
```

**Trade-offs:**
- ✅ Better reasoning (thinks before acting vs blind tool calling)
- ✅ Flexible (can call multiple tools, combine results)
- ✅ Debuggable (you see thinking process)
- ❌ Slower (multiple LLM calls)
- ❌ Costs more (tokens for reasoning)
- ❌ Needs good tool descriptions (or LLM picks wrong tools)

**Real Interview Example:**

Interviewer: "Walk me through how you'd debug a slow API endpoint."

Your Answer:
"I'd use ReAct. First, **Thought**: check if it's database queries or code. **Action**: run profiling tool. **Observation**: see N+1 queries. **Thought**: that's the issue. **Action**: check the ORM code. **Observation**: find loop making extra queries. **Answer**: fix by using includes/joins. The loop structure lets me debug methodically instead of guessing."

---

### Q2: When should you use ReAct vs blind tool calling? What are the differences?

**Blind Tool Calling:**
LLM sees query → immediately calls tool(s) without thinking.
```
Query: "Find the cheapest flight"
→ Immediately call search_flights()
→ Return results
```
Fast, but often wrong (wrong route, wrong dates, etc.).

**ReAct Pattern:**
LLM thinks first, then acts.
```
Query: "Find cheapest flight NYC to LA, departing Friday"
→ THOUGHT: "I need dates, airport codes, budget"
→ ACTION: get_current_date()
→ OBSERVATION: "Today is Monday, March 10"
→ THOUGHT: "Friday is March 15. NYC = JFK. LA = LAX"
→ ACTION: search_flights(from=JFK, to=LAX, date=2025-03-15)
→ OBSERVATION: [flights...]
→ ANSWER: "Cheapest is Delta at $245"
```

**When to Use Each:**

```
USE BLIND TOOL CALLING when:
├─ Task is simple (one tool call)
├─ Tool is obvious
├─ Speed matters more than accuracy
└─ Example: "What's 2+2?" → Use calculator

USE ReAct WHEN:
├─ Task is complex (multiple steps)
├─ Need information before deciding which tool
├─ Reasoning helps accuracy
├─ Tool might fail (need backup plan)
└─ Example: "Find a flight that's under $300, convenient time"
```

**Trade-off Table:**

| Factor | Blind | ReAct |
|--------|-------|-------|
| Speed | Fast | Slower (multiple LLM calls) |
| Accuracy (complex) | Poor | Good |
| Debugging | Hard | Easy (see thinking) |
| Cost | Cheap | Higher |
| Implementation | Simple | Needs loop |

---

### Q3: What causes infinite loops in ReAct? How do you prevent them?

**What Causes Them:**
LLM keeps calling same tool, never progresses.

Example:
```
STEP 1:
Thought: "I need weather"
Action: get_weather("NYC")
Observation: "72F"

STEP 2:
Thought: "Need more details"
Action: get_weather("NYC")  ← SAME CALL
Observation: "72F"

STEP 3:
...forever repeating
```

Causes:
- LLM doesn't understand tool returned useful info
- Tool descriptions are vague
- No diversity in tool options
- LLM confused about what to do next

**Prevention (Priority Order):**

1️⃣ **Set max_steps limit** (ESSENTIAL)
```
for step in range(MAX_STEPS):  # Usually 5-10
    if step >= MAX_STEPS:
        return "Max steps reached"
    # Continue loop
```
This is your safety net. Every agent needs this.

2️⃣ **Detect repeated actions**
```
if current_action == last_action:
    # Force different approach
    return "Cannot use same tool twice"
```

3️⃣ **Better tool descriptions**
Instead of: `"get_weather: Returns weather"`
Use: `"get_weather: Returns current temperature and conditions. 
       Returns same result if called multiple times. Use only once per location."`

4️⃣ **Track state changes**
```
if observation == prev_observation:
    # No new info learned
    return "No progress made"
```

---

## Category 2: LangGraph & Multi-Agent Systems

### Q4: What is LangGraph and how does it differ from LangChain?

**Quick Definition:**

LangChain: For building chains of LLM calls (sequential).
```
LLM → Parse → Tool → LLM → Return
```

LangGraph: For building graphs of nodes and edges with state management (agentic).
```
     ┌─────────────────┐
     │   Input Node    │
     └────────┬────────┘
              ↓
        ┌──────────────┐
    ┌───→│  Tool Node  │ ←──┐
    │   └──────────────┘    │
    │   (loops back)        │
    │                       │
    └───────────────────────┘
              ↓
        ┌──────────────┐
        │ Output Node  │
        └──────────────┘
```

**Key Differences:**

| Feature | LangChain | LangGraph |
|---------|-----------|-----------|
| Flow | Linear (A→B→C) | Graph (nodes + edges) |
| Loops | Not natural | Built-in |
| State | No | Yes (persistent) |
| Common Use | Simple chains | Agents, workflows |
| Complexity | Quick | Full control |

**LangGraph Concepts:**

1. **Nodes:** Functions that process state
   ```
   def process_node(state):
       return {"result": "something"}
   ```

2. **Edges:** Connections between nodes
   ```
   graph.add_edge("node_a", "node_b")
   ```

3. **Conditional Edges:** Route based on state
   ```
   def should_continue(state):
       if state["tool_called"]:
           return "tool_node"
       else:
           return "answer_node"
   
   graph.add_conditional_edges("llm_node", should_continue)
   ```

4. **State:** Persistent data across nodes
   ```
   state = {
       "input": user_query,
       "tool_results": [],
       "iterations": 0
   }
   ```

**Real Example: ReAct in LangGraph**
```
Nodes:
├─ llm_node: LLM decides Thought/Action
├─ tool_node: Execute tool
└─ answer_node: Return final answer

Edges:
llm_node → (conditional) →
  ├─ tool_node → (loop back) → llm_node
  └─ answer_node (if done)
```

---

### Q5: Explain three multi-agent patterns: supervisor, collaborative, and hierarchical. When do you use each?

**Pattern 1: Supervisor Pattern**

Concept: One "boss" agent routes work to specialists.

```
      ┌────────────────┐
      │  Supervisor    │
      │  (Router LLM)  │
      └────────┬───────┘
               │
      ┌────────┼────────┬──────────┐
      ↓        ↓        ↓          ↓
  Researcher Analyst Coder  Finance
  (Agent)    (Agent)  (Agent) (Agent)
      │        │        │          │
      └────────┬────────┴──────────┘
               ↓
        ┌────────────────┐
        │ Final Answer   │
        └────────────────┘
```

How it works:
1. User asks supervisor a question
2. Supervisor LLM decides → "This needs Researcher + Analyst"
3. Supervisor calls those agents in parallel
4. Agents return results
5. Supervisor combines into final answer

**When to use:**
- Different tasks need different expertise
- Tasks are independent (can run in parallel)
- Performance matters (not sequential)
- Examples: "Analyze X and get news on Y"

---

**Pattern 2: Collaborative Pattern**

Concept: Agents pass work sequentially, each builds on previous.

```
User Query
    ↓
Researcher → Research Notes
    ↓
Analyst → Analysis + Insights
    ↓
Writer → Final Article
```

How it works:
1. Researcher gathers info
2. Analyst reviews, adds insights
3. Writer formats final answer
4. Each step depends on previous

**When to use:**
- Tasks need refinement/iteration
- Early steps inform later steps
- Quality > speed
- Examples: "Research a topic, then write an article"

---

**Pattern 3: Hierarchical Pattern**

Concept: Multi-level supervision (agents manage sub-agents).

```
        ┌──────────────────┐
        │  Top Supervisor  │
        │  (Coordinates)   │
        └────────┬─────────┘
                 │
    ┌────────────┼────────────┐
    ↓            ↓            ↓
Research    Deployment   Support
Team Lead   Team Lead    Team Lead
(Supervisor) (Supervisor) (Supervisor)
    │            │            │
    ├─Agent      ├─Agent      ├─Agent
    └─Agent      └─Agent      └─Agent
```

How it works:
1. Top supervisor assigns high-level tasks
2. Department supervisors break into sub-tasks
3. Individual agents execute
4. Results bubble up

**When to use:**
- Large organizations (many agents)
- Strong hierarchy (departments)
- Complex workflows
- Scaling teams

---

**Comparison Table:**

| Pattern | Flow | Use Case |
|---------|------|----------|
| Supervisor | Parallel | Independent expert tasks |
| Collaborative | Sequential | Refinement pipeline |
| Hierarchical | Tree | Large teams, clear departments |

---

### Q6: What are "memory" systems in agents? How do you design short-term vs long-term memory?

**What Is Agent Memory?**

Memory = How agents remember past interactions.

Without memory:
```
User: "My name is John"
Agent: "Nice to meet"
User: "What's my name?"
Agent: "I don't know"  ← No memory!
```

With memory:
```
User: "My name is John"
Agent: Stores in memory
User: "What's my name?"
Agent: "John"  ← Remembers!
```

**Short-Term Memory (Conversation Context)**

Purpose: Remember current conversation.

How:
```
messages = [
  ("user", "My name is John"),
  ("assistant", "Nice to meet"),
  ("user", "What's my name?"),
  ("assistant", "John")  ← Uses message history
]
```

Design:
```
# Keep last N messages
MAX_MESSAGES = 10
if len(messages) > MAX_MESSAGES:
    messages = messages[-MAX_MESSAGES:]
```

Tradeoff:
- ✅ Simple (just message history)
- ✅ Works for most conversations
- ❌ Loses long-ago context
- ❌ Expensive (more tokens)

Use: Regular conversations, customer support, chatbots.

---

**Long-Term Memory (Persistent Storage)**

Purpose: Remember facts across multiple conversations.

How:
```
Store in database:
user_id: "john_123"
facts: [
  "Name: John",
  "Company: Acme Inc",
  "Role: Engineer",
  "Preference: Coffee"
]

Next conversation:
"Retrieve facts for john_123"
→ Has all facts from before
```

Design:
```
# Store important facts
def store_fact(user_id, fact):
    db.insert({
        "user_id": user_id,
        "fact": fact,
        "timestamp": now()
    })

def retrieve_facts(user_id, last_days=30):
    return db.query(user_id, created_after=now()-30d)
```

Tradeoff:
- ✅ Remembers across conversations
- ✅ Personalized (user-specific)
- ❌ Complex (need database)
- ❌ Storage costs
- ❌ Privacy concerns (storing user data)

Use: Personal assistants, recommendation systems, long-term relationships.

---

**Practical Design:**

Use both:
```
1. Short-term (messages): For current conversation
2. Long-term (DB): For user facts

Example interaction:
├─ Load long-term facts about user
├─ Use in current conversation
├─ Extract new facts
├─ Store new facts
└─ Save updated message history (short-term)
```

---

## Category 3: Agent Failure Modes & Recovery

### Q7: What's the difference between a hallucinated tool call and a parameter error? How do you handle each?

**Hallucinated Tool Call**

Problem: LLM invents a tool that doesn't exist.

```
Available tools: ["get_weather", "search_web"]

LLM tries:
Action: get_stock_price  ← DOESN'T EXIST
Error: Tool not found!
```

Handling:
```
if tool_name not in available_tools:
    # Tell LLM what happened
    error = f"Tool '{tool_name}' not found. Available: {tools}"
    
    # Give another chance to pick real tool
    messages.append(("assistant", action))
    messages.append(("user", error))
    response = llm(messages)  # Retry
```

---

**Parameter Error**

Problem: Tool exists, but parameters are wrong.

```
Tool: get_weather(city: string, days: int)

LLM tries:
get_weather(city=123, days="abc")

Error: Type mismatch!
```

Handling:
```
try:
    result = tool(city, days)
except TypeError as e:
    error = f"Invalid parameters: {e}. 
              Expected: city (string), days (1-14)"
    
    # Tell LLM, let it retry
    messages.append(("user", error))
    response = llm(messages)
```

---

**Quick Comparison:**

| Type | Cause | Detection |
|------|-------|-----------|
| Hallucinated | Tool doesn't exist | Not in available_tools |
| Parameter | Tool exists, params bad | TypeError/ValueError |
| Both | Different problems | Check tool_name first, then validate params |

**Prevention:**
- Give clear tool list in prompt
- Define parameter types (string, int, date)
- Provide examples

---

### Q8: How do you prevent and recover from infinite loops in agent loops?

**Prevention (Before It Happens)**

1️⃣ **Max steps limit** (ESSENTIAL)
```
MAX_STEPS = 10
for step in range(MAX_STEPS):
    # If we hit MAX_STEPS, stop
    result = agent_step()
```

2️⃣ **Detect repeated actions**
```
if current_action == last_action:
    stop()  # Don't loop
```

3️⃣ **Better tool descriptions**
```
Instead of: "search: Find info"
Better: "search: Find information. Returns different results per query."
```

---

**Recovery (If It Happens)**

```
step_count = 0
while step_count < MAX_STEPS:
    try:
        result = agent_step()
        step_count += 1
    except MaxStepsError:
        # Graceful fallback
        return "Unable to complete, max iterations reached"

# After: If we loop too much
if steps == MAX_STEPS:
    final_answer = llm.summarize()  # Best attempt so far
    return final_answer
```

---

### Q9: What are the 7 main ways agents fail and what's the simplest fix for each?

**Summary Table:**

| Failure | Cause | Simple Fix |
|---------|-------|-----------|
| Infinite loops | Same tool forever | Set MAX_STEPS limit |
| Hallucinated tools | Tool doesn't exist | Validate tool names |
| Wrong tool | Picked tool poorly | Better descriptions |
| Parameter error | Invalid parameters | Type validation |
| Tool failure (real) | API down, timeout | Retry + timeout |
| Lost context | Forgot goal | Remind goal in prompt |
| Wrong answer | Doesn't address query | Validate relevance |

**Checklist for Production:**

```
Before deploying agents:
□ Set MAX_STEPS limit (5-10)
□ Validate tool names before calling
□ Define parameter types clearly
□ Handle tool errors (don't crash)
□ Track state (don't lose goal)
□ Test with bad inputs
□ Monitor for infinite loops
□ Have fallback answer
```

---

## Integration Question: Design a Multi-Agent Research System

### Q10: You're building a research assistant that answers complex questions across multiple domains. Design a multi-agent system that won't fail. Specify: agents, tool types, failure prevention, and how they coordinate.

**Scenario:**
Users ask complex questions like: "What's the environmental impact of electric cars vs hybrids, considering current electricity sources?"

This needs: Environmental data, Energy stats, Car performance, Economic analysis, Recent news.

---

**Your System Design:**

**Architecture:**

```
       ┌──────────────────────────┐
       │  Research Coordinator    │
       │  (Supervisor LLM)        │
       └────────────┬─────────────┘
                    │
      ┌─────────────┼─────────────┬──────────────┐
      ↓             ↓             ↓              ↓
┌──────────┐  ┌──────────┐ ┌──────────┐  ┌──────────┐
│Environmental│Science  │Economics  │News      │
│Researcher  │Agent    │Agent      │Agent    │
└──────────┘  └──────────┘ └─────────┘  └──────────┘
      │             │             │              │
      └─────────────┼─────────────┴──────────────┘
                    ↓
          ┌──────────────────────┐
          │ Synthesis Agent      │
          │ (Combines findings)  │
          └──────────────────────┘
```

---

**Agents & Tools:**

**1. Environmental Researcher**
- Role: Find environmental data
- Tools:
  - `search_scientific_papers(query)` → Recent studies
  - `get_carbon_footprint(vehicle_type)` → Emissions data
  - `query_environmental_db()` → Lifecycle analysis
- Max steps: 5

**2. Science Agent**
- Role: Energy sources & efficiency
- Tools:
  - `get_electricity_grid_composition(country)` → Coal/renewables %
  - `get_vehicle_efficiency(model)` → MPG/kWh
- Max steps: 4

**3. Economics Agent**
- Role: Cost analysis
- Tools:
  - `get_vehicle_prices(type)` → Purchase cost
  - `get_fuel_prices()` → Gas/electricity costs
  - `calculate_total_cost_ownership(params)` → 10-year cost
- Max steps: 4

**4. News Agent**
- Role: Recent developments
- Tools:
  - `search_news(query)` → Latest articles
  - `get_regulatory_changes()` → Policy updates
- Max steps: 3

**5. Synthesis Agent**
- Role: Combine all findings
- Inputs: Results from all four agents
- Output: Unified answer with citations

---

**Failure Prevention Built In:**

```
For Infinite Loops:
├─ Each agent: MAX_STEPS = {value}
├─ Coordinator: MAX_STEPS = 15 (5+4+4+3, all agents + overhead)
└─ Hard stop after limits

For Hallucinated Tools:
├─ Each agent only knows its tools
├─ System validates tool names
└─ If invalid → error message + retry

For Parameter Errors:
├─ Each tool has JSON schema
├─ Validate before call
└─ Type mismatch → error message + retry

For Real Tool Failures:
├─ Timeout: 10 seconds per tool call
├─ Retry: 2 attempts with 2-second backoff
├─ Fallback: Use cached data if available
├─ Tell LLM: "Tool failed: {reason}"

For Lost Context:
├─ Coordinator remembers original question
├─ Every agent reminded: "Main question: XYZ"
└─ Synthesis agent checks: "Does this answer the original question?"

Monitoring:
├─ Log all steps
├─ Alert if any agent hits MAX_STEPS
├─ Track tool success rates
└─ Monitor execution time (should be <30 sec)
```

---

**Coordination:**

```
STEP 1: Parse user question
└─ Coordinator: "This needs environmental + economics + news data"

STEP 2: Call agents in parallel
├─ Environmental Researcher ──────┐
├─ Science Agent ────────────────┬┤
├─ Economics Agent ──────────────┤├─ (All parallel, 
└─ News Agent ───────────────────┘│  faster)
                                   │
STEP 3: Collect results
├─ Environmental: "EVs emit X, hybrids emit Y..."
├─ Science: "Electricity is 60% renewable in region"
├─ Economics: "EV costs $40k, hybrid $30k..."
└─ News: "New EV subsidy announced Monday"

STEP 4: Synthesis agent combines
"Based on research:
 • Environmental: EVs better if region uses renewables
 • Economics: Higher upfront, lower operating costs
 • News: New subsidies make EVs competitive now"

STEP 5: Return answer with sources
```

---

**Code Sketch:**

```python
coordinator = LLM("supervisor")
agents = {
    "environment": Agent(tools=[search_papers, carbon_footprint]),
    "science": Agent(tools=[grid_composition, efficiency]),
    "economics": Agent(tools=[prices, cost_ownership]),
    "news": Agent(tools=[news_search, regulations])
}

def research(question):
    # Step 1: Route
    routing = coordinator.decide_agents(question)
    # → {"env": true, "science": true, "econ": true, "news": true}
    
    # Step 2: Execute in parallel
    results = {}
    for agent_name, use_it in routing.items():
        if use_it:
            results[agent_name] = agents[agent_name].run(
                question,
                max_steps=agent_limits[agent_name]
            )
    
    # Step 3: Synthesize
    synthesis_llm = LLM("synthesis")
    final_answer = synthesis_llm.combine(question, results)
    
    return final_answer
```

---

**Why This Works:**

✅ **Specialization:** Each agent expert in its domain
✅ **Parallel:** Fast (all agents run at once)
✅ **Failure-safe:** Max steps, timeouts, validation
✅ **Recoverable:** Retries for transient failures
✅ **Debuggable:** See each agent's thinking
✅ **Scalable:** Easy to add more agents

---

## Key Takeaways for Interviews

**ReAct Pattern:**
- Structured loop: Thought → Action → Observation → Answer
- Better than blind tool calling for complex problems
- Risk: Inefficiency and hallucinations (prevent with descriptions + validation)

**Multi-Agent Patterns:**
- Supervisor: Parallel specialists (fast)
- Collaborative: Sequential refinement (quality)
- Hierarchical: Large teams (scalability)

**Agent Failures:**
- Loops: Set MAX_STEPS limit (essential!)
- Tools: Validate names, parameters, handle errors
- Context: Track goal, remind LLM frequently
- Always tell agent what went wrong (error messages)

**Design Principles:**
- Limit iterations (max_steps)
- Validate early (tool names, parameters)
- Handle errors gracefully (retry, fallback)
- Communicate failures to agent (for recovery)
- Monitor in production (logs, metrics)
