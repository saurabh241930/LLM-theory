import re
import os

HTML_DIR = '/home/sp241930/Documents/LLM-theory/llm-docs-html'

DIAGRAMS = {
    "system_design_patterns.html": {
        "Q1": """flowchart TD
  Client --> Gateway["API Gateway"]
  Gateway --> Auth["Auth Service"]
  Gateway --> Account["Account Service"]
  Gateway --> Tx["Transaction Service"]
  Account --> DB1[("Account DB")]
  Tx --> DB2[("Tx DB")]
  Tx -- "Event: Created" --> Kafka[("Kafka / Event Bus")]
  Kafka --> Notif["Notification Service"]""",
        "Q2": """flowchart TD
  MobileClient["Mobile App"] --> BFF_Mobile["Mobile BFF"]
  WebClient["Web App"] --> BFF_Web["Web BFF"]
  BFF_Mobile --> ServiceA["Service A"]
  BFF_Web --> ServiceA
  BFF_Web --> ServiceB["Service B"]""",
        "Q3": """flowchart LR
  Command["Write Request"] --> CmdService["Command Service"]
  CmdService --> EventStore[("Event Store (Append Only)")]
  EventStore -- "Publishes Event" --> MessageBus["Message Bus"]
  MessageBus --> QueryService["Query Service"]
  QueryService --> ReadDB[("Read-Optimized DB")]
  Query["Read Request"] --> QueryService""",
        "Q4": """sequenceDiagram
  participant Order
  participant Payment
  participant Inventory
  Order->>Payment: Reserve Funds
  Payment-->>Order: OK
  Order->>Inventory: Reserve Stock
  Inventory-->>Order: Failed
  Order->>Payment: Rollback (Compensate)""",
        "Q5": """flowchart TD
  Client --> ServiceA["Service A"]
  ServiceA -- "Call Service B" --> CB{"Circuit Breaker"}
  CB -- "Closed (Healthy)" --> ServiceB["Service B"]
  CB -. "Open (Failing)" .-x ServiceB
  CB -- "Open" --> Fallback["Return Fallback Data"]""",
        "Q6": """flowchart TD
  Monolith["Legacy Monolith"]
  Monolith --> Strangler["Strangler Fig Proxy"]
  Strangler -- "Old Routes" --> Monolith
  Strangler -- "/new-api" --> Microservice["New Microservice"]""",
        "Q7": """flowchart TD
  Req["Incoming Request"] --> Gateway["API Gateway"]
  Gateway --> Redis[("Redis (Token Bucket)")]
  Redis -- "Tokens Available" --> Forward["Forward to Backend"]
  Redis -- "No Tokens" --> Reject["429 Too Many Requests"]""",
        "Q8": """flowchart TD
  Service["Service (Tx)"] --> DB[("Primary DB")]
  DB -- "Writes to Outbox Table" --> DB
  Relay["Message Relay / CDC"] -- "Reads Outbox" --> DB
  Relay --> Kafka[("Kafka Broker")]""",
        "Q9": """flowchart TD
  Producer["Any Service"] --> Queue["Notification Queue"]
  Queue --> Worker["Worker Pool"]
  Worker --> Pref["User Preferences DB"]
  Worker -- "If SMS" --> Twilio["Twilio API"]
  Worker -- "If Email" --> SendGrid["SendGrid API"]""",
        "Q10": """flowchart LR
  Orchestrator["Saga Orchestrator"]
  Orchestrator --> S1["Service 1: Book Hotel"]
  Orchestrator --> S2["Service 2: Book Flight"]
  S2 -- "Fails" --> Orchestrator
  Orchestrator --> S1_Cancel["Service 1: Cancel Hotel"]""",
        "Q11": """flowchart TD
  User["User /long-url"] --> API["URL Service"]
  API --> KGS["Key Generation Service (KGS)"]
  KGS --> DB[("URL Mapping DB")]
  User2["User /xyz123"] --> Cache[("Redis Cache")]
  Cache -- "Miss" --> DB""",
        "Q12": """flowchart TD
  App["Application Node"]
  App --> Pool1["ThreadPool 1 (Service A)"]
  App --> Pool2["ThreadPool 2 (Service B)"]
  Pool1 -- "Exhausted" --> Fail["Fails Fast (Service B is safe)"]""",
        "Q13": """flowchart LR
  ServiceA["Service A"] --> Registry["Service Registry (Consul)"]
  Registry -- "Returns IP" --> ServiceA
  ServiceA --> ServiceB["Service B"]"""
    },
    "system_design_scaling.html": {
        "Q14": """flowchart TD
  Client -- "1. Request Upload URL" --> API
  API -- "2. Returns Pre-signed URL" --> Client
  Client -- "3. Direct Upload" --> S3[("S3 Bucket")]
  S3 -- "4. S3 Event Trigger" --> SQS[("SQS Queue")]
  SQS --> Worker["Processing Worker"]""",
        "Q15": """flowchart TD
  Req["Expected Traffic"] --> Little["Little's Law: N = CPU * T"]
  Little --> Node["Calc Required Nodes"]
  Node --> Test["Load Test at Peak x2"]
  Test --> ASG["Configure Auto-Scaling Group"]""",
        "Q16": """flowchart LR
  ClientA["Client A (US)"] --> Replica1[("Replica US")]
  ClientB["Client B (EU)"] --> Replica2[("Replica EU")]
  Replica1 -- "Async Sync" --> Replica2
  Replica2 -- "Async Sync" --> Replica1""",
        "Q17": """flowchart TD
  Client["Game Client"] --> API["Score API"]
  API -- "ZADD score" --> Redis[("Redis Sorted Set")]
  API -- "ZRANGE 0 10" --> Redis
  Redis -- "Top 10 List" --> API""",
        "Q18": """flowchart TD
  Client -- "POST /charge Header: Idem-Key=123" --> API
  API --> Check{"Key in Redis?"}
  Check -- "Yes" --> Return["Return Cached 200 OK"]
  Check -- "No" --> Process["Process Payment"]
  Process --> Cache["Store Result in Redis"]""",
        "Q19": """flowchart TD
  subgraph Multi DB - Physical Isolation
    DB_A[("Tenant A DB")]
    DB_B[("Tenant B DB")]
  end
  subgraph Single DB - Logical Isolation
    Table["Table: Data with tenant_id"]
  end""",
        "Q20": """flowchart TD
  App["Application"] --> Cache[("Redis")]
  Cache -- "Miss (Lock acquired)" --> DB[("Primary DB")]
  DB --> Populate["Populate Cache"]
  Cache -- "Hit" --> App""",
        "Q21": """flowchart LR
  App["Internal System"] --> Queue[("Webhook Queue")]
  Queue --> Worker["Worker Node"]
  Worker -- "HMAC Post" --> Customer["Customer Endpoint"]
  Customer -- "500 Error" --> Retry["Exp Backoff + Retry"]""",
        "Q22": """flowchart TD
  Service["Microservice"] --> Vault["HashiCorp Vault"]
  Vault -- "Dynamic Creds (TTL=1hr)" --> Service
  Service --> DB[("Database")]""",
        "Q23": """flowchart LR
  subgraph Kubernetes Pod
    Main["Main App Container"]
    Sidecar["Envoy / Fluentd Sidecar"]
    Main <--> Sidecar
  end
  Sidecar <--> External["External World / Logs"]""",
        "Q24": """flowchart TD
  App["App Server"] --> Postgres[("Postgres Primary")]
  Postgres -- "CDC (Debezium)" --> Kafka[("Kafka")]
  Kafka --> ES[("Elasticsearch")]
  App -- "Search Queries" --> ES""",
        "Q25": """flowchart LR
  subgraph Horizontal
    S1["Server 1"]
    LB["Load Balancer"] --> S1
    LB --> S2["Server 2"]
    LB --> S3["Server 3"]
  end""",
        "Q26": """flowchart LR
  Service["Any Service"] -- "Log Event" --> Kafka[("Kafka (Immutable)")]
  Kafka --> S3[("S3 WORM Storage")]
  Kafka --> ES[("Search Index (Dashboards)")]"""
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
                injection = f'\n                <div class="mermaid" style="margin-top: 1em; margin-bottom: 1em;">\n{mermaid_code}\n                </div>\n'
                return original + injection
                
            new_content = pattern.sub(repl, content)
            if new_content == content:
                print(f"Failed to inject {qid} in {filename}")
            else:
                print(f"Successfully injected {qid} in {filename}")
            content = new_content
            
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

if __name__ == "__main__":
    inject_diagrams()
