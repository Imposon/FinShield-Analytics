import { NotificationService } from './NotificationService';
import { db } from '../utils/Database';

export class Alert {
    public alertId: string;
    public transactionId: string;
    public status: string;
    public assignedTo: number | null;

    constructor(transactionId: string) {
        this.alertId = 'ALT-' + Math.random().toString(36).substr(2, 6).toUpperCase();
        this.transactionId = transactionId;
        this.status = 'OPEN';
        this.assignedTo = null;
    }
}

export class AlertService {
    constructor(private readonly notificationService: NotificationService) {}

    public async createAlert(transactionId: string): Promise<Alert> {
        const newAlert = new Alert(transactionId);
        
        await db('ALERTS').insert({
            alert_id: newAlert.alertId,
            transaction_id: newAlert.transactionId,
            status: newAlert.status,
            assigned_to: newAlert.assignedTo,
            created_at: new Date()
        });

        this.notificationService.sendPushNotification('analyst', newAlert);
        return newAlert;
    }

    public async getAllAlerts(): Promise<any[]> {
        return await db('ALERTS').orderBy('created_at', 'desc');
    }
}
