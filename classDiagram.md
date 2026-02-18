
---

# 📄 3️⃣ classDiagram.md (Mermaid)

```md
# Class Diagram – FinShield Analytics

```mermaid
classDiagram

class User {
  +userId
  +name
  +email
  +password
  +role
  +login()
  +logout()
}

class Transaction {
  +transactionId
  +amount
  +status
  +riskScore
  +validate()
}

class FraudService {
  +analyzeTransaction()
}

class RiskStrategy {
  <<interface>>
  +calculateRisk()
}

class RuleBasedStrategy {
  +calculateRisk()
}

class AIBasedStrategy {
  +calculateRisk()
}

class Alert {
  +alertId
  +status
  +assignedTo
  +assign()
  +close()
}

class AlertService {
  +createAlert()
  +updateStatus()
}

class Logger {
  <<Singleton>>
  +getInstance()
  +log()
}

User "1" --> "many" Alert
Transaction "1" --> "1" Alert

FraudService --> RiskStrategy
RiskStrategy <|-- RuleBasedStrategy
RiskStrategy <|-- AIBasedStrategy

AlertService --> Alert
