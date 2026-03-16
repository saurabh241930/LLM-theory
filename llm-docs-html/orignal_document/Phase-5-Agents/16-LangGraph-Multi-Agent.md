# 16. LangGraph & Multi-Agent Systems

## LangGraph: Framework for Building Agents

**LangGraph** is a framework (by LangChain) for building stateful agents.

### LangChain vs LangGraph

```
LANGCHAIN (Simpler, Linear)
├─ Best for: Chains of operations
├─ Use case: Instruction → Process → Output
├─ Architecture: Linear pipeline
└─ Doesn't track state well

LANGGRAPH (Advanced, Stateful) ⭐ PREFERRED
├─ Best for: Iterative agents
├─ Use case: Agent loops, multi-step reasoning
├─ Architecture: Graph with nodes + edges
└─ Tracks state, memory, tool calls
```

---

## LangGraph Basics

### Components

```
Node = Single step in agent
├─ Can call LLM, tool, or process data
├─ Takes input: state
└─ Returns: updated state

Edge = Transition between nodes
├─ Conditional: "If condition, go to node B"
├─ Unconditional: "Always go to node B"

Graph = Collection of nodes + edges
├─ Entry point: Start node
├─ Exit point(s): End node
└─ Agent loop: Nodes connected in graph
```

---

## Simple Agent with LangGraph

```
STRUCTURE:

start → [process] → [llm_step] → [tool_step] → [end]
                        ↑___________↓
                    (loops until done)

NODE 1: Process Input
├─ Parse user query
├─ Check format
└─ Return: clean query

NODE 2: LLM Step
├─ Call LLM with query
├─ Decide: use tool or final answer?
└─ Return: action or final answer

NODE 3: Tool Step
├─ Execute tool
├─ Observe result
└─ Return: observation

Loop:
└─ If action needed: go back to LLM step
└─ If final answer: go to end
```

### Code Example

```python
from langgraph.graph import StateGraph, END

# Define state shape
class AgentState(TypedDict):
    query: str
    messages: list
    final_answer: str

# Create graph
graph = StateGraph(AgentState)

# Add nodes
def llm_step(state):
    # LLM reasons and decides action
    response = llm.complete(state["messages"])
    return {"messages": state["messages"] + [response]}

def tool_step(state):
    # Execute tool based on last LLM response
    action = extract_action(state["messages"][-1])
    result = execute_tool(action)
    return {"messages": state["messages"] + [f"Observation: {result}"]}

graph.add_node("llm", llm_step)
graph.add_node("tools", tool_step)
graph.add_node("end", lambda s: {"final_answer": s["messages"][-1]})

# Add edges (transitions)
graph.add_edge("START", "llm")
graph.add_conditional_edges(
    "llm",
    should_use_tool,  # Function that returns "tools" or "end"
    {
        "tools": "tools",
        "end": "end"
    }
)
graph.add_edge("tools", "llm")  # Loop back to LLM
graph.add_edge("end", END)

# Compile and run
agent = graph.compile()
result = agent.invoke({"query": "What's the weather?"})
```

---

## Multi-Agent Systems

When one agent isn't enough.

### Why Multiple Agents?

```
Single agent problem:
├─ One agent doing everything
├─ Might make mistakes
├─ Can't parallelize
└─ Complex reasoning becomes hard

Multiple agents solution:
├─ Specialist agents (each good at one thing)
├─ Can work in parallel
├─ Can supervise each other
├─ Better error recovery
```

### Architecture 1: Supervisor Pattern

```
One supervisor agent routes to specialists.

        ┌─────────────────────┐
        │  User Query         │
        └────────┬────────────┘
                 │
        ┌────────▼────────┐
        │  Supervisor     │  (decides which specialist)
        │  Agent          │
        └────────┬────────┘
           ┌─────┴──────┬─────────┐
           │            │         │
    ┌──────▼─────┐ ┌──▼─────┐ ┌─▼──────────┐
    │  Research  │ │ Coding │ │ Analysis   │
    │  Specialist│ │Agent   │ │ Specialist │
    └──────┬─────┘ └──┬─────┘ └─┬──────────┘
           │          │         │
           └──────────┼─────────┘
                      │
             ┌────────▼───────┐
             │ Combine Results │
             └────────┬───────┘
                      │
            ┌─────────▼────────┐
            │ Return Answer    │
            └──────────────────┘
```

### Architecture 2: Collaborative Pattern

Agents work together, passing results.

```
Agent A → Agent B → Agent C → Final Answer

Example:
Agent A: Search for information
Agent B: Analyze and summarize
Agent C: Check accuracy and format answer
```

### Architecture 3: Hierarchical Pattern

Agents at different levels (coarse → fine).

```
Level 1 (Planner):
├─ High-level strategy
└─ Decompose into sub-tasks

Level 2 (Executors):
├─ Execute each sub-task
├─ Report progress
└─ Handle errors

Level 1 (Validator):
├─ Check final answer
└─ Quality assurance
```

---

## Multi-Agent Example: Research Assistant

```
Task: "Research Python async/await and summarize"

SUPERVISOR AGENT:
"This requires: Research → Synthesis → Quality Check"

RESEARCHER AGENT (works in parallel):
├─ Tool: search_web("Python async/await")
├─ Collects: 5 relevant articles
└─ Result: Raw information

SYNTHESIZER AGENT:
├─ Input: Raw information from researcher
├─ Tool: None (uses LLM reasoning)
├─ Creates: Structured summary
└─ Result: Organized knowledge

QUALITY AGENT:
├─ Input: Summary from synthesizer
├─ Checks: Accuracy, completeness, clarity
├─ Tool: fact_check("async/await definition")
└─ Result: Verified, final summary

SUPERVISOR:
└─ Returns: "Here's the comprehensive summary..."
```

---

## Memory in Multi-Agent Systems

Agents need to remember:

```
Short-term: Current conversation
├─ State that updates each step
├─ Passed between nodes
└─ Example: messages list, recent actions

Long-term: Historical information
├─ Persistent across conversations
├─ Stored in database/vector DB
├─ Example: User preferences, past decisions

Shared: Between agents
├─ Both agents can read/write
├─ Careful with conflicts
└─ Example: Shared tool results cache
```

---

## Key Takeaways

✅ **LangGraph** = Framework for stateful agents

✅ **Nodes** = Steps, **Edges** = Transitions

✅ **ReAct loop** = LLM → Tool → Observe → Repeat

✅ **Multi-agent** = Specialists + Supervisor

✅ **Patterns:**
   - Supervisor: One agent routes to specialists
   - Collaborative: Agents pass results
   - Hierarchical: Coarse → Fine grained

✅ **Memory matters:** Track state, remember context

**Next:** What can go wrong with agents → Agent Failure Modes
