import { Transaction } from '../models/Transaction';

export class TransactionRepository {
    private transactions: Map<string, Transaction> = new Map();

    public save(transaction: Transaction): void {
        this.transactions.set(transaction.id, transaction);
    }

    public findById(id: string): Transaction | undefined {
        return this.transactions.get(id);
    }

    public findAll(): Transaction[] {
        return Array.from(this.transactions.values());
    }

    public clear(): void {
        this.transactions.clear();
    }
}
