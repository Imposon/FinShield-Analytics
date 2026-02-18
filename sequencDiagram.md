
---

# 📄 2️⃣ sequenceDiagram.md (Mermaid)

```md
# Sequence Diagram – Fraud Detection Flow

```mermaid
sequenceDiagram

    participant User
    participant Frontend
    participant TransactionController
    participant TransactionService
    participant FraudService
    participant Database
    participant AlertService

    User->>Frontend: Submit Transaction
    Frontend->>TransactionController: POST /transaction
    TransactionController->>TransactionService: validate & process
    TransactionService->>FraudService: analyze(transaction)

    FraudService->>FraudService: RuleBasedStrategy
    FraudService->>FraudService: AIStrategy

    FraudService-->>TransactionService: riskScore
    TransactionService->>Database: Save Transaction

    alt Risk > Threshold
        TransactionService->>AlertService: createAlert()
        AlertService->>Database: Save Alert
    end

    TransactionService-->>TransactionController: Response
    TransactionController-->>Frontend: Return Result
