import { Injectable, inject } from '@angular/core';
import { Observable, combineLatest, of, firstValueFrom } from 'rxjs';
import { switchMap, map, take, catchError, shareReplay, startWith } from 'rxjs/operators';
import { Firestore, collection, doc, setDoc, addDoc, deleteDoc, collectionData, docData, getDoc } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { BudgetSummary, Expense, ExpenseCategory, Operation } from '../models/budget.model';

@Injectable({
    providedIn: 'root'
})
export class BudgetService {
    private firestore = inject(Firestore);
    private authService = inject(AuthService);

    readonly salary$: Observable<number>;
    readonly expenses$: Observable<Expense[]>;
    readonly operations$: Observable<Operation[]>;

    constructor() {
        this.salary$ = this.authService.user$.pipe(
            switchMap(user => {
                if (!user) return of(0);
                this.checkAndMigrate(user.uid).catch(err => console.error('Migration error:', err));
                const profileDoc = doc(this.firestore, 'users', user.uid, 'profile', 'data');
                return (docData(profileDoc) as Observable<any>).pipe(
                    startWith(null),
                    map(profile => profile?.salary || 0),
                    catchError(err => {
                        console.error('Firestore read error (salary):', err);
                        return of(0);
                    })
                );
            }),
            startWith(0)
        );

        this.expenses$ = this.authService.user$.pipe(
            switchMap(user => {
                if (!user) return of([]);
                const expensesCol = collection(this.firestore, 'users', user.uid, 'expenses');
                return (collectionData(expensesCol, { idField: 'id' }) as Observable<any[]>).pipe(
                    startWith([]),
                    map(expenses =>
                        (expenses || []).map(e => ({
                            ...e,
                            createdAt: e.createdAt?.toDate ? e.createdAt.toDate() : (e.createdAt instanceof Date ? e.createdAt : new Date())
                        }))
                    ),
                    catchError(err => {
                        console.error('Firestore read error (expenses):', err);
                        return of([]);
                    })
                );
            }),
            startWith([])
        );

        this.operations$ = this.authService.user$.pipe(
            switchMap(user => {
                if (!user) return of([]);
                const opsCol = collection(this.firestore, 'users', user.uid, 'operations');
                return (collectionData(opsCol, { idField: 'id' }) as Observable<any[]>).pipe(
                    startWith([]),
                    map(ops => (ops || [])
                        .map(o => ({
                            ...o,
                            timestamp: o.timestamp?.toDate ? o.timestamp.toDate() : (o.timestamp instanceof Date ? o.timestamp : new Date())
                        }))
                        .sort((a, b) => (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0))
                    ),
                    catchError(err => {
                        console.error('Firestore read error (operations):', err);
                        return of([]);
                    })
                );
            }),
            startWith([])
        );
    }

    private async checkAndMigrate(uid: string) {
        const profileDoc = doc(this.firestore, 'users', uid, 'profile', 'data');
        try {
            const docSnap = await getDoc(profileDoc);
            if (!docSnap.exists()) {
                const localSalary = localStorage.getItem('salary');
                const localExpenses = localStorage.getItem('expenses');
                if (localSalary || localExpenses) {
                    if (localSalary) await this.setSalary(Number(localSalary));
                    if (localExpenses) {
                        try {
                            const expenses = JSON.parse(localExpenses);
                            for (const e of expenses) {
                                await this.addExpense(e.category, e.amount, e.description);
                            }
                        } catch { }
                    }
                }
            }
        } catch { }
    }

    async setSalary(amount: number): Promise<void> {
        const user = await this.getCurrentUser();
        if (!user) return;
        const profileDoc = doc(this.firestore, 'users', user.uid, 'profile', 'data');
        await setDoc(profileDoc, { salary: amount }, { merge: true });
    }

    async addExpense(category: ExpenseCategory, amount: number, description: string): Promise<void> {
        const user = await this.getCurrentUser();
        if (!user) return;
        const expensesCol = collection(this.firestore, 'users', user.uid, 'expenses');
        await addDoc(expensesCol, { category, amount, description, createdAt: new Date() });
    }

    async removeExpense(id: string): Promise<void> {
        const user = await this.getCurrentUser();
        if (!user) return;
        const expenseDoc = doc(this.firestore, 'users', user.uid, 'expenses', id);
        await deleteDoc(expenseDoc);
    }

    async saveAll(salary: number, expenses: { category: ExpenseCategory; amount: number; description: string }[]): Promise<void> {
        const user = await this.getCurrentUser();
        if (!user) return;

        await this.setSalary(salary);
        let totalExpenses = 0;
        for (const e of expenses) {
            await this.addExpense(e.category, e.amount, e.description);
            totalExpenses += e.amount;
        }

        const opsCol = collection(this.firestore, 'users', user.uid, 'operations');
        const details = expenses.length > 0
            ? expenses.map(e => `${e.category}: ${e.amount} XOF - ${e.description}`).join(' ; ')
            : 'Mise à jour du salaire uniquement';
        await addDoc(opsCol, {
            timestamp: new Date(),
            salary,
            expensesCount: expenses.length,
            totalExpenses,
            details
        });
    }

    getBudgetSummary(): Observable<BudgetSummary> {
        return combineLatest([this.salary$, this.expenses$]).pipe(
            map(([salary, expenses]) => ({
                salary,
                totalExpenses: expenses.reduce((sum, e) => sum + e.amount, 0),
                remainingBalance: salary - expenses.reduce((sum, e) => sum + e.amount, 0),
                expenses
            })),
            shareReplay(1)
        );
    }

    private async getCurrentUser(): Promise<any> {
        return firstValueFrom(this.authService.user$.pipe(take(1)));
    }
}
