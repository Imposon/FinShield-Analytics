import { Transaction } from '../models/Transaction';
import { RuleBasedStrategy } from '../strategies/RuleBasedStrategy';
import { AISimulatedStrategy } from '../strategies/AISimulatedStrategy';

export class FraudService {
    constructor(
        private readonly ruleStrategy: RuleBasedStrategy,
        private readonly aiStrategy: AISimulatedStrategy
    ) {}

    public analyzeTransaction(transaction: Transaction): number {
        const ruleScore = this.ruleStrategy.calculateRiskScore(transaction);
        const aiScore = this.aiStrategy.calculateRiskScore(transaction);
        
        const finalRiskScore = (0.6 * aiScore) + (0.4 * ruleScore);
        
        return Math.min(Math.round(finalRiskScore), 100);
    }
}
