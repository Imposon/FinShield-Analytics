import { Transaction, TransactionStatus } from '../models/Transaction';
import { TransactionRepository } from '../repositories/TransactionRepository';
import { FraudService } from './FraudService';
import { AlertService } from './AlertService';
import { AuditLogger } from '../utils/AuditLogger';

export class TransactionService {
    private auditLogger = AuditLogger.getInstance();

    constructor(
        public readonly repository: TransactionRepository,
        private readonly fraudService: FraudService,
        private readonly alertService: AlertService
    ) {}

    public async processTransaction(txData: any, accountId: string = 'anonymous'): Promise<Transaction> {
        const id = 'TXN-' + Math.random().toString(36).substring(2, 10).toUpperCase();
        
        const newTx: Transaction = {
            ...txData,
            id,
            accountId: txData.accountId || accountId,
            timestamp: txData.timestamp ? new Date(txData.timestamp) : new Date(),
            status: TransactionStatus.SAFE,
            riskScore: 0,
            currency: txData.currency || 'INR'
        };

        newTx.riskScore = await this.fraudService.analyzeTransaction(newTx);
        
        if (newTx.riskScore >= 75) {
            newTx.status = TransactionStatus.FRAUDULENT;
        } else if (newTx.riskScore >= 45) {
            newTx.status = TransactionStatus.SUSPICIOUS;
        }

        await this.repository.save(newTx);
        this.auditLogger.logTransaction(id, 'PROCESSED', `Status: ${newTx.status}`);

        if (newTx.status !== TransactionStatus.SAFE) {
            await this.alertService.createAlert(newTx.id);
        }

        return newTx;
    }

    public async getTransactionsByAccount(accountId: string): Promise<Transaction[]> {
        return await this.repository.findByAccount(accountId);
    }
}
