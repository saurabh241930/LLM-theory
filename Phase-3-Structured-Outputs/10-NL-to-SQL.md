# 10. NL-to-SQL (Natural Language to SQL)

## What is NL-to-SQL?

**NL-to-SQL** = User asks a question in English, LLM converts it to SQL query, then executes it.

```
User: "How many customers signed up last month?"

NL-to-SQL Pipeline:
1. LLM converts to SQL:
   SELECT COUNT(*) FROM customers 
   WHERE signup_date >= '2024-02-01'
   AND signup_date < '2024-03-01'

2. Execute query
3. Return result: "42 customers signed up in February"
```

---

## NL-to-SQL Full Pipeline

```
┌──────────────────────────────────┐
│  User Question                   │
│ "Revenue in Q4 by region?"       │
└────────────┬──────────────────────┘
             │
┌────────────▼──────────────────────┐
│  Schema Retrieval (Optional)       │
│  Query: "revenue", "region"        │
│  Retrieved: Table.revenue, Table.region
├─────────────────────────────────────┤
│  (full schema too large; use filter)│
└────────────┬──────────────────────┘
             │
┌────────────▼──────────────────────┐
│  Build Prompt                      │
│  System: "You are SQL expert"      │
│  Schema: Relevant tables/columns   │
│  Examples: Few-shot SQL examples   │
│  Question: User's question         │
└────────────┬──────────────────────┘
             │
┌────────────▼──────────────────────┐
│  LLM Generates SQL                 │
│  SELECT region, SUM(revenue)       │
│  FROM sales                         │
│  WHERE quarter = 'Q4'              │
│  GROUP BY region                   │
└────────────┬──────────────────────┘
             │
┌────────────▼──────────────────────┐
│  Validate SQL (Optional)           │
│  Check syntax, table names         │
│  Check for dangerous operations    │
└────────────┬──────────────────────┘
             │
┌────────────▼──────────────────────┐
│  Execute Query                     │
│  Run against database              │
│  Handle errors/retry               │
└────────────┬──────────────────────┘
             │
┌────────────▼──────────────────────┐
│  Format Result                     │
│ "Region: Americas: $2.1M, EMEA:... │
└──────────────────────────────────┘
```

---

## Step 1: Schema Definition

The LLM needs to know **what tables and columns exist**.

```sql
-- Your database schema
CREATE TABLE customers (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    signup_date DATE,
    region VARCHAR(50)
);

CREATE TABLE orders (
    id INT PRIMARY KEY,
    customer_id INT,
    amount DECIMAL(10, 2),
    order_date DATE,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);
```

**Pass to LLM as context:**

```
TABLE: customers
- id (INT): Unique customer identifier
- name (VARCHAR): Customer full name
- email (VARCHAR): Customer email address
- signup_date (DATE): Date customer joined (YYYY-MM-DD)
- region (VARCHAR): Geographic region (Americas, EMEA, APAC)

TABLE: orders
- id (INT): Unique order identifier
- customer_id (INT): Reference to customers.id
- amount (DECIMAL): Order amount in USD
- order_date (DATE): Date order was placed (YYYY-MM-DD)

RELATIONSHIPS:
- orders.customer_id → customers.id (one customer has many orders)
```

❌ **Problem:** If database is large (100+ tables), full schema is too long for context window.

**Solution:** Retrieve relevant schema only.

---

## Step 2: Schema Retrieval (For Large Databases)

If you have 100+ tables, retrieve only relevant ones.

### Method 1: Keyword Matching

```
User question: "Revenue by region"
Keywords: ["revenue", "region"]

Relevant tables:
├─ sales (has: revenue column) ✓
├─ transactions (has: amount, which is revenue) ✓
├─ regions (has: region_id, region_name) ✓
└─ customers (has: region column) ✓

Irrelevant tables:
├─ logs (not about revenue)
├─ config (not about revenue)
```

### Method 2: Vector Search (More Sophisticated)

Embed table descriptions, search for similar to query.

```
User query embedding:
"Revenue by region" → [0.7, -0.2, 0.5, ...]

Table descriptions embedding:
"sales (amount, date, region)" → [0.68, -0.19, 0.51, ...] ✓ similar!
"logs (timestamp, level, msg)" → [0.1, 0.8, 0.2, ...] ✗ different

Retrieved tables: [sales]
```

---

## Step 3: Few-Shot Examples

Provide SQL examples for the LLM to learn from.

```
Example 1:
Question: "How many orders in March?"
SQL: SELECT COUNT(*) FROM orders 
     WHERE MONTH(order_date) = 3

Example 2:
Question: "Top 5 customers by spending?"
SQL: SELECT customer_id, SUM(amount) as total_spent
     FROM orders
     GROUP BY customer_id
     ORDER BY total_spent DESC
     LIMIT 5

Example 3:
Question: "Revenue by region in 2024?"
SQL: SELECT c.region, SUM(o.amount) as revenue
     FROM orders o
     JOIN customers c ON o.customer_id = c.id
     WHERE YEAR(o.order_date) = 2024
     GROUP BY c.region
```

**Why examples help:**
- Show query patterns
- Demonstrate JOIN syntax
- Show GROUP BY usage
- Teach date filtering

---

## Step 4: LLM Generates SQL

```
PROMPT:
"You are a SQL expert. Generate SQL to answer the question.
 Return ONLY the SQL query, no explanation.

SCHEMA:
[relevant schema]

EXAMPLES:
[few-shot examples]

QUESTION: How many customers signed up in February 2024?

ANSWER:"
```

**LLM Output:**
```sql
SELECT COUNT(*) as new_customers
FROM customers
WHERE signup_date >= '2024-02-01'
AND signup_date < '2024-03-01'
```

---

## Step 5: Handling Errors

Queries might be wrong. Need **retry loop**.

```python
for attempt in range(max_retries):
    # Generate SQL
    sql = llm.generate_sql(question, schema, examples)
    
    try:
        # Execute
        result = database.execute(sql)
        return result  # Success!
    
    except SQLError as e:
        # Error! Feed back to LLM
        error_msg = str(e)  # e.g., "Unknown column 'revenu'"
        
        # Ask LLM to fix it
        sql = llm.fix_sql(
            original_question=question,
            broken_sql=sql,
            error=error_msg,
            schema=schema
        )
        # Try again with fixed SQL
    
    except Exception as e:
        raise

# If all retries failed
raise Exception(f"Failed to generate valid SQL after {max_retries} attempts")
```

**Common errors:**
```
❌ "Unknown column 'revenu'" 
   ← Typo: should be 'revenue'
   Fix: Retry with corrected schema

❌ "Column 'customer_id' not found in table 'orders'"
   ← Wrong schema understanding
   Fix: Provide clearer schema examples

❌ "Syntax error near 'GROUPE'"
   ← Wrong SQL syntax (typo: GROUP vs GROUPE)
   Fix: LLM usually fixes with retry

❌ "Ambiguous column name 'email'"
   ← Multiple tables have email
   Fix: Use table alias orders.customer_id vs customers.customer_id
```

---

## Step 6: Query Validation (Optional)

Before executing, validate SQL:

```python
def validate_sql(sql, schema):
    # Check 1: No DROP, DELETE, INSERT (safety)
    dangerous_keywords = ['DROP', 'DELETE', 'INSERT', 'UPDATE']
    for keyword in dangerous_keywords:
        if keyword in sql.upper():
            raise Exception(f"Dangerous operation: {keyword}")
    
    # Check 2: Table names exist in schema
    tables = extract_table_names(sql)
    for table in tables:
        if table not in schema.table_names():
            raise Exception(f"Unknown table: {table}")
    
    # Check 3: Column names exist
    columns = extract_column_names(sql)
    for col in columns:
        if not column_exists(col, schema):
            raise Exception(f"Unknown column: {col}")
    
    # Check 4: Join conditions make sense
    # ... more validations ...
    
    return True  # SQL is valid
```

---

## Real-World Example: E-commerce NL-to-SQL

```
User: "Which products have no sales this month?"

SCHEMA RETRIEVAL:
├─ Relevant tables: products, sales
└─ Schema:
   products(id, name, category, price)
   sales(id, product_id, quantity, date)

FEW-SHOT EXAMPLES:
  Q: "Top selling products in January?"
  A: SELECT p.name, SUM(s.quantity) as sold
     FROM sales s
     JOIN products p ON s.product_id = p.id
     WHERE MONTH(s.date) = 1
     GROUP BY p.name
     ORDER BY sold DESC

LLM GENERATES SQL:
SELECT p.name
FROM products p
LEFT JOIN sales s ON p.id = s.product_id
  AND MONTH(s.date) = MONTH(CURDATE())
WHERE s.product_id IS NULL

EXECUTION:
├─ Query runs successfully
└─ Result: ["Widget A", "Gadget B", "Tool C"]

NATURAL LANGUAGE ANSWER:
"Three products had no sales this month:
 1. Widget A
 2. Gadget B
 3. Tool C"
```

---

## Advanced Techniques

### Technique 1: Schema Linking

Map keywords in question → relevant tables/columns.

```
Question: "Highest paid employees?"
Keywords: "paid" → salary column
         "employees" → employees table

Automatically retrieve: employees(id, name, salary)
```

### Technique 2: Query Rewriting

LLM sometimes generates overly complex SQL. Simplify.

```
LLM generates (complex):
SELECT * FROM (
  SELECT product_id, SUM(quantity) as total
  FROM sales
  WHERE MONTH(date) = 3
  GROUP BY product_id
) subquery
WHERE total > 10

Simplified:
SELECT product_id, SUM(quantity) as total
FROM sales
WHERE MONTH(date) = 3
GROUP BY product_id
HAVING total > 10  ← Better!
```

### Technique 3: Ambiguity Resolution

When user question is ambiguous, ask for clarification.

```
User: "High revenue customers"
Ambiguous: High = > $1000? > $10000? > what?

LLM should ask:
"Do you mean customers with:
 a) Total spending > $10,000?
 b) Average order > $1,000?
 c) Single order > $5,000?

Please clarify..."
```

---

## Common Pitfalls

❌ **No schema retrieval for large databases**
- Result: LLM doesn't see all relevant tables
- Fix: Implement keyword/vector search for large schemas

❌ **Few-shot examples use old column names**
- Result: LLM copies wrong column names
- Fix: Keep examples updated with schema

❌ **No error retry loop**
- Result: One SQL error = total failure
- Fix: Implement retry with error feedback

❌ **Allowing dangerous operations**
- Result: User could DROP tables, DELETE all data
- Fix: Validate SQL, block DROP/DELETE/INSERT

❌ **Ambiguous questions not handled**
- Result: Wrong interpretation, wrong answer
- Fix: Ask user for clarification when ambiguous

---

## Key Takeaways

✅ **NL-to-SQL:** User query → SQL generation → execution → formatted result

✅ **Schema matters:** Provide clear table/column descriptions

✅ **Few-shot examples:** Teach query patterns

✅ **Error handling:** Retry loop with error feedback to LLM

✅ **Validation:** Check for dangerous operations, bad syntax

✅ **Schema retrieval:** For large DBs (100+ tables), retrieve relevant schema only

✅ **Ambiguity handling:** Ask for clarification on vague questions

**Next:** Advanced NL-to-SQL techniques → Improving NL-to-SQL
