# Use Case Diagram – FinShield Analytics

```mermaid
flowchart LR

%% =======================
%% ACTORS (LEFT SIDE)
%% =======================

Customer[[Customer]]
Admin[[Admin]]
Analyst[[Risk Analyst]]
Auditor[[Auditor]]
Bank[[Bank Core System]]
AI[[AI Service]]

%% =======================
%% SYSTEM BOUNDARY
%% =======================

subgraph FinShield_Analytics_System

direction TB

AuthBox[Authentication Module]
TransactionBox[Transaction Processing Module]
AlertBox[Alert Management Module]
ReportBox[Reporting & Monitoring Module]

Login[Login]
ManageUsers[Manage Users]

ProcessTransaction[Process Transaction]
CalculateRisk[Calculate Risk Score]
GenerateAlert[Generate Alert]

AssignAlert[Assign Alert]
UpdateStatus[Update Alert Status]

ViewDashboard[View Dashboard]
ViewReports[View Reports]
ViewAuditLogs[View Audit Logs]
RetrainModel[Retrain AI Model]

%% Module Structure
AuthBox --> Login
AuthBox --> ManageUsers

TransactionBox --> ProcessTransaction
TransactionBox --> CalculateRisk
TransactionBox --> GenerateAlert

AlertBox --> AssignAlert
AlertBox --> UpdateStatus

ReportBox --> ViewDashboard
ReportBox --> ViewReports
ReportBox --> ViewAuditLogs
ReportBox --> RetrainModel

end

%% =======================
%% CONNECTIONS
%% =======================

Customer --> ProcessTransaction
Bank --> ProcessTransaction
AI --> CalculateRisk

ProcessTransaction --> CalculateRisk
CalculateRisk --> GenerateAlert

Admin --> Login
Admin --> ManageUsers
Admin --> ViewDashboard
Admin --> ViewReports
Admin --> RetrainModel

Analyst --> Login
Analyst --> AssignAlert
Analyst --> UpdateStatus
Analyst --> ViewDashboard

Auditor --> ViewReports
Auditor --> ViewAuditLogs
