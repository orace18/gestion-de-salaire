import { Component, inject, signal, effect, viewChild, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { BudgetService } from '../../services/budget.service';
import { AiRecommendationService } from '../../services/ai-recommendation.service';
import { NavbarComponent } from '../../components/navbar/navbar';
import { SalaryInputComponent } from '../../components/salary-input/salary-input';
import { ExpenseListComponent } from '../../components/expense-list/expense-list';
import { RecommendationCardComponent } from '../../components/recommendation-card/recommendation-card';
import { AiRecommendation, ExpenseCategory, Operation } from '../../models/budget.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    SalaryInputComponent,
    ExpenseListComponent,
    RecommendationCardComponent
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent {
  private budgetService = inject(BudgetService);
  private aiService = inject(AiRecommendationService);

  expenseList = viewChild(ExpenseListComponent);

  budgetSummary = toSignal(this.budgetService.getBudgetSummary(), {
    initialValue: { salary: 0, totalExpenses: 0, remainingBalance: 0, expenses: [] as any[] }
  });
  operations = toSignal(this.budgetService.operations$, { initialValue: [] as Operation[] });

  loadingRecommendation = signal(false);
  recommendation = signal<AiRecommendation | null>(null);
  saveInProgress = signal(false);
  saveError = signal<string | null>(null);

  pendingSalary = signal(0);
  pendingExpenses = signal<{ category: ExpenseCategory; amount: number; description: string }[]>([]);

  displayExpenses = computed(() => {
    const saved = this.budgetSummary()?.expenses ?? [];
    const pending = this.pendingExpenses().map((p, i) => ({
      id: `pending-${i}`,
      category: p.category,
      amount: p.amount,
      description: p.description,
      createdAt: new Date(),
      isPending: true
    }));
    return [...saved.map(e => ({ ...e, isPending: false })), ...pending];
  });

  recommendationSummary = computed(() => {
    const salary = (this.pendingSalary() || this.budgetSummary()?.salary) ?? 0;
    const expenses = this.displayExpenses();
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const remainingBalance = salary - totalExpenses;
    return { salary, totalExpenses, remainingBalance, expenses };
  });

  constructor() {
    effect(() => {
      const summary = this.recommendationSummary();
      if (summary.salary > 0) {
        this.loadingRecommendation.set(true);
        this.aiService.getRecommendations(summary).then(rec => {
          this.recommendation.set(rec);
          this.loadingRecommendation.set(false);
        }).catch(err => {
          console.error('Error getting recommendations:', err);
          this.loadingRecommendation.set(false);
        });
      } else {
        this.recommendation.set(null);
      }
    });
    effect(() => {
      const s = this.budgetSummary()?.salary ?? 0;
      if (s > 0 && this.pendingExpenses().length === 0) {
        this.pendingSalary.set(s);
      }
    });
  }

  get salary(): number {
    return (this.pendingSalary() || this.budgetSummary()?.salary) ?? 0;
  }

  onSalaryInput(value: number) {
    this.pendingSalary.set(value);
  }

  onAddExpense(data: { category: ExpenseCategory, amount: number, description: string }) {
    this.saveError.set(null);
    this.pendingExpenses.update(list => [...list, data]);
    this.expenseList()?.resetForm();
  }

  onRemoveExpense(id: string) {
    if (id.startsWith('pending-')) {
      const idx = parseInt(id.replace('pending-', ''), 10);
      this.pendingExpenses.update(list => list.filter((_, i) => i !== idx));
    } else {
      this.budgetService.removeExpense(id);
    }
  }

  async onSaveAll() {
    this.saveError.set(null);
    this.saveInProgress.set(true);
    try {
      const salary = (this.pendingSalary() || this.budgetSummary()?.salary) ?? 0;
      const expenses = this.pendingExpenses();
      await this.budgetService.saveAll(salary, expenses);
      this.pendingExpenses.set([]);
      if (salary > 0) this.pendingSalary.set(salary);
    } catch (err: any) {
      this.saveError.set('Erreur : ' + (err?.message || String(err)));
      console.error('Erreur saveAll:', err);
    } finally {
      this.saveInProgress.set(false);
    }
  }
}
