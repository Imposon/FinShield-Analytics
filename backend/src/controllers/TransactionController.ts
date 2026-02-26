import { Request, Response } from 'express';
import { TransactionService } from '../services/TransactionService';

export class TransactionController {
    constructor(private readonly service: TransactionService) {}

    public uploadDocument = async (req: Request, res: Response): Promise<void> => {
        try {
            const file = req.file;
            if (!file) {
                res.status(400).json({ success: false, message: 'No file' });
                return;
            }
            const { DocumentParserService } = require('../services/DocumentParserService');
            const parser = new DocumentParserService();
            const data = await parser.parseDocument(file.buffer, file.mimetype);
            const results = data.map((tx: any) => this.service.processTransaction(tx));
            res.status(201).json({ success: true, data: results });
        } catch (e: any) {
            res.status(500).json({ success: false, message: e.message });
        }
    };

    public createTransaction = (req: Request, res: Response): void => {
        try {
            const data = req.body;
            if (Array.isArray(data)) {
                const results = data.map(tx => this.service.processTransaction(tx));
                res.status(201).json({ success: true, data: results });
            } else {
                const result = this.service.processTransaction(data);
                res.status(201).json({ success: true, data: result });
            }
        } catch (e: any) {
            res.status(500).json({ success: false, message: e.message });
        }
    };

    public getAllTransactions = (req: Request, res: Response): void => {
        res.json({ success: true, data: this.service.getAllTransactions() });
    };

    public clearTransactions = (req: Request, res: Response): void => {
        (this.service as any).repository.clear();
        res.json({ success: true });
    };
}
