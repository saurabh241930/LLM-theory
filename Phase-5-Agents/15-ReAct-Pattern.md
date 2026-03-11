# 15. ReAct (Reason + Act) Pattern

## What is ReAct?

**ReAct** = **Reason + Act** loop. How agents solve problems step-by-step.

Instead of just generating text, the agent:
1. **Reasons** about the problem
2. **Acts** by calling tools
3. **Observes** the result
4. Repeats until done

---

## The ReAct Loop

```
┌──────────────────────────────────────────────────┐
│  ReAct Loop (Reason + Act)                       │
├──────────────────────────────────────────────────┤
│                                                  │
│  TASK: "What's the weather in NYC tomorrow?"    │
│                                                  │
│  REASON (LLM thinks):                           │
│  "I need to get weather data. I'll call the     │
│   weather API for NYC."                         │
│                                                  │
│  ACT (LLM calls tool):                          │
│  { "action": "get_weather",                     │
│    "parameters": {"city": "NYC", "days": 1} }  │
│                                                  │
│  OBSERVE (Tool executes):                       │
│  "Tomorrow: High 72°F, Low 60°F, Sunny"         │
│                                                  │
│  REASON (LLM thinks again):                     │
│  "I have the weather. User asked for tomorrow,  │
│   and I have it. I can answer now."             │
│                                                  │
│  FINAL ANSWER:                                  │
│  "Tomorrow in NYC will be sunny with a high of  │
│   72°F and low of 60°F."                        │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## Key Components

### 1. Thought (Reasoning)

LLM explains what it's thinking.

```
Thought: "The user wants to know if a product is in stock.
         I need to search the inventory database.
         Then I'll check the stock level."
```

### 2. Action (Tool Call)

LLM decides which tool to use and what parameters.

```
Action: search_inventory
Action Input: {"product": "iPhone 15", "store": "NYC"}
```

### 3. Observation (Tool Result)

Tool executes and returns result.

```
Observation: "iPhone 15 found in NYC store.
             Stock: 5 units available.
             Price: $999."
```

### 4. Final Answer

When enough information gathered, LLM summarizes.

```
Final Answer: "Yes, the iPhone 15 is in stock at the NYC store.
              We have 5 units available at $999 each."
```

---

## ReAct vs Simple Function Calling

```
SIMPLE FUNCTION CALLING:
├─ User question → LLM
├─ LLM decides tool to call
├─ Call tool once
├─ Return result

Problem: One tool call might not be enough
         Multi-step problems fail

REACT:
├─ User question → LLM
├─ LLM reasons about problem
├─ LLM calls tool 1
├─ Observe result
├─ LLM reasons again
├─ LLM calls tool 2
├─ ...repeat until done
├─ LLM generates final answer

Advantage: Handles multi-step, can recover from errors
```

---

## Example: Real ReAct Agent

```
Task: "I want to buy a specific laptop. 
       Is it cheaper on Amazon or BestBuy?
       If cheaper, add to cart."

STEP 1: REASONING
Thought: "I need to find the laptop price on both sites,
         then compare and add to the cheaper one's cart."

STEP 2: FIRST ACTION
Action: search_amazon
Action Input: {"query": "Dell XPS 13"}

Observation: "Dell XPS 13, $999 on Amazon"

STEP 3: SECOND ACTION
Action: search_bestbuy
Action Input: {"query": "Dell XPS 13"}

Observation: "Dell XPS 13, $899 on BestBuy"

STEP 4: REASONING
Thought: "BestBuy is cheaper ($899 < $999).
         Now I need to add it to BestBuy cart."

STEP 5: THIRD ACTION
Action: add_to_cart
Action Input: {"store": "bestbuy", "product_id": "XPS13", "quantity": 1}

Observation: "Item added to cart. Checkout URL: bestbuy.com/cart"

STEP 6: FINAL ANSWER
Final Answer: "Found it! The Dell XPS 13 is cheaper on BestBuy ($899 vs $999).
              I've added it to your BestBuy cart."
```

---

## ReAct Loop Implementation

```python
class ReactAgent:
    def __init__(self, llm, tools):
        self.llm = llm
        self.tools = {tool.name: tool for tool in tools}
        self.max_steps = 10
    
    def run(self, user_query):
        steps = 0
        messages = [{"role": "user", "content": user_query}]
        
        while steps < self.max_steps:
            # STEP 1: LLM thinks
            response = self.llm.complete(
                messages=messages,
                prompt_template=REACT_PROMPT_TEMPLATE,
                tools_list=list(self.tools.keys())
            )
            
            # Check if LLM came to final answer
            if "Final Answer:" in response:
                return response.split("Final Answer:")[-1]
            
            # STEP 2: Extract action
            action = parse_action(response)  # Extract tool name
            action_input = parse_action_input(response)  # Extract params
            
            # STEP 3: Execute tool
            if action not in self.tools:
                observation = f"Tool '{action}' not found"
            else:
                observation = self.tools[action].execute(action_input)
            
            # STEP 4: Add to conversation
            messages.append({"role": "assistant", "content": response})
            messages.append({
                "role": "user",
                "content": f"Observation: {observation}"
            })
            
            steps += 1
        
        return "Max steps reached without final answer"
```

---

## Prompt Template for ReAct

```
You are an AI assistant that solves problems step-by-step.

Available tools:
{tools_list}

Use this format:

Thought: [What do you need to do?]
Action: [Tool name]
Action Input: [Parameters as JSON]
Observation: [Will be provided]
... (repeat as needed)

When you have enough info, end with:
Final Answer: [Your answer]

Begin!

User: {user_query}
```

---

## Best Practices

✅ **Be explicit about thoughts** — helps LLM reason clearly

✅ **Limit steps** — prevent infinite loops (max_steps=10)

✅ **Parse actions carefully** — extract tool name exactly

✅ **Provide clear observations** — Tool results should be formatted

✅ **Add error recovery** — If tool fails, try different approach

✅ **Trace execution** — Log each step for debugging

---

## Common Pitfalls

❌ **Tool not actually needed**
```
Thought: "I need to call calculator to get 2+3"
Reality: Could just do it in reasoning

Fix: Teach LLM to compute simple math without tools
```

❌ **Infinite loop of wrong tools**
```
Task: Get weather
Step 1: Calls search_news (wrong tool!)
Step 2: Calls search_web (still wrong!)
Step 3: Calls calculate (wrong!)
... Loop forever

Fix: Better tool descriptions, limit steps
```

❌ **Tool results not in expected format**
```
LLM expects: {"price": 100}
Tool returns: "Price is $100"

Fix: Standardize tool outputs to JSON
```

---

## Key Takeaways

✅ **ReAct** = Reason → Act → Observe → Repeat

✅ **Better than blind tool calling** for multi-step problems

✅ **Explicit reasoning** helps LLM solve complex tasks

✅ **Set max steps** to prevent infinite loops

✅ **Clear tool descriptions** help LLM pick right tool

**Next:** Frameworks to build agents → LangGraph
