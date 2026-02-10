export interface Expense {
    id: string;
    category: ExpenseCategory;
    amount: number;
    description: string;
    createdAt: Date;
}

export enum ExpenseCategory {
    HOUSING = 'Logement',
    TRANSPORT = 'Transport',
    FOOD = 'Alimentation',
    SUPPLIES = 'Ravitaillement',
    TITHE = 'Dîme',
    CLOTHING = 'Habillement',
    HEALTH = 'Santé',
    BILLS = 'Factures',
    SUBSCRIPTIONS = 'Abonnements',
    OTHER = 'Autre'
}

export interface BudgetSummary {
    salary: number;
    totalExpenses: number;
    remainingBalance: number;
    expenses: Expense[];
}

export interface AiRecommendation {
    savings: number;
    savingsPercentage: number;
    emergency: number;
    emergencyPercentage: number;
    personal: number;
    personalPercentage: number;
    advice: string;
}
