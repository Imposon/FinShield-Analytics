import { Transaction, TransactionStatus } from '../models/Transaction';
import { TransactionRepository } from '../repositories/TransactionRepository';
import { FraudService } from './FraudService';
import { AlertService } from './AlertService';
import { AuditLogger } from '../utils/AuditLogger';

export class TransactionService {
    private auditLogger = AuditLogger.getInstance();

    constructor(
        private readonly repository: TransactionRepository,
        private readonly fraudService: FraudService,
        private readonly alertService: AlertService
    ) {}

    public processTransaction(txData: any): Transaction {
        const id = 'TXN-' + Math.random().toString(36).substring(2, 10).toUpperCase();
        
        const newTx: Transaction = {
            ...txData,
            id,
            timestamp: txData.timestamp ? new Date(txData.timestamp) : new Date(),
            status: TransactionStatus.SAFE,
            riskScore: 0,
            currency: txData.currency || 'USD'
        };

        newTx.riskScore = this.fraudService.analyzeTransaction(newTx);
        
        if (newTx.riskScore >= 75) {
            newTx.status = TransactionStatus.FRAUDULENT;
        } else if (newTx.riskScore >= 45) {
            newTx.status = TransactionStatus.SUSPICIOUS;
        }

        this.repository.save(newTx);
        this.auditLogger.logTransaction(id, 'PROCESSED', `Status: ${newTx.status}`);

        if (newTx.status !== TransactionStatus.SAFE) {
            this.alertService.createAlert(newTx.id);
        }

        return newTx;
    }

    public getAllTransactions(): Transaction[] {
        return this.repository.findAll();
    }
}
