import pdfParse from 'pdf-parse';

export class DocumentParserService {
    public async parseDocument(buffer: Buffer, mime: string): Promise<any[]> {
        if (mime === 'application/pdf') {
            const data = await pdfParse(buffer);
            return this.parseText(data.text);
        }
        return this.parseCsv(buffer.toString());
    }

    private parseText(text: string): any[] {
        const txs: any[] = [];
        
        const tabularRegex = /((?:\d{2}[-/\.]\d{2}[-/\.]\d{4})|(?:\d{4}[-/\.]\d{2}[-/\.]\d{2}))\s+(.+?)\s+((?:\d+(?:,\d{3})*(?:\.\d{2})?))$/gm;
        let match;
        while ((match = tabularRegex.exec(text)) !== null) {
            txs.push({
                timestamp: this.normalizeDate(match[1]),
                merchant: match[2].trim(),
                amount: parseFloat(match[3].replace(/,/g, ''))
            });
        }

        if (txs.length === 0) {
            const lines = text.split('\n').map(l => l.trim()).filter(l => l);
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                const dateMatch = line.match(/(?:Date|Time):\s*((?:\d{2}[-/\.](?:\d{2}|[A-Z]{3})[-/\.]\d{4}))/i);
                if (dateMatch) {
                    let amount = 0;
                    let merchant = "Generic UPI Transfer";
                    for (let j = 1; j < 10 && (i + j) < lines.length; j++) {
                        const nextLine = lines[i+j];
                        if (nextLine.match(/Amount|Paid|Received/i)) {
                            const amtMatch = nextLine.match(/(\d+(?:\.\d{2})?)/);
                            if (amtMatch) amount = parseFloat(amtMatch[1]);
                        }
                        if (nextLine.match(/To:|Paid to:|Merchant:/i)) {
                            merchant = nextLine.replace(/To:|Paid to:|Merchant:/i, '').trim();
                        }
                    }
                    if (amount > 0) {
                        txs.push({ timestamp: this.normalizeDate(dateMatch[1]), merchant, amount });
                        i += 5;
                    }
                }
            }
        }

        if (txs.length === 0) {
            const genericRegex = /((?:\d{2}.\d{2}.\d{4}))\s+([A-Z\s]+)\s+([\d,]+\.\d{2})/g;
            while ((match = genericRegex.exec(text)) !== null) {
                txs.push({ timestamp: this.normalizeDate(match[1]), merchant: match[2].trim(), amount: parseFloat(match[3].replace(/,/g, '')) });
            }
        }

        console.log(`[Parser] Extracted ${txs.length} transactions from PDF.`);
        return txs;
    }

    private parseCsv(text: string): any[] {
        const lines = text.split(/\r?\n/).filter(l => l.trim());
        if (lines.length < 2) return [];

        const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
        
        const dateIdx = headers.findIndex(h => h.includes('date') || h.includes('time'));
        const descIdx = headers.findIndex(h => h.includes('narration') || h.includes('description') || h.includes('merchant') || h.includes('beneficiary'));
        const amtIdx = headers.findIndex(h => h.includes('amount') || h.includes('withdrawal') || h.includes('debit') || h.includes('value'));

        const results = lines.slice(1).map(l => {
            const c = this.splitCsvLine(l);
            if (dateIdx !== -1 && descIdx !== -1 && amtIdx !== -1) {
                return {
                    timestamp: this.normalizeDate(c[dateIdx]),
                    merchant: c[descIdx] ? c[descIdx].replace(/"/g, '').trim() : 'Unknown',
                    amount: parseFloat(c[amtIdx] ? c[amtIdx].replace(/[^\d\.]/g, '') : '0')
                };
            }
                return { timestamp: this.normalizeDate(c[0]), merchant: c[1], amount: parseFloat(c[2]) };
        }).filter(tx => !isNaN(tx.amount) && tx.amount > 0);

        console.log(`[Parser] Extracted ${results.length} transactions from CSV.`);
        return results;
    }

    private splitCsvLine(line: string): string[] {
        const matches = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g);
        return matches ? matches.map(m => m.trim().replace(/^"|"$/g, '')) : line.split(',');
    }

    private normalizeDate(dateStr: string): Date {
        if (!dateStr) return new Date();
        const months: any = { JAN:'01', FEB:'02', MAR:'03', APR:'04', MAY:'05', JUN:'06', JUL:'07', AUG:'08', SEP:'09', OCT:'10', NOV:'11', DEC:'12' };
        let cleanDate = dateStr.toUpperCase();
        for (const [m, v] of Object.entries(months)) {
            if (cleanDate.includes(m)) {
                cleanDate = cleanDate.replace(m, v as string);
                break;
            }
        }
        
        if (cleanDate.includes('-') || cleanDate.includes('/')) {
            const sep = cleanDate.includes('-') ? '-' : '/';
            const parts = cleanDate.split(sep);
            if (parts[0].length === 2 && parts[2].length === 4) {
                 return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
            }
        }
        return new Date(dateStr);
    }
}
