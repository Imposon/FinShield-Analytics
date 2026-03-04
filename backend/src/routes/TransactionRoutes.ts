import { Router } from 'express';
import { TransactionController } from '../controllers/TransactionController';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

export class TransactionRoutes {
    public router: Router;
    constructor(private readonly controller: TransactionController) {
        this.router = Router();
        this.router.post('/upload', upload.single('file'), this.controller.uploadDocument);
        this.router.post('/transactions', this.controller.createTransaction);
        this.router.get('/transactions', this.controller.getAllTransactions);
        this.router.delete('/transactions', this.controller.clearTransactions);
    }
}
