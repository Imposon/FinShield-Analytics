# Use Case Diagram – FinShield Analytics

```mermaid
flowchart LR

%% ======================
%% ACTORS (Left Side)
%% ======================

Customer([Customer])
Admin([Admin])
Analyst([Risk Analyst])
Auditor([Auditor])
BankAPI([Bank Core System])
AIService([AI Service])

%% ======================
%% SYSTEM BOUNDARY
%% ======================

subgraph FinShield_Analytics_System

%% Authentication
Login(Login)
ManageUsers(Manage Users)

%% Transaction Processing
ProcessTransaction(Process Transaction)
CalculateRisk(Calculate Risk Score)
GenerateAlert(Generate Alert)

%% Alert Management
AssignAlert(Assign Alert)
UpdateStatus(Update Alert Status)

%% Monitoring & Reporting
ViewDashboard(View Dashboard)
ViewReports(View Reports)
ViewAuditLogs(View Audit Logs)
RetrainModel(Retrain AI Model)

end

%% ======================
%% RELATIONSHIPS
%% ======================

%% Customer & Bank
Customer --> ProcessTransaction
BankAPI --> ProcessTransaction

%% Core Fraud Flow
ProcessTransaction --> CalculateRisk
AIService --> CalculateRisk
CalculateRisk --> GenerateAlert

%% Admin Actions
Admin --> Login
Admin --> ManageUsers
Admin --> ViewDashboard
Admin --> ViewReports
Admin --> RetrainModel

%% Analyst Actions
Analyst --> Login
Analyst --> ViewDashboard
Analyst --> AssignAlert
Analyst --> UpdateStatus
Analyst --> ViewReports

%% Auditor Actions
Auditor --> ViewReports
Auditor --> ViewAuditLogs
