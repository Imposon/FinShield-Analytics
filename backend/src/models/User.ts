export class User {
    constructor(
        public userId: number,
        public name: string,
        public email: string,
        public role: string
    ) {}

    public login() { console.log(`${this.name} logged in`); }
    public logout() { console.log(`${this.name} logged out`); }
}

export class Admin extends User {
    public manageUsers() { console.log("Managing users..."); }
    public retrainModel() { console.log("Retraining anomaly engine..."); }
}

export class RiskAnalyst extends User {
    public investigateAlert(alertId: string) { console.log(`Investigating ${alertId}`); }
    public updateAlertStatus(alertId: string, status: string) { console.log(`Alert ${alertId} updated to ${status}`); }
}

export class Auditor extends User {
    public viewReports() { console.log("Viewing risk reports..."); }
    public viewAuditLogs() { console.log("Viewing audit trail..."); }
}
