import { Transaction } from '../models/Transaction';

export interface FraudScoringStrategy {
    calculateRiskScore(transaction: Transaction): number;
}
