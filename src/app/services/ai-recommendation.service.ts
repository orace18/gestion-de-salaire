import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AiRecommendation, BudgetSummary } from '../models/budget.model';

@Injectable({
    providedIn: 'root'
})
export class AiRecommendationService {
    private readonly CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

    async getRecommendations(budget: BudgetSummary): Promise<AiRecommendation> {
        // If no Claude API key, use rule-based fallback
        if (!environment.claudeApiKey || environment.claudeApiKey === 'YOUR_CLAUDE_API_KEY') {
            return this.getRuleBasedRecommendations(budget);
        }

        try {
            const response = await fetch(this.CLAUDE_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': environment.claudeApiKey,
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                    model: 'claude-3-5-sonnet-20241022',
                    max_tokens: 1024,
                    messages: [{
                        role: 'user',
                        content: this.buildPrompt(budget)
                    }]
                })
            });

            if (!response.ok) {
                console.warn('Claude API error, falling back to rule-based recommendations');
                return this.getRuleBasedRecommendations(budget);
            }

            const data = await response.json();
            return this.parseClaudeResponse(data, budget);
        } catch (error) {
            console.error('Error calling Claude API:', error);
            return this.getRuleBasedRecommendations(budget);
        }
    }

    private buildPrompt(budget: BudgetSummary): string {
        const expenseBreakdown = budget.expenses
            .reduce((acc, e) => {
                const cat = e.category;
                acc[cat] = (acc[cat] || 0) + e.amount;
                return acc;
            }, {} as Record<string, number>);

        return `Tu es un conseiller financier IA. Analyse ce budget et fournis des recommandations personnalisées.

**Salaire mensuel**: ${budget.salary} XOF
**Dépenses totales**: ${budget.totalExpenses} XOF
**Solde disponible**: ${budget.remainingBalance} XOF

**Répartition des dépenses**:
${Object.entries(expenseBreakdown).map(([cat, amt]) => `- ${cat}: ${amt} XOF`).join('\n')}

Fournis ta réponse UNIQUEMENT au format JSON suivant (sans markdown, sans autre texte):
{
  "savingsPercentage": <pourcentage pour l'épargne, entre 0 et 100>,
  "emergencyPercentage": <pourcentage pour les imprévus, entre 0 et 100>,
  "personalPercentage": <pourcentage pour le plaisir, entre 0 et 100>,
  "advice": "<conseil personnalisé en une phrase>"
}

Les 3 pourcentages doivent totaliser 100. Base-toi sur le solde disponible (${budget.remainingBalance} XOF).`;
    }

    private parseClaudeResponse(data: any, budget: BudgetSummary): AiRecommendation {
        try {
            const content = data.content[0].text;
            const jsonMatch = content.match(/\{[\s\S]*\}/);

            if (!jsonMatch) {
                return this.getRuleBasedRecommendations(budget);
            }

            const parsed = JSON.parse(jsonMatch[0]);
            const balance = budget.remainingBalance;

            return {
                savings: Math.round((balance * parsed.savingsPercentage) / 100),
                savingsPercentage: parsed.savingsPercentage,
                emergency: Math.round((balance * parsed.emergencyPercentage) / 100),
                emergencyPercentage: parsed.emergencyPercentage,
                personal: Math.round((balance * parsed.personalPercentage) / 100),
                personalPercentage: parsed.personalPercentage,
                advice: parsed.advice
            };
        } catch (error) {
            console.error('Failed to parse Claude response:', error);
            return this.getRuleBasedRecommendations(budget);
        }
    }

    private getRuleBasedRecommendations(budget: BudgetSummary): AiRecommendation {
        const balance = budget.remainingBalance;

        // 50% savings, 30% emergency, 20% personal (default rule)
        return {
            savings: Math.round(balance * 0.5),
            savingsPercentage: 50,
            emergency: Math.round(balance * 0.3),
            emergencyPercentage: 30,
            personal: Math.round(balance * 0.2),
            personalPercentage: 20,
            advice: "Règle classique 50/30/20 : priorisez l'épargne, constituez un fonds d'urgence, et gardez du budget pour vos loisirs."
        };
    }
}
