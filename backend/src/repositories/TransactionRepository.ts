import { Transaction } from '../models/Transaction';
import { db } from '../utils/Database';

export class TransactionRepository {
    public async save(transaction: Transaction): Promise<void> {
        await db('TRANSACTIONS').insert({
            transaction_id: transaction.id,
            account_id: transaction.accountId,
            amount: transaction.amount,
            currency: transaction.currency,
            merchant: transaction.merchant,
            status: transaction.status,
            risk_score: transaction.riskScore,
            created_at: transaction.timestamp
        });
    }

    public async findByAccount(accountId: string): Promise<Transaction[]> {
        const rows = await db('TRANSACTIONS')
            .where('account_id', accountId)
            .orderBy('created_at', 'desc');
        return rows.map(this.mapRowToTransaction);
    }

    public async clearAccount(accountId: string): Promise<void> {
        await db('TRANSACTIONS').where('account_id', accountId).del();
        // Since alerts are tied to transactions, we might want to cascade or just clear all
        // For simple project, clear transactions for this user is enough
    }

    private mapRowToTransaction(row: any): Transaction {
        return {
            id: row.transaction_id,
            accountId: row.account_id || 'anonymous',
            amount: row.amount,
            currency: row.currency,
            merchant: row.merchant,
            status: row.status as any,
            riskScore: row.risk_score,
            timestamp: new Date(row.created_at)
        };
    }
}
