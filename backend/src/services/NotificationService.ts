export class NotificationService {
    public sendPushNotification(userId: string, alertDetails: any): void {
        console.log(`[NOTIFICATION] Sent to ${userId}: ${JSON.stringify(alertDetails)}`);
    }
}
