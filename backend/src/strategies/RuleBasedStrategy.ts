import { FraudScoringStrategy } from './FraudScoringStrategy';
import { Transaction } from '../models/Transaction';
import { TransactionRepository } from '../repositories/TransactionRepository';

export class RuleBasedStrategy implements FraudScoringStrategy {
    constructor(private readonly repository: TransactionRepository) {}

    calculateRiskScore(transaction: Transaction): number {
        const history = this.repository.findAll().filter(t => t.accountId === transaction.accountId);
        let score = 0;

        if (history.length > 0) {
            const amounts = history.map(t => t.amount);
            const avg = amounts.reduce((a, b) => a + b, 0) / amounts.length;
            if (transaction.amount > avg * 3) score += 40;
            
            const merchants = new Set(history.map(t => t.merchant));
            if (!merchants.has(transaction.merchant)) score += 30;
        } else {
            if (transaction.amount > 5000) score += 50;
        }

        const hour = new Date(transaction.timestamp).getHours();
        if (hour < 5 || hour > 23) score += 20;

        return Math.min(score, 100);
    }
}
