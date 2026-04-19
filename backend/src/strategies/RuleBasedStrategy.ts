import { RiskStrategy } from './RiskStrategy';
import { Transaction } from '../models/Transaction';
import { TransactionRepository } from '../repositories/TransactionRepository';

export class RuleBasedStrategy implements RiskStrategy {
    constructor(private readonly repository: TransactionRepository) {}

    async calculateRisk(transaction: Transaction): Promise<number> {
        const history = await this.repository.findByAccount(transaction.accountId);
        let score = 0;

        if (history.length > 0) {
            const amounts = history.map((t: any) => t.amount);
            const avg = amounts.reduce((a: number, b: number) => a + b, 0) / amounts.length;
            if (transaction.amount > avg * 3) score += 40;
            
            const merchants = new Set(history.map((t: any) => t.merchant));
            if (!merchants.has(transaction.merchant)) score += 30;
        } else {
            if (transaction.amount > 5000) score += 50;
        }

        const hour = new Date(transaction.timestamp).getHours();
        if (hour < 5 || hour > 23) score += 20;

        return Math.min(score, 100);
    }
}
