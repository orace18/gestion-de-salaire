import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BudgetSummary, Expense, ExpenseCategory } from '../models/budget.model';

@Injectable({
    providedIn: 'root'
})
export class BudgetService {
    private readonly STORAGE_KEY_SALARY = 'salary';
    private readonly STORAGE_KEY_EXPENSES = 'expenses';

    private salarySubject = new BehaviorSubject<number>(this.loadSalary());
    private expensesSubject = new BehaviorSubject<Expense[]>(this.loadExpenses());

    salary$: Observable<number> = this.salarySubject.asObservable();
    expenses$: Observable<Expense[]> = this.expensesSubject.asObservable();

    constructor() { }

    setSalary(amount: number): void {
        localStorage.setItem(this.STORAGE_KEY_SALARY, amount.toString());
        this.salarySubject.next(amount);
    }

    getSalary(): number {
        return this.salarySubject.value;
    }

    addExpense(category: ExpenseCategory, amount: number, description: string): void {
        const expense: Expense = {
            id: this.generateId(),
            category,
            amount,
            description,
            createdAt: new Date()
        };

        const expenses = [...this.expensesSubject.value, expense];
        this.saveExpenses(expenses);
        this.expensesSubject.next(expenses);
    }

    removeExpense(id: string): void {
        const expenses = this.expensesSubject.value.filter(e => e.id !== id);
        this.saveExpenses(expenses);
        this.expensesSubject.next(expenses);
    }

    getExpenses(): Expense[] {
        return this.expensesSubject.value;
    }

    getBudgetSummary(): BudgetSummary {
        const salary = this.getSalary();
        const expenses = this.getExpenses();
        const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

        return {
            salary,
            totalExpenses,
            remainingBalance: salary - totalExpenses,
            expenses
        };
    }

    private loadSalary(): number {
        const saved = localStorage.getItem(this.STORAGE_KEY_SALARY);
        return saved ? parseFloat(saved) : 0;
    }

    private loadExpenses(): Expense[] {
        const saved = localStorage.getItem(this.STORAGE_KEY_EXPENSES);
        if (!saved) return [];

        try {
            const parsed = JSON.parse(saved);
            return parsed.map((e: any) => ({
                ...e,
                createdAt: new Date(e.createdAt)
            }));
        } catch {
            return [];
        }
    }

    private saveExpenses(expenses: Expense[]): void {
        localStorage.setItem(this.STORAGE_KEY_EXPENSES, JSON.stringify(expenses));
    }

    private generateId(): string {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}
