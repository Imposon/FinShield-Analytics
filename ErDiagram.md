
This clearly shows:
✔ Inheritance  
✔ Interface  
✔ Singleton  
✔ Relationships  

---

# 📄 4️⃣ ErDiagram.md (Mermaid)

```md
# ER Diagram – FinShield Analytics

```mermaid
erDiagram

USERS {
    int user_id PK
    string name
    string email
    string password
    string role
    datetime created_at
}

TRANSACTIONS {
    int transaction_id PK
    float amount
    string status
    float risk_score
    datetime created_at
}

ALERTS {
    int alert_id PK
    int transaction_id FK
    int assigned_to FK
    string status
    datetime created_at
}

AUDIT_LOGS {
    int log_id PK
    int user_id FK
    string action
    datetime timestamp
}

USERS ||--o{ ALERTS : assigned_to
TRANSACTIONS ||--|| ALERTS : generates
USERS ||--o{ AUDIT_LOGS : creates
