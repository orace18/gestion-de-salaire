import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Expense, ExpenseCategory } from '../../models/budget.model';

@Component({
  selector: 'app-expense-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './expense-list.html',
  styleUrl: './expense-list.scss'
})
export class ExpenseListComponent {
  @Input() expenses: (Expense & { isPending?: boolean })[] = [];
  @Output() addExpense = new EventEmitter<{ category: ExpenseCategory, amount: number, description: string }>();
  @Output() removeExpense = new EventEmitter<string>();

  categories = Object.values(ExpenseCategory);
  selectedCategory = ExpenseCategory.OTHER;
  amount: number = 0;
  description: string = '';

  onAddExpense() {
    if (this.amount > 0 && this.description.trim()) {
      this.addExpense.emit({
        category: this.selectedCategory,
        amount: this.amount,
        description: this.description
      });
    }
  }

  resetForm() {
    this.amount = 0;
    this.description = '';
    this.selectedCategory = ExpenseCategory.OTHER;
  }

  onRemoveExpense(id: string) {
    this.removeExpense.emit(id);
  }

  getCategoryIcon(category: ExpenseCategory): string {
    const icons: Record<ExpenseCategory, string> = {
      [ExpenseCategory.HOUSING]: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
      [ExpenseCategory.TRANSPORT]: 'M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h2m7-10a2 2 0 11-4 0 2 2 0 014 0z',
      [ExpenseCategory.FOOD]: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z',
      [ExpenseCategory.SUPPLIES]: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
      [ExpenseCategory.TITHE]: 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7',
      [ExpenseCategory.CLOTHING]: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
      [ExpenseCategory.HEALTH]: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
      [ExpenseCategory.BILLS]: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      [ExpenseCategory.SUBSCRIPTIONS]: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
      [ExpenseCategory.OTHER]: 'M12 6v6m0 0v6m0-6h6m-6 0H6'
    };
    return icons[category];
  }
}
