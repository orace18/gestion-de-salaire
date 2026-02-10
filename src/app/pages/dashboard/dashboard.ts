import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetService } from '../../services/budget.service';
import { AiRecommendationService } from '../../services/ai-recommendation.service';
import { NavbarComponent } from '../../components/navbar/navbar';
import { SalaryInputComponent } from '../../components/salary-input/salary-input';
import { ExpenseListComponent } from '../../components/expense-list/expense-list';
import { RecommendationCardComponent } from '../../components/recommendation-card/recommendation-card';
import { AiRecommendation, ExpenseCategory } from '../../models/budget.model';

@Component({
  selector: 'app-dashboard',
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
export class DashboardComponent implements OnInit {
  private budgetService = inject(BudgetService);
  private aiService = inject(AiRecommendationService);

  salary: number = 0;
  expenses: any[] = [];
  recommendation: AiRecommendation | null = null;
  loadingRecommendation = false;

  ngOnInit() {
    this.budgetService.salary$.subscribe(salary => {
      this.salary = salary;
      this.updateRecommendations();
    });

    this.budgetService.expenses$.subscribe(expenses => {
      this.expenses = expenses;
      this.updateRecommendations();
    });
  }

  onSalaryChange(amount: number) {
    this.budgetService.setSalary(amount);
  }

  onAddExpense(data: { category: ExpenseCategory, amount: number, description: string }) {
    this.budgetService.addExpense(data.category, data.amount, data.description);
  }

  onRemoveExpense(id: string) {
    this.budgetService.removeExpense(id);
  }

  async updateRecommendations() {
    if (this.salary > 0) {
      this.loadingRecommendation = true;
      const summary = this.budgetService.getBudgetSummary();

      try {
        this.recommendation = await this.aiService.getRecommendations(summary);
      } catch (error) {
        console.error('Error getting recommendations:', error);
      } finally {
        this.loadingRecommendation = false;
      }
    } else {
      this.recommendation = null;
    }
  }
}
