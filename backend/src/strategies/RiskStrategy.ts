import { Transaction } from '../models/Transaction';

export interface RiskStrategy {
    calculateRisk(transaction: Transaction): Promise<number>;
}
