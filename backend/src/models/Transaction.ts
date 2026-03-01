export enum TransactionStatus {
    SAFE = 'SAFE',
    SUSPICIOUS = 'SUSPICIOUS',
    FRAUDULENT = 'FRAUDULENT'
}

export interface Transaction {
    id: string;
    accountId: string;
    amount: number;
    currency: string;
    merchant: string;
    timestamp: Date;
    status: TransactionStatus;
    riskScore: number;
}
