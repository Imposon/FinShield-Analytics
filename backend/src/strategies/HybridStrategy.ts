import { FraudScoringStrategy } from './FraudScoringStrategy';
import { Transaction } from '../models/Transaction';
import { RuleBasedStrategy } from './RuleBasedStrategy';
import { AISimulatedStrategy } from './AISimulatedStrategy';

export class HybridStrategy implements FraudScoringStrategy {
    constructor(
        private readonly ruleStrategy: RuleBasedStrategy,
        private readonly aiStrategy: AISimulatedStrategy
    ) {}

    calculateRiskScore(transaction: Transaction): number {
        const mlScore = this.aiStrategy.calculateRiskScore(transaction);
        const statScore = this.ruleStrategy.calculateRiskScore(transaction);
        return Math.min(Math.round((0.6 * mlScore) + (0.4 * statScore)), 100);
    }
}
