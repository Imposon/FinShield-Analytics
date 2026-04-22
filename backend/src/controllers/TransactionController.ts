import { Request, Response } from 'express';
import { TransactionService } from '../services/TransactionService';
import { AIInsightService } from '../services/AIInsightService';

export class TransactionController {
    constructor(
        private readonly service: TransactionService,
        private readonly aiService: AIInsightService
    ) {}

    private getAccountId(req: Request): string {
        return (req.headers['x-account-id'] as string) || 'anonymous';
    }

    public uploadDocument = async (req: Request, res: Response): Promise<void> => {
        try {
            const file = req.file;
            const accountId = this.getAccountId(req);
            if (!file) {
                res.status(400).json({ success: false, message: 'No file' });
                return;
            }
            const { DocumentParserService } = require('../services/DocumentParserService');
            const parser = new DocumentParserService();
            const data = await parser.parseDocument(file.buffer, file.mimetype);
            
            const results = [];
            for (const tx of data) {
                results.push(await this.service.processTransaction(tx, accountId));
            }
            
            res.status(201).json({ success: true, data: results });
        } catch (e: any) {
            res.status(500).json({ success: false, message: e.message });
        }
    };

    public createTransaction = async (req: Request, res: Response): Promise<void> => {
        try {
            const data = req.body;
            const accountId = this.getAccountId(req);
            if (Array.isArray(data)) {
                const results = [];
                for (const tx of data) {
                    results.push(await this.service.processTransaction(tx, accountId));
                }
                res.status(201).json({ success: true, data: results });
            } else {
                const result = await this.service.processTransaction(data, accountId);
                res.status(201).json({ success: true, data: result });
            }
        } catch (e: any) {
            res.status(500).json({ success: false, message: e.message });
        }
    };

    public getAllTransactions = async (req: Request, res: Response): Promise<void> => {
        const accountId = this.getAccountId(req);
        const txs = await this.service.getTransactionsByAccount(accountId);
        res.json({ success: true, data: txs });
    };

    public getAIInsights = async (req: Request, res: Response): Promise<void> => {
        try {
            const accountId = this.getAccountId(req);
            const txs = await this.service.getTransactionsByAccount(accountId);
            const insight = await this.aiService.generateInsight(txs);
            res.json({ success: true, insight });
        } catch (e: any) {
            res.status(500).json({ success: false, message: e.message });
        }
    };

    public clearTransactions = async (req: Request, res: Response): Promise<void> => {
        const accountId = this.getAccountId(req);
        await this.service.repository.clearAccount(accountId);
        res.json({ success: true });
    };
}
