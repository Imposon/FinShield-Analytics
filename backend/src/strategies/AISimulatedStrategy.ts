import { FraudScoringStrategy } from './FraudScoringStrategy';
import { Transaction } from '../models/Transaction';

export class AISimulatedStrategy implements FraudScoringStrategy {
    calculateRiskScore(transaction: Transaction): number {
        let hash = 0;
        const seedString = `${transaction.accountId}-${transaction.merchant}-${transaction.amount}`;
        for (let i = 0; i < seedString.length; i++) {
            hash = seedString.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash % 100);
    }
}
