# 09. Function Calling / Tool Use

## What is Function Calling?

Function calling is how LLMs **call external tools** to answer questions.

Instead of generating text, the LLM generates a **function call**:

```
Input: "What's the weather in NYC?"

Without function calling:
└─ LLM: "I don't know, I'm not connected to real-time data"

With function calling:
├─ LLM: { "function": "get_weather", "parameters": {"city": "NYC"} }
├─ System: Calls actual weather API
├─ Returns: "Temperature: 72°F, Sunny"
└─ LLM: "The weather in NYC is 72°F and sunny"
```

---

## Why Function Calling Matters

You need function calling when:

```
LLM needs to:
├─ Query a database (NL-to-SQL)
├─ Call external APIs (weather, price lookup)
├─ Perform calculations (not hallucinate)
├─ Access real-time data
├─ Trigger actions (send email, update record)
└─ Multiple steps (agent behavior)
```

---

## Core Concept: Schema

The LLM needs to know **what functions exist** and **what parameters they take**.

You define this as a **schema**:

```json
{
  "name": "get_weather",
  "description": "Get current weather for a city",
  "parameters": {
    "type": "object",
    "properties": {
      "city": {
        "type": "string",
        "description": "City name (e.g., 'NYC', 'London')"
      },
      "units": {
        "type": "string",
        "enum": ["celsius", "fahrenheit"],
        "description": "Temperature units"
      }
    },
    "required": ["city"]
  }
}
```

---

## How Function Calling Works

```
┌──────────────────────────────────────────────────┐
│  Function Calling Loop                           │
├──────────────────────────────────────────────────┤
│                                                  │
│  1. USER: "What's the weather in NYC?"          │
│                                                  │
│  2. DEFINE SCHEMA                               │
│     └─ [{ name: "get_weather",                  │
│          parameters: {city, units} }]           │
│                                                  │
│  3. LLM PROCESSES                               │
│     Input: User query + schema                  │
│     Output: { "function": "get_weather",        │
│               "parameters": {"city": "NYC"} }   │
│                                                  │
│  4. CALL FUNCTION                               │
│     └─ Weather API("NYC") → "72°F, Sunny"       │
│                                                  │
│  5. FEED BACK TO LLM                            │
│     "Function result: 72°F, Sunny"              │
│                                                  │
│  6. LLM GENERATES FINAL ANSWER                  │
│     "The weather in NYC is 72°F and sunny"      │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## Implementation Example (OpenAI)

```python
import openai

# Step 1: Define tool schema
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get weather for a city",
            "parameters": {
                "type": "object",
                "properties": {
                    "city": {"type": "string"},
                    "units": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"]
                    }
                },
                "required": ["city"]
            }
        }
    }
]

# Step 2: User query
messages = [
    {"role": "user", "content": "What's the weather in NYC?"}
]

# Step 3: Call LLM with tools
response = openai.ChatCompletion.create(
    model="gpt-4",
    messages=messages,
    tools=tools,
    tool_choice="auto"  # Let LLM decide if it needs tools
)

# Step 4: Check if LLM wants to call a function
if response.choices[0].message.tool_calls:
    tool_call = response.choices[0].message.tool_calls[0]
    
    # Extract function name and parameters
    function_name = tool_call.function.name
    function_args = json.loads(tool_call.function.arguments)
    # function_args = {"city": "NYC", "units": "fahrenheit"}
    
    # Step 5: Call the actual function
    if function_name == "get_weather":
        result = get_weather(city=function_args["city"],
                            units=function_args.get("units", "fahrenheit"))
        # result = "72°F, Sunny"
    
    # Step 6: Feed result back to LLM
    messages.append({
        "role": "assistant",
        "content": response.choices[0].message.content,
        "tool_calls": tool_call
    })
    messages.append({
        "role": "tool",
        "tool_call_id": tool_call.id,
        "content": str(result)
    })
    
    # Step 7: Get final answer
    final_response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=messages,
        tools=tools
    )
    
    print(final_response.choices[0].message.content)
    # Output: "The weather in NYC is 72°F and sunny!"
```

---

## Common Pitfalls

❌ **Vague function descriptions**
```
Bad: "Get data"
Good: "Get current weather for a city. Returns temperature, 
       humidity, and weather condition."
```

❌ **Missing required parameters**
```
Bad:{"type": "string"}
Good: {"type": "string", "description": "City name"}
      with "required": ["city"]
```

❌ **Not handling edge cases**
```
Bad: User asks "What's the weather?" → missing city
Good: Ask user for clarification or use default
```

❌ **Infinite loops**
```
Bad: function_A calls function_B which calls function_A
Good: Define clear stopping conditions
```

---

## Best Practices

✅ **Clear, specific descriptions** — help LLM understand what function does

✅ **Required vs optional parameters** — make distinctions clear

✅ **Return structured results** — JSON, not prose

✅ **Limit number of tools** — too many confuses LLM (cap at 10-20)

✅ **Validate parameters before calling** — catch errors early

✅ **Handle failures gracefully** — what if API is down?

---

## Real-World Example: Customer Support Agent

```
User: "I want to return my order #12345"

LLM sees available tools:
├─ query_order(order_id)
├─ initiate_return(order_id, reason)
├─ check_return_policy(item_type)
└─ send_email(recipient, subject, body)

LLM reasoning:
1. Need to understand the order
   └─ Call query_order(order_id="12345")
   └─ Result: {status: "delivered", item: "laptop", price: $1200}

2. Check if return is allowed
   └─ Call check_return_policy(item_type="laptop")
   └─ Result: {allowed: true, window: "30 days", condition: "mint"}

3. Initiate return
   └─ Call initiate_return(order_id="12345", reason="customer request")
   └─ Result: {return_id: "RET-999", label: "shipping label", address: "return warehouse"}

4. Confirm to customer
   └─ Call send_email(recipient="customer@email.com", 
                      subject="Return initiated",
                      body="Your return RET-999 is approved...")
   └─ Result: {success: true}

Final answer to user:
"Your return has been approved! Return ID: RET-999. 
 A shipping label has been sent to your email.
 Please ship the laptop within 30 days for a $1200 refund."
```

---

## Key Takeaways

✅ **Function calling** = LLM generates tool calls instead of just text

✅ **Schema** defines function name, description, and parameters

✅ **Never show schema details to user** — these are system-only

✅ **Describe precisely** what each function does

✅ **Mark required parameters** clearly

✅ **Handle failures** — API might be down, user might provide wrong args

✅ **Loop until done** — LLM might need multiple function calls to complete task

✅ **Validation** — check parameters before calling external API/function

**Next:** Use function calling for database queries → NL-to-SQL
