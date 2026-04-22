import { RiskStrategy } from './RiskStrategy';
import { Transaction } from '../models/Transaction';
import dotenv from 'dotenv';
dotenv.config();

export class AIBasedStrategy implements RiskStrategy {
    private aiServiceUrl = process.env.AI_SERVICE_URL || 'https://finshield-ai-service.onrender.com';

    async calculateRisk(transaction: Transaction): Promise<number> {
        try {
            const response = await fetch(`${this.aiServiceUrl}/score?amount=${transaction.amount}`);
            const data: any = await response.json();
            return Math.round(data.risk_score) || 50;
        } catch (error) {
            console.error("AI Service Error, falling back to heuristic hash:", error);
            let hash = 0;
            const seedString = `${transaction.accountId}-${transaction.merchant}`;
            for (let i = 0; i < seedString.length; i++) {
                hash = seedString.charCodeAt(i) + ((hash << 5) - hash);
            }
            return Math.abs(hash % 100);
        }
    }
}
