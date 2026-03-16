# 03. Prompt Engineering

## What is a Prompt?

A prompt is your instruction to the LLM.

```
Bad Prompt:          Good Prompt:
"Summarize this"     "Summarize this document in 3 bullet points,
                      highlighting key risks and opportunities"
```

Prompt engineering is the art of getting better outputs from LLMs without retraining them.

---

## The Prompt Components

```
┌─────────────────────────────────────────────────────┐
│  Full Prompt Structure                              │
├─────────────────────────────────────────────────────┤
│                                                     │
│  1. SYSTEM PROMPT (optional)                       │
│     "You are a helpful assistant..."               │
│                                                     │
│  2. CONTEXT/BACKGROUND                            │
│     "Here's the company annual report..."          │
│                                                     │
│  3. EXAMPLES (few-shot)                            │
│     "Example input: X → Expected output: Y"        │
│                                                     │
│  4. CURRENT TASK                                   │
│     "Now, given: Z, produce: ?"                    │
│                                                     │
│  5. OUTPUT FORMAT INSTRUCTION                      │
│     "Format your answer as JSON: {...}"            │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Technique 1: Zero-Shot Prompting

You ask, without examples.

```
Prompt: "Classify this review as positive or negative: 'This product is amazing!'"

LLM Output: "Positive"
```

**Pros:**
- Fast, simple
- Works for straightforward tasks

**Cons:**
- Can fail on complex/ambiguous tasks
- Less control over output format

---

## Technique 2: Few-Shot Prompting

You give examples, then ask the question.

```
Prompt:
"Classify reviews:

Example 1: 'Love it!' → Positive
Example 2: 'Terrible quality' → Negative
Example 3: 'It's okay I guess' → Neutral

Now classify: 'This product is amazing!' → ?"

LLM Output: "Positive"
```

**Pros:**
- More accurate than zero-shot
- Teaches the model by example

**Cons:**
- Uses more tokens
- Finding good examples takes time

---

## Technique 3: Chain-of-Thought (CoT)

Ask the model to **think step-by-step**.

```
❌ Direct question:
"Is 23 × 45 equal to 1035?"

✅ Chain-of-Thought:
"Let's work through this step by step:
Step 1: 23 × 40 = 920
Step 2: 23 × 5 = 115
Step 3: 920 + 115 = 1035
Is 23 × 45 equal to 1035?"
```

**Why it works:**
- Forces model to reason first
- Catches errors in intermediate steps
- Better for math, logic, complex reasoning

---

## Technique 4: Zero-Shot Chain-of-Thought

CoT, but you don't give examples!

```
Prompt:
"Q: If a rock is dropped from a 100m building, how long until it hits?
A: Let's think step by step.
   - Initial velocity = 0
   - Acceleration = 9.8 m/s²
   - Distance = 100m
   - Using d = 0.5 × a × t²
   - 100 = 0.5 × 9.8 × t²
   - t ≈ 4.5 seconds

Therefore, the rock hits in ~4.5 seconds."
```

**Magic phrase:** "Let's think step by step" → huge accuracy boost with no examples!

---

## Technique 5: ReAct (Reason + Act)

For agent-like tasks. Model thinks, then takes action.

```
Prompt:
"You are a helpful assistant. Use tools available to answer questions.
Available tools: search_internet, calculator, get_weather

Task: What is the capital of France?

Thought: I need to find the capital of France
Action: Use knowledge (no tool needed)
Observation: Paris is the capital of France
Thought: I have the answer
Final Answer: Paris"
```

**Used for:** Agents, tool-calling, self-correction

---

## Technique 6: Self-Consistency

Get multiple answers, pick the most common one.

```
Same prompt, generate K (say 5) responses:

Response 1: "The answer is 42"
Response 2: "The answer is 42"
Response 3: "The answer is 45"
Response 4: "The answer is 42"
Response 5: "The answer is 42"

Most common: 42 (4/5 votes) ✅
```

**When to use:** High-stakes questions (medical, legal), when accuracy matters

**Trade-off:** 5x more expensive, 5x slower

---

## Technique 7: Role/Persona Prompting

Tell the model to adopt a role.

```
❌ Generic:
"Explain quantum computing"

✅ Role-based:
"You are a quantum physicist explaining to a 10-year-old.
Explain quantum computing using only analogies and simple words."
```

**Why it works:**
- Model adjusts tone, complexity, examples
- Different perspective = better explanation

---

## Technique 8: Structured Output Prompting

Tell the model **exactly** how to format output.

```
Prompt:
"Extract entities from: 'John Smith works at Google in NYC'

Output format (JSON):
{
  "person": "...",
  "company": "...",
  "location": "..."
}

Response:"
```

**Why it matters:**
- Easier to parse programmatically
- Reduces hallucination (model constrained by format)

### Even Better: JSON Mode

```python
# With JSON Mode enabled:
response = client.chat.completions.create(
  model="gpt-4",
  messages=[{"role": "user", "content": "Extract entities..."}],
  response_format={ "type": "json_object" }
)
# Output is guaranteed valid JSON ✅
```

---

## Technique 9: Prompt Chaining

Break complex task into sequence of prompts.

```
Task: "Summarize a 10-page legal document"

Chain:
  Prompt 1: Extract key sections
           → Output: [section1, section2, ...]
  
  Prompt 2: Summarize each section
           → Output: [summary1, summary2, ...]
  
  Prompt 3: Combine summaries into final summary
           → Output: final summary
```

**Why it works:**
- Easier reasoning (one thing at a time)
- Better for long/complex tasks
- Error recovery (restart at failed step)

---

## The Prompt Engineering Framework

```
1. DEFINE CLEARLY
   What exactly do you want?
   Be specific, not vague.

2. PROVIDE CONTEXT
   What background does the model need?
   Give relevant facts, not everything.

3. SHOW EXAMPLES (if needed)
   Few-shot > zero-shot for complex tasks
   Pick examples that show edge cases.

4. REQUEST REASONING
   "Let's think step by step"
   Forces intermediate checks.

5. SPECIFY FORMAT
   JSON? Bullet points? CSV?
   Make parsing easy.

6. TEST & ITERATE
   Try it once.
   If output is bad, refine one element.
   Re-test.
```

---

## Real Interview Question: "What's the difference between zero-shot and few-shot?"

**Answer Structure:**
1. **Define:** Zero-shot = no examples, few-shot = examples shown
2. **Mechanism:** Few-shot teaches by example, zero-shot relies on pretraining
3. **Trade-off:** Few-shot = higher accuracy but more tokens; zero-shot = faster/cheaper but less control
4. **Example:** Classifying sentiment — zero-shot might give wrong format, few-shot forces consistency

---

## Common Pitfalls in Prompting

❌ **Vague instructions**
- "Summarize this" (vague)
- Solution: "Summarize in 3 bullet points, max 20 words each"

❌ **Too much context**
- Passing entire company wiki when only 1 page relevant
- Solution: Retrieve relevant section first

❌ **No examples for complex tasks**
- Expecting JSON output without showing format
- Solution: Always provide 1-2 examples for structured output

❌ **Inconsistent formatting requests**
- First asking for JSON, then CSV, confuses model
- Solution: Pick one format and stick to it

❌ **Not leveraging "let's think step by step"**
- Direct question for logic problem (fails)
- Solution: Always add CoT for reasoning tasks

---

## Practical Checklist

- [ ] Is your task **clearly defined**? (not vague)
- [ ] Did you provide **necessary context**? (not too much)
- [ ] For complex tasks, do you have **examples**? (few-shot)
- [ ] For reasoning tasks, did you ask it to **think step by step**?
- [ ] Is the **output format specified**? (JSON, bullet points, etc.)
- [ ] Did you test the prompt on a few inputs?

---

## Key Takeaways

✅ Prompting is the cheapest lever for better outputs (no model changes)

✅ Zero-shot works for simple tasks; few-shot for complex ones

✅ "Let's think step by step" → huge accuracy boost, no examples needed

✅ Specify output format explicitly (JSON, CSV, etc.)

✅ Prompt chaining breaks complex tasks into simple steps

✅ Test and iterate — what works for one task doesn't work for all

**Next:** Use prompting + embeddings to build RAG systems → RAG Phase
