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
        const lines = text.split('\n');
        const txs = [];
        const regex = /((?:\d{4}-\d{2}-\d{2})|(?:\d{2}\/\d{2}\/\d{4}))\s+(.+?)\s+((?:-)?(?:\$)?\s*\d+(?:,\d{3})*(?:\.\d{2})?)$/;
        for (const line of lines) {
            const m = line.trim().match(regex);
            if (m) {
                txs.push({ timestamp: new Date(m[1]), merchant: m[2].trim(), amount: parseFloat(m[3].replace(/[$,\s]/g, '')) });
            }
        }
        return txs;
    }

    private parseCsv(text: string): any[] {
        const lines = text.split('\n').filter(l => l.trim());
        return lines.slice(1).map(l => {
            const c = l.split(',');
            return { timestamp: new Date(c[0]), merchant: c[1], amount: parseFloat(c[2]) };
        });
    }
}
