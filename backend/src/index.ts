import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { TransactionRepository } from './repositories/TransactionRepository';
import { TransactionService } from './services/TransactionService';
import { RuleBasedStrategy } from './strategies/RuleBasedStrategy';
import { AISimulatedStrategy } from './strategies/AISimulatedStrategy';
import { FraudService } from './services/FraudService';
import { AlertService } from './services/AlertService';
import { NotificationService } from './services/NotificationService';
import { TransactionController } from './controllers/TransactionController';
import { TransactionRoutes } from './routes/TransactionRoutes';
import { Logger } from './utils/Logger';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const logger = Logger.getInstance();

const repository = new TransactionRepository();
const ruleStrategy = new RuleBasedStrategy(repository);
const aiStrategy = new AISimulatedStrategy();
const fraudService = new FraudService(ruleStrategy, aiStrategy);

const notificationService = new NotificationService();
const alertService = new AlertService(notificationService);

const transactionService = new TransactionService(repository, fraudService, alertService);
const controller = new TransactionController(transactionService);
const routes = new TransactionRoutes(controller);

app.use('/api', routes.router);

app.get('/health', (req, res) => {
    res.json({ status: 'OK', service: 'FinShield' });
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});
