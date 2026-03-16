# 17. Agent Failure Modes & Recovery

## Common Ways Agents Fail

```
┌──────────────────────────────────────────────────────┐
│  Agent Failure Categories                            │
├──────────────────────────────────────────────────────┤
│                                                      │
│  1. INFINITE LOOPS                                 │
│     Agent calls same tool repeatedly                │
│                                                      │
│  2. HALLUCINATED TOOLS                            │
│     LLM invents tool names that don't exist        │
│                                                      │
│  3. WRONG TOOL SELECTION                           │
│     Uses tool, but wrong one for task              │
│                                                      │
│  4. PARAMETER ERRORS                               │
│     Calls tool with invalid parameters              │
│                                                      │
│  5. TOOL FAILURES (Real)                          │
│     Tool actually fails (API down, DB error)        │
│                                                      │
│  6. LOST IN CONTEXT                                │
│     Agent forgets what it's doing (long conv)      │
│                                                      │
│  7. IRRELEVANT FINAL ANSWER                       │
│     Generates answer that doesn't address query     │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## Failure 1: Infinite Loops

**Problem:** Agent keeps calling same tool, never progresses.

```
Example:
Task: "Get weather"

STEP 1:
Thought: "Need weather"
Action: get_weather("NYC")
Observation: "Temperature 72F"

STEP 2:
Thought: "Need more details"
Action: get_weather("NYC", detailed=true)
Observation: "Temperature 72F, humidity 60%"

STEP 3:
Thought: "Need even more details"
Action: get_weather("NYC", detailed=true, extended=true)
... loops forever

❌ INFINITE LOOP
```

**Solutions:**

```
SOLUTION 1: Set max_steps limit ⭐ ESSENTIAL
├─ Stop after N iterations (usually 5-10)
├─ Code:
│  if steps > MAX_STEPS:
│      return "Max steps reached"
└─ This is your safety net!

SOLUTION 2: Detect repeated actions
├─ Check: Is LLM calling exact same tool twice?
├─ If yes: Force different tool or end
└─ Code:
   if current_action == last_action:
       # Force different action or end
       return "Cannot use same tool twice"

SOLUTION 3: Track state changes
├─ After each action, has state changed?
├─ If state unchanged: Stop (nothing new learned)
└─ Code:
   if state == prev_state:
       # No progress, end agent
       return "No new information gained"
```

---

## Failure 2: Hallucinated Tools

**Problem:** LLM invents a tool that doesn't exist.

```
Available tools: ["get_weather", "get_news", "search_web"]

LLM tries:
Action: get_stock_price
Action Input: {"stock": "AAPL"}

Error: Tool "get_stock_price" does not exist!
```

**Solutions:**

```
SOLUTION 1: Validate tool names in prompt
├─ Include in system prompt: "Available tools: {list}"
├─ Tell LLM exactly what tools exist
└─ Less chance of hallucination

SOLUTION 2: Provide tool descriptions
├─ Instead of: "search_web"
├─ Use: "search_web: Search internet for information"
├─ More context → better tool choosing

SOLUTION 3: Constrain output format (JSON Mode)
├─ Force LLM to output valid JSON
├─ Validate before execution
├─ Example:
│  {
│    "action": "get_weather",  ← Validated
│    "params": {"city": "NYC"}
│  }

SOLUTION 4: Error recovery
├─ If tool doesn't exist:
│  Message: "Tool 'X' not found. Available: [Y, Z]"
│  Give LLM another chance to pick real tool
└─ Code:
   if tool_name not in available_tools:
       error_msg = f"Tool {tool_name} doesn't exist. Try: {list(tools)}"
       messages.append(("user", error_msg))
       return llm_step()  # Let LLM retry
```

---

## Failure 3: Wrong Tool Selection

**Problem:** Valid tool, but wrong one for task.

```
Task: "What's the exchange rate of USD to EUR?"

LLM picks: search_web (wrong, slow)
Better: get_exchange_rate (right tool)

Result: Slow, inaccurate answer
```

**Solutions:**

```
SOLUTION 1: Better tool descriptions
├─ Current: "get_exchange_rate: Rates"
├─ Better: "get_exchange_rate: Instantly get current exchange rates.
│           Use for: 'What's USD/EUR rate?'"
└─ More specific → better choice

SOLUTION 2: Few-shot examples
├─ Show examples of correct tool usage
├─ Example:
│  Task: "Convert $100 to EUR"
│  → Use: get_exchange_rate
│  
│  Task: "News about tech stocks"
│  → Use: search_web
└─ LLM learns by example

SOLUTION 3: Tool categories
├─ Group related tools
├─ Tell LLM which category needed
├─ Example:
│  FINANCIAL TOOLS: [get_exchange_rate, get_stock_price]
│  RESEARCH TOOLS: [search_web, get_news]
│  
│  Task: "What's EUR rate?"
│  → Need: FINANCIAL TOOLS
└─ Narrows choices

SOLUTION 4: Validate tool choice
├─ After LLM picks tool:
│  Is it appropriate for task?
│  (Manual rule validation)
└─ If wrong, prompt for correction
```

---

## Failure 4: Parameter Errors

**Problem:** Tool called with invalid parameters.

```
Tool: get_weather(city: string, days: int)

LLM calls: get_weather(city=123, days="abc")

Error: Type mismatch!
```

**Solutions:**

```
SOLUTION 1: Define clear schemas
├─ Tell LLM parameter types
├─ Example in system prompt:
│  "get_weather(city: string ['NYC', 'LA', ...], 
│               days: int [1-14])"
└─ Clear constraints help

SOLUTION 2: JSON Schema validation
├─ Force LLM to output valid JSON Schema
├─ Validate before calling tool
├─ Example:
│  {
│    "action": "get_weather",
│    "params": {
│      "city": "NYC",  ← string
│      "days": 5       ← int
│    }
│  }
   
SOLUTION 3: Error recovery
├─ If parameter invalid:
│  Tell LLM: "Invalid parameter: days must be 1-14"
│  Explain what was wrong
│  Let LLM retry
└─ Most LLMs self-correct with hints

SOLUTION 4: Input sanitization
├─ Clean parameters before calling
├─ Example:
│  city = validate_city_name(city)  # Correct typos
│  days = max(1, min(14, days))     # Clamp to range
└─ Handle gracefully
```

---

## Failure 5: Real Tool Failures

**Problem:** Tool actually fails (API down, network error).

```
LLM calls: get_weather("NYC")
Tool fails: ConnectionError (weather API down)

Legacy code:
└─ Crash! ❌

What LLM sees:
└─ Nothing (no error message)
└─ Confusion
```

**Solutions:**

```
SOLUTION 1: Timeout limits
├─ If tool takes >5 seconds: timeout
├─ Code:
│  result = tool.execute_with_timeout(timeout=5)
└─ Prevent hanging

SOLUTION 2: Retry with backoff
├─ First try fails? Retry once
├─ Code:
│  for attempt in range(3):
│      try:
│          result = tool()
│          break
│      except ToolError:
│          if attempt == 2: raise
│          sleep(2 ** attempt)  # Exponential backoff

SOLUTION 3: Fallback options
├─ If weather API down, use backup API
├─ Code:
│  try:
│      result = primary_weather_api()
│  except:
│      result = fallback_api()

SOLUTION 4: Tell LLM what happened
├─ Don't hide errors from LLM
├─ Send clear message:
│  "Observation: Tool failed - API timeout"
├─ LLM can adapt (try different tool, ask user, etc.)
└─ Code:
   try:
       result = tool()
   except ToolError as e:
       result = f"Tool failed: {str(e)}"
   return result
```

---

## Failure 6: Lost in Context

**Problem:** Long conversations, LLM forgets original goal.

```
User: "What's the best laptop for coding?"

[10 tool calls later]

LLM: "Here's the best camera for photography"  ← TOTALLY WRONG

Problem: Lost track in context window
```

**Solutions:**

```
SOLUTION 1: Explicit goal tracking
├─ Define goal at start:
│  goal = "Find best laptop for coding"
├─ Include in every LLM prompt:
│  "Remember: Your goal is {goal}"
└─ Keep LLM focused

SOLUTION 2: Summarize frequently
├─ Every 5 steps, summarize progress
├─ Code:
│  if step % 5 == 0:
│      summary = llm.summarize(messages)
│      messages = [summary]  # Reset to summary
└─ Reduces context bloat

SOLUTION 3: Limit context window messages
├─ Keep only recent N messages
├─ Code:
│  messages = messages[-10:]  # Keep last 10
└─ Don't let history explode

SOLUTION 4: Separate goal from reasoning
├─ Goal: Stored separately from messages
├─ Reasoning: In rolling conversation
├─ Code:
│  goal = "Find best laptop"
│  messages = [LLM responses...]
│  prompt = f"Goal: {goal}. Progress so far: {messages}"
```

---

## Failure 7: Irrelevant Final Answer

**Problem:** LLM gives answer that doesn't address query.

```
Query: "How do I fix a leaky faucet?"

Agent retrieves: Plumbing tools, parts, instructions

Final Answer: "Use a wrench to tighten the handle"

User: "But I asked how to FIX it, not prevent..."
```

**Solutions:**

```
SOLUTION 1: Validate final answer
├─ Before returning: Check it addresses query
├─ Code:
│  if not llm_relevance_check(query, answer):
│      # Ask LLM to improve
│      answer = llm.improve_answer(query, answer)

SOLUTION 2: Ask for self-correction
├─ Prompt LLM: "Does your answer address the original query?"
├─ Force introspection
└─ Often catches irrelevant answers

SOLUTION 3: Require answer quality check
├─ Metric:
│  - Does it answer the actual question?
│  - Is it specific (not generic)?
│  - Does it use retrieved info?
└─ If fails, regenerate

SOLUTION 4: Clarify with user
├─ If unsure if answer is right:
│  "Is this what you're looking for? Yes / No"
├─ If no: Ask for more details
└─ Interactive improvement
```

---

## Best Practices Summary

```
✅ Do:
├─ Set max_steps limit (CRITICAL)
├─ Validate tool names before calling
├─ Define clear tool descriptions
├─ Handle errors gracefully with messages
├─ Track state and goal
├─ Validate parameters
├─ Tell LLM what went wrong (error messages)
├─ Test extensively before production

❌ Don't:
├─ Silently fail (no error message to LLM)
├─ Allow infinite loops
├─ Hide from LLM when tools fail
├─ Overcomplicate tool list
├─ Let context grow unbounded
└─ Deploy agents without monitoring
```

---

## Key Takeaways

✅ **Infinite loops** → Set max_steps limit (5-10)

✅ **Hallucinated tools** → Validate tool names, provide descriptions

✅ **Wrong tools** → Better descriptions, few-shot examples

✅ **Parameter errors** → JSON schema validation, error recovery

✅ **Tool failures** → Timeout, retry, fallback, tell LLM

✅ **Lost context** → Track goal, summarize frequently

✅ **Irrelevant answers** → Validate against query

✅ **Always communicate errors** to LLM for recovery
