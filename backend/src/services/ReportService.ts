import { TransactionRepository } from '../repositories/TransactionRepository';

export class ReportService {
    constructor(private readonly repository: TransactionRepository) {}

    public async generateFraudReport() {
        const txs = await this.repository.findAll();
        return txs.filter(t => t.riskScore > 70);
    }

    public async generateRiskTrend() {
        const txs = await this.repository.findAll();
        // Simplified trend analysis
        return txs.slice(0, 10);
    }
}
