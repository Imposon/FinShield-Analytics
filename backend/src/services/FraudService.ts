import { Transaction } from '../models/Transaction';
import { RiskStrategy } from '../strategies/RiskStrategy';

export class FraudService {
    constructor(
        private readonly ruleStrategy: RiskStrategy,
        private readonly aiStrategy: RiskStrategy
    ) {}

    public async analyzeTransaction(transaction: Transaction): Promise<number> {
        const ruleScore = await this.ruleStrategy.calculateRisk(transaction);
        const aiScore = await this.aiStrategy.calculateRisk(transaction);
        
        const finalRiskScore = (0.6 * aiScore) + (0.4 * ruleScore);
        
        return Math.min(Math.round(finalRiskScore), 100);
    }
}
