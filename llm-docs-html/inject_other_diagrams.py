import re
import os

HTML_DIR = '/home/sp241930/Documents/LLM-theory/llm-docs-html'

DIAGRAMS = {
    "api_design.html": {
        "Q27": """flowchart TD
  Client --> Router["API Router"]
  Router -- "/v1/users" --> Handler1["V1 Handler (Legacy)"]
  Router -- "/v2/users" --> Handler2["V2 Handler (Modern)"]""",
        "Q28": """flowchart LR
  JWT["JWT: Stateless, self-contained"]
  OAuth["OAuth2: Scoped authorization delegation"]
  APIKeys["API Keys: Server-to-server auth"]
  JWT --- APIKeys""",
        "Q29": """flowchart LR
  Root["/users"] --> UserID["/users/{id}"]
  UserID --> Orders["/users/{id}/orders"]
  Orders --> OrderID["/users/{id}/orders/{order_id}"]""",
        "Q30": """flowchart LR
  Client -- "GET /items?limit=50&offset=100" --> API
  API -- "Select ... Offset 100 Limit 50" --> DB
  DB --> API
  API -- "Items + Metadata (Next/Prev links)" --> Client""",
        "Q31": """flowchart TD
  Error["Exception Thrown"] --> Middleware["Global Error Handler"]
  Middleware --> Log["Log to DataDog/Sentry"]
  Middleware --> Format["Format RFC 7807 Standard Error"]
  Format --> Client["4xx / 5xx Standard JSON Schema"]""",
        "Q32": """flowchart TD
  Client -- "Accept: application/xml" --> API
  API -- "Parses Header" --> Logic["Business Logic"]
  Logic --> Formatter{"Content Negotiator"}
  Formatter -- "application/xml" --> XML["XML Payload"]
  Formatter -- "application/json" --> JSON["JSON Payload"]""",
        "Q33": """flowchart TD
  Web["Internet"] --> WAF["WAF (AWS WAF / Cloudflare)"]
  WAF --> RL["Rate Limiter (Redis)"]
  RL --> Auth["AuthZ & AuthN Gateway"]
  Auth --> API["Internal Microservice API"]"""
    },
    "api_security_auth.html": {
        "Q34": """flowchart LR
  API -- "Payload + Links array" --> Client
  Client -- "Follows link 'rel': 'next'" --> NextAPI["Next Resource Endpoint"]""",
        "Q35": """flowchart TD
  Client -- "POST /jobs (huge operation)" --> API
  API -- "202 Accepted + Location: /jobs/123" --> Client
  API -- "Enqueue Task" --> Worker["Background Worker"]
  Client -- "GET /jobs/123 (Polling)" --> API
  Worker -- "Updates Status" --> DB""",
        "Q36": """flowchart LR
  Client -- "POST { user { id, name, posts { title } } }" --> GraphQL["GraphQL Server"]
  GraphQL -- "Resolver: User" --> DB1[("User DB")]
  GraphQL -- "Resolver: Posts" --> DB2[("Posts DB")]
  DB1 --> GraphQL
  DB2 --> GraphQL
  GraphQL -- "Single JSON Response" --> Client""",
        "Q37": """flowchart TD
  Client -- "1. Request Upload URL" --> API
  API -- "2. Pre-signed S3 URL" --> Client
  Client -- "3. PUT multipart/form-data" --> S3[("S3 Bucket")]
  S3 -- "4. Event Trigger" --> Lambda["Processor"]""",
        "Q38": """flowchart LR
  Code["Annotations/Code"] --> SwaggerGen["Swagger/OpenAPI Generator"]
  SwaggerGen --> JSON["openapi.json"]
  JSON --> UI["Swagger UI / Redoc"]
  UI --> Dev["Developer (Client)"]""",
        "Q39": """flowchart LR
  Client -- "Request" --> API_GW["API Gateway (Generates Trace-ID)"]
  API_GW -- "X-B3-TraceId: 123" --> ServA["Service A"]
  ServA -- "X-B3-TraceId: 123" --> ServB["Service B"]
  ServA -. "Send Span" .-> Jaeger["Jaeger/Zipkin"]
  ServB -. "Send Span" .-> Jaeger""",
        "Q40": """flowchart TD
  User["User"] --> AuthN{"Authentication"}
  AuthN -- "Verifies Identity (Who are you?)" --> IDP["IdP (Okta / Auth0)"]
  IDP --> AuthZ{"Authorization"}
  AuthZ -- "Checks Permissions (What can you do?)" --> Roles["RBAC/ABAC Policy"]""",
        "Q41": """flowchart LR
  Dev["Developer"] --> Unit["Unit Tests (Mocked DB)"]
  Unit --> Integration["Integration Tests (Testcontainers)"]
  Integration --> E2E["E2E Tests (Cypress/Postman)"]
  E2E --> CD["Deployment"]"""
    },
    "frontend_architecture.html": {
        "Q42": """flowchart TD
  StateChange["State / Props Change"] --> VDOM_New["New Virtual DOM"]
  VDOM_Old["Old Virtual DOM"] --> Diffing{"Reconciliation (Diffing)"}
  VDOM_New --> Diffing
  Diffing -- "Computes Minimal Mutation" --> DOM["Real DOM"]""",
        "Q43": """flowchart LR
  subgraph useState
    Primitive["Primitive Value"] --> SetState["setState()"]
  end
  subgraph useReducer
    Complex["Complex State Object"] --> Dispatch["dispatch({type: ACT})"]
    Dispatch --> Red["Reducer Function"]
  end""",
        "Q44": """flowchart TD
  Parent["Parent Re-renders"] --> Child{"Child Component Wrapped in React.memo?"}
  Child -- "Yes" --> Props{"Props Changed? (uses useCallback)"}
  Child -- "No" --> Rerender["Child Re-renders"]
  Props -- "Yes" --> Rerender
  Props -- "No" --> Skip["Skip Render"]""",
        "Q45": """flowchart TD
  Context["React Context (Low frequency)"] --> Redux["Redux (High structure / Boilerplate)"]
  Redux --> Zustand["Zustand (Minimalist / No providers)"]
  Zustand --> Jotai["Jotai (Atomic / Recoil-like)"]""",
        "Q46": """flowchart TD
  Comp["Function Component"] --> TopLevel["Hooks must be at Top Level"]
  Comp --> NoLoop["Cannot be inside loops, conditions, or nested functions"]
  TopLevel --> Ensure{"Ensures Call Order Independence"}
  NoLoop --> Ensure""",
        "Q47": """flowchart LR
  HTML["HTML"] --> DOM["DOM Tree"]
  CSS["CSS"] --> CSSOM["CSSOM Tree"]
  DOM --> RenderTree["Render Tree"]
  CSSOM --> RenderTree
  RenderTree --> Layout["Layout"]
  Layout --> Paint["Paint"]""",
        "Q48": """flowchart TD
  Browser["Browser Main Thread (UI)"] -- ".postMessage()" --> WebWorker["Web Worker (Heavy compute)"]
  Browser -- "Registers" --> ServiceWorker["Service Worker (Network Proxy / Offline)"]
  ServiceWorker <--> Cache[("Browser Cache API")]""",
        "Q49": """flowchart LR
  Flex["Flexbox: 1-Dimensional"] --> Row["Rows OR Columns"]
  Grid["CSS Grid: 2-Dimensional"] --> GridCells["Rows AND Columns simultaneously"]""",
        "Q50": """flowchart LR
  ClickStream["Click Event Stream"] --> Map["map()"]
  Map --> Debounce["debounceTime(300ms)"]
  Debounce --> SwitchMap["switchMap(API Call)"]
  SwitchMap --> Result["Subscribe (Update UI)"]""",
        "Q51": """flowchart TD
  Webpack["Bundler (Webpack/Vite)"] --> Main["main.[hash].js (Core App)"]
  Webpack --> Vendor["vendor.[hash].js (React, Lodash)"]
  Webpack --> Async["chunk-auth.[hash].js (Loaded dynamically)"]""",
        "Q52": """flowchart TD
  Issue["Unnecessary Re-renders"] --> DevTools["React Profiler Extension"]
  DevTools --> Identify["Identify component rendering too often"]
  Identify --> Fix["Apply React.memo / useCallback / useMemo"]"""
    },
    "frontend_performance.html": {
        "Q53": """flowchart TD
  App["Main App"] --> EB["Error Boundary Class Component"]
  EB -- "try-catch equivalent for rendering" --> ComponentTree["Child Component Tree"]
  ComponentTree -- "Throws JS Error" --> EB
  EB -- "Catches Error" --> Fallback["Render Fallback UI avoiding white screen"]""",
        "Q54": """flowchart LR
  Login["Login Form"] --> Context["Auth Provider"]
  Context -- "API Call" --> Backend["Auth Backend"]
  Backend -- "Returns JWT" --> Storage["HttpOnly Cookie"]
  Storage --> Router["Protected Routes"]""",
        "Q55": """flowchart LR
  subgraph Controlled Component
    ReactState["React State (useState)"] <--> Input["Input value={state} onChange={update}"]
  end
  subgraph Uncontrolled Component
    DOMNode["Raw DOM Node"] --> Ref["React useRef()"]
  end""",
        "Q56": """flowchart TD
  AppShell["App Shell / Container"] --> Fed1["Module Federation: Header (React)"]
  AppShell --> Fed2["Module Federation: Product List (Vue)"]
  AppShell --> Fed3["Module Federation: Cart (Angular)"]""",
        "Q57": """flowchart TD
  ReactRoot["Root DOM Node (id=root)"] -- "Attaches Single Listener" --> EventQueue["React SyntheticEvent"]
  Button1["Button A Click"] --> ReactRoot
  Button2["Button B Click"] --> ReactRoot
  EventQueue --> Handler["Dispatches to specific onClick"]""",
        "Q58": """flowchart LR
  Server["Node/Next.js Server"] -- "Renders fully formed HTML" --> Browser["Browser"]
  Browser -- "Displays FCP instantly" --> Paint["User Sees Page"]
  Browser -- "Downloads JS bundles" --> Hydrate["React Hydration"]
  Hydrate -- "Interactive" --> App["Responsive SPA"]""",
        "Q59": """flowchart TD
  StaticHTML["Static HTML from Server"] --> Attach["React attaches event listeners"]
  Attach --> Match{"HTML match initial client render?"}
  Match -- "No" --> Error["Hydration Mismatch Error"]
  Match -- "Yes" --> Interactive["Page is interactive"]""",
        "Q60": """flowchart LR
  DOM["Semantic HTML DOM"] --> AccessibilityTree["a11y Tree"]
  AccessibilityTree --> ScreenReader["Screen Reader / Assistive Tech"]
  Styles["CSS / Visuals"] -. "Ignored by" .-> ScreenReader""",
        "Q61": """flowchart LR
  App["React App (i18next)"] --> Key["Text Node: {t('welcome_msg')}"]
  Key --> Lookup{"Current Lang Context"}
  Lookup -- "en" --> EN[("en.json")]
  Lookup -- "es" --> ES[("es.json")]""",
        "Q62": """flowchart TD
  UX["User Experience Metrics"] --> LCP["LCP (Largest Contentful Paint) - Loading speed"]
  UX --> FID["INP/FID (Interaction to Next Paint) - Interactivity"]
  UX --> CLS["CLS (Cumulative Layout Shift) - Visual stability"]"""
    },
    "backend_core.html": {
        "Q63": """flowchart TD
  Query["SELECT * FROM users WHERE id=123"] --> BTree["B-Tree Root Node"]
  BTree --> Branch["Branch Node (100-200)"]
  Branch --> Leaf["Leaf Node (123)"]
  Leaf -- "Stores Pointer/Row Data" --> Disk[("Disk Block")]""",
        "Q64": """flowchart LR
  subgraph INNER JOIN
    A1((A)) --- B1((B))
  end
  subgraph LEFT JOIN
    A2((A)) --> B2((B))
  end
  subgraph FULL OUTER JOIN
    A3((( A + B ))) 
  end""",
        "Q65": """flowchart TD
  Normalize["Normalization (1NF -> 3NF)"] --> Reduce["Reduces Data Redundancy"]
  Reduce --> complex["Creates complex multi-join queries"]
  Denormalize["Denormalization (adding redundant columns)"] --> ReadPerf["Increases Read Performance"]
  ReadPerf --> WriteRisk["Risk of data inconsistency on writes"]""",
        "Q66": """flowchart TD
  Update["UPDATE row SET val=2"] --> MVCC["MVCC Mechanism"]
  MVCC -- "Does not delete old row" --> OldRow["Old Row (xmin: 100) invisible to Tx > 105"]
  MVCC -- "Creates new copy" --> NewRow["New Row (xmin: 105) visible to Tx > 105"]
  Vacuum["Autovacuum"] -- "Cleans up dead tuples eventually" --> OldRow""",
        "Q67": """flowchart TD
  Start["V1: App uses name column"] --> Step1["Add first_name, last_name cols"]
  Step1 --> Step2["Deploy V2 App: Writes to both old and new."] 
  Step2 --> Step3["Backfill old data into new columns"]
  Step3 --> Step4["Deploy V3 App: Reads/Writes ONLY to new columns"]
  Step4 --> Step5["Drop old name column"]"""
    },
    "backend_scaling.html": {
        "Q68": """flowchart TD
  Network["Network Partition (P) occurs"] --> Choice{"System must choose"}
  Choice -- "Consistency (CP)" --> CP["Reject writes/reads (e.g. Zookeeper)"]
  Choice -- "Availability (AP)" --> AP["Accept writes/reads risk staleness (e.g. DynamoDB)"]""",
        "Q69": """flowchart TD
  App1["App Thread 1"] --> Pool["Connection Pooler (PgBouncer)"]
  App2["App Thread 2"] --> Pool
  AppN["App Thread N"] --> Pool
  Pool -- "Multiplexes 10k connections onto 100 DB connections" --> DB[("PostgreSQL")]""",
        "Q70": """flowchart LR
  Sensor["IoT Sensor Gen"] --> TSDB["Time-Series DB (Influx/Timescale)"]
  TSDB -- "1. Append-only fast writes" --> Chunk["Time-partitioned Chunks"]
  Chunk -- "2. Columnar Compression" --> Storage[("Compressed Storage")]
  TSDB -- "3. Continuous Aggregates" --> Dash["Grafana Dashboard"]""",
        "Q71": """flowchart TD
  N1["N+1 Query Issue"] --> Q1["SELECT * FROM users (1 query)"]
  Q1 --> Loop["For loops through N users"]
  Loop --> QN["SELECT * FROM posts WHERE user_id=? (N queries)"]
  Fix["Fix: Eager Loading"] --> FixedQ["SELECT * FROM posts WHERE user_id IN (1,2...N) (1 query)"]""",
        "Q72": """flowchart TD
  App["Application"] --> Router["Sharding Router / Proxy"]
  Router -- "Hash(user_id) % 3 == 0" --> ShardA[("DB Shard 1")]
  Router -- "Hash(user_id) % 3 == 1" --> ShardB[("DB Shard 2")]
  Router -- "Hash(user_id) % 3 == 2" --> ShardC[("DB Shard 3")]"""
    },
    "database_internals.html": {
        "Q73": """flowchart LR
  Redis[("Redis")] --> STR["Strings (Cache, Counters)"]
  Redis --> HASH["Hashes (Object storage)"]
  Redis --> LIST["Lists (Message queues, Recent items)"]
  Redis --> SET["Sets (Unique tags, Intersections)"]
  Redis --> ZSET["Sorted Sets (Leaderboards)"]""",
        "Q74": """flowchart TD
  Monitor["APM / Slow Query Log"] --> Identify["Find Query taking > 1s"]
  Identify --> Explain["Run EXPLAIN ANALYZE"]
  Explain --> SeqScan{"Is it a Seq Scan on massive table?"}
  SeqScan -- "Yes" --> Fix["Add B-Tree or Hash Index"]
  SeqScan -- "No" --> Fix2["Vacuum analyze / Reindex"]""",
        "Q75": """flowchart TD
  Tx["Transaction Begins"] --> A["Atomicity (All or Nothing)"]
  Tx --> C["Consistency (Valid state only)"]
  Tx --> I["Isolation (Concurrent Tx don't interfere)"]
  Tx --> D["Durability (Survives crashes once committed)"]""",
        "Q76": """flowchart LR
  subgraph Pessimistic Locking
    T1["Tx1: SELECT FOR UPDATE"] --> Lock["Row Locked in DB"]
    T2["Tx2: SELECT FOR UPDATE"] -. "Blocks waiting for Tx1" .-> Lock
  end
  subgraph Optimistic Locking
    T3["Tx3: Read v=1"] --> Update1["UPDATE ... WHERE v=1 SET v=2"]
    T4["Tx4: Read v=1"] --> Update2["UPDATE ... WHERE v=1 SET v=2 (FAILS)"]
  end""",
        "Q77": """flowchart TD
  Text["Raw Text: 'The quick brown fox'"] --> TSVector["to_tsvector() -> 'brown':3 'fox':4 'quick':2"]
  TSVector --> GIN["GIN Index (Inverted Index)"]
  Query["User Search: 'jumping foxes'"] --> TSQuery["to_tsquery('fox')"]
  TSQuery --> Match{"@@ matches GIN Index"} --> Result["Returns Row"]"""
    },
    "database_scaling.html": {
        "Q78": """flowchart LR
  Sender["Order Service"] -- "Event: OrderCreated" --> Broker[("Message Broker (Kafka)")]
  Broker --> Consumer1["Inventory Service"]
  Broker --> Consumer2["Shipping Service"]
  Broker --> Consumer3["Email Service"]""",
        "Q79": """flowchart TD
  API["API Server"] --> Redis[("Redis")]
  Redis -- "INCR user:123:minute" --> Count{"Count > Limit?"}
  Count -- "No" --> Proceed["Proceed to DB"]
  Count -- "Yes" --> Block["Return 429 Too Many Requests"]""",
        "Q80": """flowchart TD
  App["App"] -- "Commit Tx" --> RAM["DB Buffer Pool"]
  RAM -- "1. Append to WAL" --> DiskWAL[("WAL File on Disk")]
  DiskWAL -- "2. Acknowledge Commit" --> App
  RAM -- "3. Async Checkpoint" --> DiskData[("Main Data Files")]""",
        "Q81": """flowchart LR
  Delete["User clicks Delete"] --> DB[("Database")]
  DB -- "Does NOT run DELETE" --> Update["UPDATE users SET deleted_at = NOW()"]
  AppQuery["SELECT * FROM users"] -- "Must include" --> Clause["WHERE deleted_at IS NULL"]""",
        "Q82": """flowchart TD
  Primary[("Primary DB")] -- "Daily" --> FullBackup[("S3 Full Snapshot")]
  Primary -- "Continuous (Streaming)" --> WALArchive[("S3 WAL Archive")]
  Crash{"Disaster Strikes"} --> Recover["Restore Snapshot + Replay WALs"]"""
    }
}

def inject_diagrams():
    for filename, questions in DIAGRAMS.items():
        filepath = os.path.join(HTML_DIR, filename)
        if not os.path.exists(filepath):
            print(f"File {filename} not found.")
            continue
            
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        for qid, mermaid_code in questions.items():
            dom_id = qid.lower()
            pattern = re.compile(rf'(<div class="qa-container" id="{dom_id}">.*?</ul>)', re.DOTALL)
            
            def repl(match):
                original = match.group(1)
                if 'class="mermaid"' in original:
                    return original
                injection = f'\n                <div class="mermaid" style="margin-top: 1em; margin-bottom: 2em;">\n{mermaid_code}\n                </div>\n'
                return original + injection
                
            new_content = pattern.sub(repl, content)
            
            # If standard match fails, try before the innermost </div> end of the answer
            if new_content == content:
                 alt_pattern = re.compile(rf'(<div class="qa-container" id="{dom_id}">.*?)(?=</div>\s*</div>)', re.DOTALL)
                 def repl2(match):
                     original = match.group(1)
                     if 'class="mermaid"' in original:
                         return original
                     injection = f'\n                <div class="mermaid" style="margin-top: 1em; margin-bottom: 2em;">\n{mermaid_code}\n                </div>\n'
                     return original + injection
                 new_content = alt_pattern.sub(repl2, content)

            if new_content == content:
                print(f"Failed to inject {qid} in {filename}")
            else:
                print(f"Successfully injected {qid} in {filename}")
            content = new_content
            
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

if __name__ == "__main__":
    inject_diagrams()
