# 11. Improving NL-to-SQL

## Why Basic NL-to-SQL Fails

Basic approach: Pass schema + few examples → LLM generates SQL

```
Problems that arise:
├─ Large schema (100+ tables) → doesn't fit in context
├─ Ambiguous questions → wrong SQL generated
├─ Complex queries (multi-step) → LLM struggles
├─ Column naming inconsistencies → wrong columns picked
├─ Date/time handling → timezone bugs
└─ JOIN logic errors → returns wrong relationships
```

---

## Improvement 1: Smart Schema Retrieval

**Problem:** 100+ table schema doesn't fit in context window.

**Solution:** Retrieve only relevant tables.

### Method 1A: Table Retrieval (Keyword)

```python
def retrieve_relevant_tables(question, all_tables_metadata):
    # Extract keywords from question
    keywords = extract_keywords(question)
    # keywords = ["revenue", "customer", "month"]
    
    relevant_tables = []
    for table in all_tables_metadata:
        # Score each table by keyword overlap
        score = 0
        for keyword in keywords:
            if keyword in table.columns:
                score += 1
            if keyword in table.name.lower():
                score += 2
        
        if score > 0:
            relevant_tables.append((table, score))
    
    # Return top-5 tables
    return sorted(relevant_tables, key=lambda x: x[1], reverse=True)[:5]
```

### Method 1B: Column Retrieval (Vector Search)

For very large schemas (1000+ columns), retrieve relevant columns too.

```python
# Embed all table/column descriptions once
table_descriptions = {
    "customers": "Stores customer information: id, name, email, signup_date",
    "orders": "Order transactions: id, customer_id, amount, date",
    "products": "Product catalog: id, name, price, category"
    # ... 100+ more tables
}

# Embed descriptions
embeddings = embed_model.encode([desc for desc in table_descriptions.values()])

# At runtime:
question = "Revenue by customer region?"
q_embedding = embed_model.encode(question)

# Find most similar tables
similarities = cosine_similarity(q_embedding, embeddings)
top_k = np.argsort(similarities)[-5:][::-1]  # Top 5

retrieved_schema = [tables[i] for i in top_k]
```

---

## Improvement 2: Column Specification

Help LLM understand **exactly which columns are relevant**.

```
❌ Bad Schema Presentation:
TABLE: customers
Columns: id, name, email, signup_date, region, status, ...

✅ Good Schema Presentation:
TABLE: customers
├─ id (INT): Unique identifier
├─ name (VARCHAR): Full name
├─ email (VARCHAR): Email address
├─ signup_date (DATE): YYYY-MM-DD
├─ region (VARCHAR): Values: Americas, EMEA, APAC
├─ status (VARCHAR): Values: active, inactive, suspended
└─ [other columns not shown for brevity]

FOR REVENUE QUERY, RELEVANT COLUMNS:
├─ id: To join with orders
└─ region: To group by region
```

**Include in prompt:**

```
RELEVANT COLUMNS FOR THIS QUESTION:
- customers.region (to group by region)
- orders.amount (to calculate revenue)
- orders.customer_id (to join tables)
```

---

## Improvement 3: Few-Shot Examples (Domain-Specific)

Generic examples don't work. Use domain-specific ones.

```
❌ Generic Examples:
"SELECT * FROM table WHERE id = 1"

✅ Domain-Specific Examples (E-commerce):
Example 1: "Top products by revenue?"
SELECT p.name, SUM(o.amount) as revenue
FROM orders o
JOIN products p ON o.product_id = p.id
GROUP BY p.product_id
ORDER BY revenue DESC
LIMIT 10

Example 2: "Customers with zero purchases?"
SELECT c.id, c.name
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
WHERE o.id IS NULL

Example 3: "Monthly revenue trend?"
SELECT MONTH(o.order_date) as month, SUM(o.amount) as revenue
FROM orders o
WHERE YEAR(o.order_date) = 2024
GROUP BY MONTH(o.order_date)
ORDER BY month
```

---

## Improvement 4: Query Validation & Retry

Catch errors before/after execution.

```python
def generate_sql_with_validation(question, schema, examples):
    max_retries = 3
    
    for attempt in range(max_retries):
        # Generate SQL
        sql = llm.generate_sql(
            question=question,
            schema=schema,
            examples=examples,
            previous_errors=[]  # Pass errors from last attempt
        )
        
        # Step 1: Syntax validation
        try:
            # Parse SQL without executing
            parse_result = sql_parser.parse(sql)
            if not is_valid_syntax(parse_result):
                raise SQLError("Invalid syntax")
        except SQLError as e:
            if attempt < max_retries - 1:
                # Retry
                error_feedback = f"Syntax error: {str(e)}"
                continue
            else:
                raise
        
        # Step 2: Schema validation
        try:
            tables = extract_table_names(sql)
            for table in tables:
                if table not in schema.table_names():
                    raise SQLError(f"Unknown table: {table}")
        except SQLError as e:
            if attempt < max_retries - 1:
                continue
            else:
                raise
        
        # Step 3: Execute and handle runtime errors
        try:
            result = database.execute(sql, timeout=5)
            return (sql, result)
        
        except DatabaseError as e:
            if attempt < max_retries - 1:
                # Retry with error feedback
                error_feedback = f"Execution error: {str(e)}"
                continue
            else:
                raise
    
    raise Exception("Failed to generate valid SQL")
```

---

## Improvement 5: Ambiguity Resolution

When question is ambiguous, ask user or make reasonable default.

```python
def resolve_ambiguity(question, schema):
    # Check for common ambiguities
    
    # Ambiguity 1: No time period specified
    if "when" not in question.lower() and "time" not in question.lower():
        # Default: current month
        question += " (default: current month)"
    
    # Ambiguity 2: "Top" without number
    if "top " in question.lower() and not re.search(r'\d+', question):
        # Default: top 10
        question += " (default: top 10)"
    
    # Ambiguity 3: Multiple possible columns
    if "price" in question.lower():
        # Multiple: unit_price, total_price, list_price
        return {
            "question": question,
            "alternatives": [
                "unit price (price per item)",
                "total price (price × quantity)",
                "list price (original price)"
            ],
            "needs_clarification": True
        }
    
    return {"question": question, "needs_clarification": False}
```

---

## Improvement 6: Query Explanation

Before executing, generate natural language explanation.

```
User: "Revenue by region last quarter?"

Generated SQL:
SELECT c.region, SUM(o.amount) as total_revenue
FROM orders o
JOIN customers c ON o.customer_id = c.id
WHERE o.order_date >= '2024-10-01' AND o.order_date <= '2024-12-31'
GROUP BY c.region
ORDER BY total_revenue DESC

EXPLANATION STEP:
LLM generates explanation: "This query:
1. Joins orders with customers table
2. Filters orders from Q4 (Oct-Dec 2024)
3. Sums order amounts
4. Groups by customer region
5. Returns in descending order by revenue"

USER CONFIRMS: "Yes, that's what I want"
└─ Execute SQL

OR USER SAYS: "No, I meant calendar Q4, not Q4 2024"
└─ Regenerate with corrected date range
```

---

## Improvement 7: Post-Processing Results

Format raw SQL results into natural language.

```python
def format_result(sql_result, question):
    """
    Convert database result into natural language answer
    """
    
    # Extract what user asked for
    if "revenue" in question.lower():
        metric_name = "Revenue"
        if "$" not in question:
            metric_name += " (in USD)"
    
    # Format result
    if len(sql_result) == 1 and len(sql_result[0]) == 1:
        # Single number result
        value = sql_result[0][0]
        return f"{metric_name}: ${value:,.2f}"
    
    elif len(sql_result) > 1:
        # Multiple rows (e.g., by region)
        formatted = f"{metric_name} by region:\n"
        for row in sql_result:
            formatted += f"  • {row[0]}: ${row[1]:,.2f}\n"
        return formatted
    
    else:
        return str(sql_result)
```

---

## Improvement 8: Caching Common Queries

Cache results of frequent queries.

```python
class CachedNLtoSQL:
    def __init__(self):
        self.query_cache = {}  # {question_hash: (sql, result)}
    
    def query(self, question):
        # Check cache
        q_hash = hash(normalize_question(question))
        
        if q_hash in self.query_cache:
            sql, result = self.query_cache[q_hash]
            return result  # Return cached result
        
        # Generate SQL
        sql = self.llm.generate_sql(question)
        
        # Execute
        result = self.database.execute(sql)
        
        # Cache
        self.query_cache[q_hash] = (sql, result)
        
        return result
```

---

## Integration: Full Advanced NL-to-SQL Pipeline

```
USER QUESTION: "Revenue in Q4 by region?"

↓ STEP 1: SCHEMA RETRIEVAL
├─ Extract keywords: ["revenue", "Q4", "region"]
├─ Vector search: top-3 relevant tables
└─ Result: orders, customers, (products)

↓ STEP 2: AMBIGUITY RESOLUTION
├─ Check: "Q4" = calendar or fiscal?
├─ User confirms: "2024 calendar Q4"
└─ Updated question: "Revenue in Q4 2024 by region?"

↓ STEP 3: BUILD PROMPT
├─ System: "You are SQL expert"
├─ Schema: Retrieved tables only
├─ Examples: 5 domain-specific examples
├─ Question: "Revenue in Q4 2024 by region?"
└─ Extra: List of relevant columns

↓ STEP 4: GENERATE SQL
SELECT c.region, SUM(o.amount) as revenue
FROM orders o
JOIN customers c ON o.customer_id = c.id
WHERE o.order_date >= '2024-10-01' AND o.order_date <= '2024-12-31'
GROUP BY c.region
ORDER BY revenue DESC

↓ STEP 5: VALIDATE
├─ Syntax: ✓ Valid
├─ Schema: ✓ All tables exist
├─ Columns: ✓ All columns valid
└─ Safety: ✓ No DROP/DELETE

↓ STEP 6: EXECUTE
Result:
├─ Americas: $5.2M
├─ EMEA: $3.1M
└─ APAC: $1.9M

↓ STEP 7: FORMAT
"Revenue in Q4 2024 by region:
 • Americas: $5,200,000
 • EMEA: $3,100,000
 • APAC: $1,900,000
 
 Total: $10.2M"

✅ DONE
```

---

## When to Use Standard vs Advanced NL-to-SQL

| System | Schema Size | Query Complexity | Accuracy Need | Implementation |
|---|---|---|---|---|
| **Standard** | < 20 tables | Simple | 80% | Basic LLM generation |
| **Advanced** | 20-100 tables | Moderate | 90%+ | Retrieval + validation + retry |
| **Enterprise** | 100+ tables | Complex | 95%+ | Full pipeline above |

---

## Key Takeaways

✅ **Schema retrieval** — Use keyword/vector search for large databases

✅ **Column specification** — Tell LLM exactly which columns matter

✅ **Domain examples** — Use examples specific to your business

✅ **Validation & retry** — Catch errors and fix with feedback loop

✅ **Ambiguity resolution** — Ask for clarification or use defaults

✅ **Query explanation** — Generate natural language summary before executing

✅ **Result formatting** — Convert raw results to readable answers

✅ **Caching** — Store results of frequent queries

✅ **Progressive improvement** — Start standard, add advanced techniques as needed

**Next:** Fine-tuning LLMs for better performance → Phase 4
