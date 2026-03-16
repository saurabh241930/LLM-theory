# Phase 3: Structured Outputs & NL-to-SQL — Questions & Answers

## Category 1: Function Calling / Tool Use

### Q1: Explain function calling. Why is it important for agents?

**A:**

**Function calling** is when an LLM generates structured requests to call external functions instead of just generating text.

```
Without function calling:
User: "What's the weather in NYC?"
LLM: "I don't have access to real-time data"
❌ Dead end

With function calling:
User: "What's the weather in NYC?"
LLM: { "function": "get_weather", "parameters": {"city": "NYC"} }
System: Calls weather API → "72°F, sunny"
LLM: "The weather in NYC is 72°F and sunny"
✅ Answered!
```

**Why it's important for agents:**
Agents need to **take actions**, not just talk:
- Query databases (SQL)
- Call APIs (weather, payment)
- Execute code
- Trigger workflows
- Update records

Function calling is the bridge between LLM reasoning and real-world action.

---

### Q2: You're building a tool-use system. What are the key design principles for schemas?

**A:**

```
PRINCIPLE 1: Clarity
├─ Description should be clear (not vague)
├─ Example:
│  ❌ "Get data"
│  ✅ "Retrieve weather for a city. Returns temp, humidity, condition"

PRINCIPLE 2: Explicit Parameters
├─ Every parameter should have type + description
├─ Mark required vs optional
├─ Example:
│  {
│    "parameters": {
│      "city": {
│        "type": "string",
│        "description": "City name (e.g., NYC, London)",
│        "required": true
│      },
│      "units": {
│        "type": "string",
│        "enum": ["celsius", "fahrenheit"],
│        "required": false,
│        "default": "fahrenheit"
│      }
│    },
│    "required": ["city"]
│  }

PRINCIPLE 3: Limit Scope
├─ One function = one well-defined task
├─ Don't combine unrelated functionality
├─ Example:
│  ❌ { "function": "do_everything" }
│  ✅ { "function": "query_database" }, { "function": "call_api" }

PRINCIPLE 4: Error Handling
├─ Define what happens when parameters are invalid
├─ Example: City doesn't exist → return error, don't crash

PRINCIPLE 5: Consistent Naming
├─ Function names: snake_case (get_weather)
├─ Parameter names: snake_case
├─ Enum values: consistent case
```

---

### Q3: You notice the LLM keeps calling the wrong function for a task. How do you fix it?

**A:**

```
Problem diagnosis:
1. Check LLM logs — is it choosing right function?
2. If wrong consistently → Schema is unclear

Solutions (in order):

SOLUTION 1: Improve Description (Quick)
├─ Current: "Get information"
├─ Better: "Get weather forecast for a specific city"
├─ Even better: "Get current weather (temp, humidity, condition) for any city.
│              Use for questions about weather, climate, temperature."

SOLUTION 2: Add Examples in System Prompt (Medium)
├─ Prompt: "Example 1: User asks 'Is it raining in Paris?'
│           → Call get_weather(city='Paris')
│
│           Example 2: User asks 'Calculate 2+3'
│           → Call calculator(expression='2+3')"

SOLUTION 3: Reorder Functions (Easy)
├─ Put most relevant functions first in schema list
├─ LLM might pick first matching function
├─ Put get_weather before get_news

SOLUTION 4: Split Ambiguous Functions (Structural)
├─ Current: { "function": "get_info" }
│           (used for weather, news, sports)
├─ Better:  { "function": "get_weather" },
│           { "function": "get_news" },
│           { "function": "get_sports_scores" }

SOLUTION 5: Use Constraints (Advanced)
├─ LLM version with better instruction following
├─ Explicitly tell LLM when to use each function
├─ "Use get_weather ONLY for questions about temperature, rain, etc."
```

**Recommended approach:** Start with Solution 1 (improve descriptions).

---

## Category 2: NL-to-SQL

### Q4: You're building NL-to-SQL for a large database (200 tables). How do you handle schema size?

**A:**

Full schema (200 tables) won't fit in context window.

**Solution: Retrieve only relevant tables.**

```
Step 1: KEYWORD EXTRACTION
├─ Question: "Revenue by region last month?"
├─ Keywords: ["revenue", "region", "month"]
└─ Extract terms LLM will use

Step 2: TABLE RETRIEVAL
├─ Method A (Keyword): Find tables with matching column names
│  └─ tables with "revenue" column: sales, transactions
│  └─ tables with "region" column: customers, offices
│  └─ Result: sales, transactions, customers (retrieved: 3 of 200)
│
├─ Method B (Vector Search): (More sophisticated)
│  └─ Embed all table descriptions once (offline)
│  └─ At runtime: Embed question, find most similar tables
│  └─ Result: same, but finds less obvious matches

Step 3: BUILD PROMPT WITH SUBSET
├─ You have 3 tables (vs 200)
├─ Include:
│  - Relevant table descriptions
│  - Example queries using these tables
│  - Relationships between tables
└─ LLM has full context!

Step 4: EXECUTE
└─ LLM generates SQL using only retrieved schema
```

**Code sketch:**

```python
def retrieve_relevant_schema(question, all_tables):
    keywords = extract_keywords(question)  # ["revenue", "region"]
    
    relevant_tables = []
    for table in all_tables:
        score = 0
        for col in table.columns:
            for keyword in keywords:
                if keyword in col.lower():
                    score += 1
        
        if score > 0:
            relevant_tables.append((table, score))
    
    # Return top-10 tables
    return sorted(relevant_tables, key=lambda x: x[1])[:10]
```

**For very large databases (1000+ tables/columns):**
Use vector search instead of keyword matching.

---

### Q5: The LLM generates SQL with the wrong column names. How do you fix it?

**A:**

```
Symptom: LLM generates SQL with wrong column names
├─ Query asks about "revenue", but table has "total_amount"
└─ Result: "Unknown column 'revenue'"

Root causes:
├─ Column naming not clear in schema
├─ No examples showing correct names
├─ LLM doesn't know table structure

SOLUTION 1: Add Column Specifications (Quick)
├─ Current schema:
│  "TABLE: orders
│   Columns: id, customer_id, amount, date"
│
├─ Better schema:
│  "TABLE: orders
│   - id (INT): Order ID
│   - customer_id (INT): Foreign key to customers
│   - amount (DECIMAL): Order total (renamed from revenue)  ← Clarify!
│   - order_date (DATE, not 'date'): When order was placed"

SOLUTION 2: Show Examples Using Exact Column Names
├─ Example 1:
│  Q: "Total sales?"
│  A: SELECT SUM(amount) FROM orders  ← Shows 'amount', not 'revenue'
│
├─ Example 2:
│  Q: "Orders in March?"
│  A: SELECT * FROM orders WHERE MONTH(order_date) = 3

SOLUTION 3: Add Retry Loop with Error Feedback
├─ SQL executes → "Unknown column 'revenue'"
├─ Feed back to LLM: "Column 'revenue' not found. Did you mean 'amount'?"
├─ LLM regenerates with correct name
└─ Retry mechanism fixes most issues

SOLUTION 4: Column Aliases (If you control docs)
├─ In DB, column name: total_amount
├─ In schema doc: "total_amount (alias: revenue)"
├─ Helps LLM recognize both names
```

**Recommended:** Combine Solutions 1 + 3 (clear schema + retry loop).

---

### Q6: User asks an ambiguous question like "Show me the top customers". How do you handle it?

**A:**

**Ambiguity sources:**
```
"Top customers" could mean:
├─ Top by spending (highest revenue)
├─ Top by order count (most frequent)
├─ Top by recency (most recent purchase)
```

**Solutions:**

**Solution 1: Default Assumption (Immediate, risky)**
```python
# Assume "top" = highest spending
if "top customers" in question:
    question = "Top 10 customers by total spending?"
```
**Pro:** Fast
**Con:** Might be wrong

**Solution 2: Ask User for Clarification (Safe, slower)**
```
System: "Did you mean top customers by:
         a) Total spending (highest revenue)
         b) Order frequency (most orders)
         c) Recency (most recent activity)?"

User: "a) Total spending"

LLM: Generates SQL with correct interpretation
```
**Pro:** Always correct
**Con:** Extra round trip

**Solution 3: Return All Interpretations (Comprehensive)**
```
System returns 3 queries:
├─ "Top 10 by spending: [Alice ($50K), Bob ($40K), ...]"
├─ "Top 10 by frequency: [Carol (25 orders), Dave (18 orders), ...]"
├─ "Top 10 by recency: [Eve (yesterday), Frank (2 days ago), ...]"

User picks which one they want
```

**Solution 4: Use Context (Smart)**
```
If user previously asked "highest revenue questions":
  └─ Default to "top by spending"

If user previously asked "most active customers":
  └─ Default to "by recency"
```

**Recommendation for production:**
Use **Solution 2 (ask for clarification)** when ambiguity detected, otherwise use **Solution 4 (context-based default)**.

---

## Category 3: Improving NL-to-SQL

### Q7: Your NL-to-SQL system has 70% accuracy. What's the fastest way to improve it?

**A:**

**Bottleneck identification (key first!):**

```
Measure where failures happen:
├─ 30% of failures: Wrong table picked
├─ 20% of failures: Wrong column names
├─ 30% of failures: Wrong JOIN logic
├─ 20% of failures: Wrong WHERE conditions

Main bottleneck: Table selection (30%) + JOIN logic (30%) = 60% of errors
```

**Fast improvements (by ROI):**

**Improvement 1: Add Schema Retrieval (1-2 hours, +15%)**
```
If currently: Full schema in prompt
Change to: Retrieve only relevant tables

Impact: LLM sees less noise, better focus
Expected improvement: 70% → 85%
```

**Improvement 2: Better Examples (2-3 hours, +10%)**
```
If currently: Generic SQL examples
Change to: Domain-specific examples with JOINs

Example to add:
"Q: Customers from NYC with 3+ orders?
 A: SELECT c.name
    FROM customers c
    JOIN orders o ON c.id = o.customer_id
    WHERE c.city = 'NYC'
    GROUP BY c.id
    HAVING COUNT(o.id) >= 3"

Expected improvement: 85% → 95%
```

**Improvement 3: Retry Loop (1 hour, +5%)**
```
If currently: Generate SQL once
Change to: Try → execute → if error, retry with feedback

Catches 50% of initial errors
Expected improvement: 95% → 98%
```

**Full approach (optimal):**
1. Implement Improvement 1 → 70% to 85%
2. Implement Improvement 2 → 85% to 95%
3. Implement Improvement 3 → 95% to 98%
4. For remaining 2%, do manual inspection/fix

**Total time: ~4-5 hours**
**Total improvement: 70% → 98% accuracy**

---

### Q8: You need to support complex multi-step queries like "Top 3 regions by revenue, excluding Q1". Design the approach.

**A:**

**Multi-step approach:**

```
DECOMPOSITION:
User: "Top 3 regions by revenue, excluding Q1"

Break down:
├─ Step 1: Calculate revenue by region
├─ Step 2: Filter out Q1 data
├─ Step 3: Get top 3 regions

Or maybe:
├─ Step 1: Calculate revenue by region (non-Q1 only)
├─ Step 2: Sort descending
├─ Step 3: Limit to top 3

OPTION A: One Complex Query
LLM generates a single SQL:
  SELECT region, SUM(amount) as revenue
  FROM orders o
  JOIN customers c ON o.customer_id = c.id
  WHERE MONTH(o.order_date) NOT IN (1)
  GROUP BY region
  ORDER BY revenue DESC
  LIMIT 3

OPTION B: Step-by-Step Queries (More Robust)
1. LLM generates: "Get revenue by region (all months)"
   SELECT region, MONTH(date) as month, SUM(amount) as revenue ...

2. System filters: Remove month = 1 rows

3. System aggregates: Group by region, sum across months

4. System sorts: Top 3

Issue: More complex to orchestrate, but sometimes works better

OPTION C: Hierarchical Decomposition
LLM first understands structure:
  └─ "This is a GROUP-BY with WHERE filtering + sorting + LIMIT"
  
Then generates SQL:
  └─ Correct SQL with all clauses
```

**Recommended: OPTION A (One Query)**

```
Why:
├─ Simpler orchestration
├─ Fewer round-trips
├─ LLMs are decent at complex SQL now
└─ Easy to validate

How:
├─ Good examples
├─ Explicitly mention: "WHERE, GROUP BY, ORDER BY, LIMIT all available"
├─ Schema clarity
└─ Retry on error
```

**How to improve accuracy:**

```python
# Pseudo-code
def handle_complex_query(question):
    # Step 1: Detect complexity
    if "top " in question and "exclude" in question:
        complexity = "high"
    
    # Step 2: Add extra guidance
    guidance = """
    For queries with multiple conditions:
    1. Use WHERE for filtering (e.g., exclude Q1)
    2. Use GROUP BY for aggregation (e.g., by region)
    3. Use ORDER BY for sorting
    4. Use LIMIT for top-k results
    
    Example:
    "Top 3 products by sales, excluding clearance?"
    SELECT product, SUM(sales) as total_sales
    FROM orders
    WHERE category != 'clearance'
    GROUP BY product
    ORDER BY total_sales DESC
    LIMIT 3
    """
    
    # Step 3: Generate with guidanceSQL = llm.generate(question, schema, guidance)
    
    # Step 4: Validate & retry
    return validate_and_retry(sql)
```

---

## Category 4: All Together

### Q9: Design a production NL-to-SQL system for a fintech company with strict accuracy requirements.

**A:**

```
REQUIREMENTS:
├─ Can't have wrong answers (financial impact)
├─ Schema: 50 tables, constantly growing
├─ Query types: Complex (multi-step reasoning)
├─ Latency: < 2 seconds acceptable
└─ Accuracy target: 100% (any wrong answer = failure)

ARCHITECTURE:

LAYER 1: SCHEMA MANAGEMENT
├─ Maintain table descriptions with examples
├─ Tag tables: [revenue, customer, trading, risk, ...]
├─ For each table: explicit column descriptions
└─ Update descriptions when schema changes

LAYER 2: SCHEMA RETRIEVAL
├─ Extract keywords from question
├─ Vector search: Find relevant tables (top-5)
├─ Only pass relevant schema to LLM
└─ Saves context window, improves accuracy

LAYER 3: FEW-SHOT EXAMPLES
├─ Maintain ~50 example queries (domain-specific)
├─ Examples for: joins, aggregations, filtering, time handling
├─ Update examples based on failure cases
└─ Include: revenue calculations, risk metrics, trading volumes

LAYER 4: QUERY GENERATION
├─ LLM: GPT-4 (best accuracy)
├─ Prompt:
│  - System: "You are a SQL expert for fintech"
│  - Schema: Retrieved tables only
│  - Examples: 5-10 most relevant examples
│  - Question: User's question
│  - Constraint: "Return ONLY SQL, no explanation"
└─ Generate SQL

LAYER 5: VALIDATION
├─ Syntax check: Parse SQL
├─ Schema check: All tables/columns exist
├─ Safety check: No DROP/DELETE/INSERT
├─ Logic check: JOINs make sense
└─ Return: Pass or fail

LAYER 6: EXECUTION & RETRY
├─ Execute SQL with 5-second timeout
├─ On error:
│  - Capture error message
│  - Feed back to LLM: "SQL failed: {error}"
│  - Retry (max 3 times)
└─ On success: Return raw result

LAYER 7: RESULT FORMATTING
├─ Convert raw SQL result to natural language
├─ Add currency symbols ($) for financial metrics
├─ Format numbers: 1000000 → 1_000,000.00$
├─ Add units: "Revenue (USD)"
└─ Include query used (for audit trail)

LAYER 8: HUMAN REVIEW (For High-Risk)
├─ If query involves:
│  - Regulatory/compliance data
│  - Unusual aggregations
│  - Large amounts
├─ Flag for human review before returning
└─ Approval required

MONITORING & IMPROVEMENT:
├─ Log every query: {question, sql, result, latency}
├─ Track failures:
│  - SQL syntax errors
│  - Incorrect results (user reports)
│  - Timeouts
├─ Weekly analysis:
│  - Top failure patterns
│  - Improve examples based on failures
│  - Update schema documentation
└─ Test set:
   - 100+ financial questions
   - RAGAS-style evaluation
   - Compare to ground truth

TIMELINE:
├─ Week 1: Core system + schema retrieval
├─ Week 2: Validation + retry + formatting
├─ Week 3: Testing + refinement
├─ Week 4: Deploy + monitoring
└─ Ongoing: Improve based on failures

SUCCESS METRICS:
├─ Accuracy: > 98% (measured on test set)
├─ Latency: < 2s (p99)
├─ User satisfaction: > 95% thumbs-up
└─ Failures: < 1% per month
```

---

## Key Insights

✅ **Function calling** = structured outputs; schemas are contracts between LLM and system

✅ **Clear schemas** with explicit types/descriptions prevent wrong function calls

✅ **NL-to-SQL at scale** requires schema retrieval (large DBs don't fit in context)

✅ **Multi-table queries** need good examples; JOINs are hard for LLMs

✅ **Validation + retry** fixes 50% of errors automatically

✅ **Ambiguity detection** → ask user or use context-based defaults

✅ **Production systems** need monitoring, human review for high-risk, and continuous improvement

✅ **Start simple, iterate:** Get 70% → 85% → 95% → 99%
