# 🛡️ FinShield Analytics
### AI-Powered Financial Fraud Detection & Risk Analysis

FinShield Analytics is a high-end, professional enterprise platform designed for real-time monitoring, anomaly detection, and fraud prevention in banking ecosystems. It utilizes a **Hybrid Risk Scoring Engine** (Statistical Heuristics + AI Anomaly Vectors) combined with a strictly layered **Object-Oriented Architecture** to deliver industry-grade security analysis.

---

## 🚀 Live Demo
**[Frontend Live Link (Vercel)](https://finshield-analytics.vercel.app)**  
**[Backend Live Link (Render)](https://finshield-analytics.onrender.com)**  

---

## 🛠️ Tech Stack
- **Frontend**: React 18, Vite, Type-Script, Recharts, Lucide, Plus Jakarta Sans.
- **Backend**: Node.js, Express, TypeScript, Knex.js, SQLite3 (Persistence).
- **AI Core**: Groq AI (Llama-3.1 Strategic Model).
- **Architecture**: Controller-Service-Repository Pattern, Strategy & Singleton Design Patterns.

---

## 📋 Architectural Compliance
The system is built to strictly follow the formal architectural documentation:
- **[Class Diagram](classDiagram.md)**: Implements clear inheritance for User roles and the Strategy pattern for Fraud detection.
- **[Sequence Diagram](sequencDiagram.md)**: Enforces a transactional lifecycle from ingestion to verdict.
- **[ER Diagram](ErDiagram.md)**: Relational schema mapping Users, Transactions, and Audit Trails in SQLite.
- **[Use Case Diagram](useCaseDiagram.md)**: Defines boundaries between System Actors (Analysts, Auditors, Admins).

---

## 🧩 Core Features
1. **Hybrid Scoring Engine**: Combines Rule-Based statistical analysis with AI Anomaly Forest heuristics.
2. **Document Ingestion**: Parser specifically built to handle CSV and high-complexity PDF bank statements.
3. **AI Cognitive Verdicts**: Generates natural language insights on portfolio risk using the Groq Llama-3.1 engine.
4. **Bento-Style Dashboard**: A premium, obsidian-dark user interface designed for high-density financial data visualization.
5. **Persistence & Audit**: Full SQL tracking of every decision point with immutable audit logging.

---

## 📦 Setup & Installation

### 1. Backend
```bash
cd backend
npm install
# Ensure GROQ_API_KEY is in your environment
npm run dev
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3. AI Insights API Key
Make sure to set the `GROQ_API_KEY` in your environment to enable real-time pattern synthesis.

---

## 👨‍💻 Project Submission
**Status**: Finalized & Optimized  
**Version**: 1.0.0  
**Deadline**: April 19, 2026 (Submitted On-Time)

---
*Developed for the SESD Project Evaluation.*
