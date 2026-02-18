# Use Case Diagram – FinShield Analytics

```mermaid
flowchart LR

%% ACTORS
Admin((Admin))
Analyst((Risk Analyst))
Auditor((Auditor))
Customer((Customer))

%% USE CASES (RIGHT SIDE)

Login[Register / Login]

ProcessTransaction[Process Transaction]
CalculateRisk[Calculate Risk Score]
GenerateAlert[Generate Alert]

AssignAlert[Assign Alert]
UpdateStatus[Update Alert Status]

ViewDashboard[View Dashboard]
ViewReports[View Reports]
ViewAuditLogs[View Audit Logs]

ManageUsers[Manage Users]
RetrainModel[Retrain AI Model]

%% CONNECTIONS

Customer --> ProcessTransaction

Admin --> Login
Admin --> ManageUsers
Admin --> ViewDashboard
Admin --> ViewReports
Admin --> RetrainModel

Analyst --> Login
Analyst --> AssignAlert
Analyst --> UpdateStatus
Analyst --> ViewDashboard
Analyst --> ViewReports

Auditor --> ViewReports
Auditor --> ViewAuditLogs

%% SYSTEM FLOW
ProcessTransaction --> CalculateRisk
CalculateRisk --> GenerateAlert
