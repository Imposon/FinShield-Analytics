import { NotificationService } from './NotificationService';

export class Alert {
    public alertId: string;
    public transactionId: string;
    public status: string;
    public assignedTo: string | null;

    constructor(transactionId: string) {
        this.alertId = 'ALT-' + Math.random().toString(36).substr(2, 6).toUpperCase();
        this.transactionId = transactionId;
        this.status = 'OPEN';
        this.assignedTo = null;
    }
}

export class AlertService {
    private alerts: Alert[] = [];
    constructor(private readonly notificationService: NotificationService) {}

    public createAlert(transactionId: string): Alert {
        const newAlert = new Alert(transactionId);
        this.alerts.push(newAlert);
        this.notificationService.sendPushNotification('analyst', newAlert);
        return newAlert;
    }
}
