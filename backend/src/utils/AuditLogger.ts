import { Logger } from './Logger';

export class AuditLogger {
    private static instance: AuditLogger;
    private logger = Logger.getInstance();
    private constructor() {}
    public static getInstance(): AuditLogger {
        if (!AuditLogger.instance) AuditLogger.instance = new AuditLogger();
        return AuditLogger.instance;
    }
    public logTransaction(id: string, action: string, d: string): void {
        this.logger.info(`[AUDIT] Tx: ${id} | Action: ${action} | ${d}`);
    }
}
