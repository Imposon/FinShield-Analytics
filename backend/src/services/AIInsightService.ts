import OpenAI from 'openai';

export class AIInsightService {
    private client: OpenAI;

    constructor(apiKey: string) {
        this.client = new OpenAI({
            apiKey: apiKey,
            baseURL: 'https://api.groq.com/openai/v1'
        });
    }

    public async generateInsight(transactions: any[]): Promise<string> {
        if (transactions.length === 0) return "No transaction data available for analysis.";

        const prompt = `
            Analyze these financial transactions (INR) for potential fraud patterns. 
            DO NOT just list the transactions. Instead, provide a thematic synthesis of the risk environment.
            
            Transactions Data: ${JSON.stringify(transactions.slice(-20))}
            
            STICTLY use this professional structure:
            
            **Financial Transaction Analysis Summary**
            **Risk Level:** [Critical/High/Medium/Low]
            **Summary:** Provide a 3-sentence high-level overview of the account's behavior. Mention if the behavior is standard or anomalous.
            
            **Anomalies and Insights:**
            1. **Velocity Alert:** Analyze if there are too many transactions in a short time.
            2. **Entity Consistency:** Analyze if the counterparties are known merchants (Zomato/Uber) vs high-risk entities.
            3. **Outlier Vectors:** Identify specific transactions that deviate significantly in value.
            
            **Recommendations:**
            1. [Immediate actionable step for the analyst]
            2. [Long-term account monitoring strategy]
            
            **Urgency:** [Immediate Action / Routine Review]
        `;

        try {
            const response = await this.client.chat.completions.create({
                model: 'llama-3.1-8b-instant',
                messages: [{ role: 'system', content: 'You are a professional Financial Risk Analyst.' }, { role: 'user', content: prompt }]
            });
            return response.choices[0].message.content || "Strategic analysis unavailable.";
        } catch (error: any) {
            console.error("Groq AI Error:", error.message);
            return "Unable to generate AI insights at this time.";
        }
    }
}
