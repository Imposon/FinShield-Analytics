# Use Case Diagram – FinShield Analytics

```mermaid
flowchart LR

Admin[Admin]
Analyst[Risk Analyst]
Auditor[Auditor]
AI[AI Service]

subgraph System [FinShield Analytics System]
    UC1(Login)
    UC2(Manage Users)
    UC3(View Transactions)
    UC4(Process Transaction)
    UC5(Generate Alert)
    UC6(Investigate Alert)
    UC7(Update Alert Status)
    UC8(View Reports)
    UC9(Analyze Transaction)
end

Admin --> UC1
Admin --> UC2
Admin --> UC8

Analyst --> UC1
Analyst --> UC3
Analyst --> UC6
Analyst --> UC7

Auditor --> UC8

UC4 --> UC9
AI --> UC9
UC9 --> UC5
