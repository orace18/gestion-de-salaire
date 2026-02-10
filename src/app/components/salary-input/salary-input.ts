import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-salary-input',
  imports: [CommonModule, FormsModule],
  templateUrl: './salary-input.html',
  styleUrl: './salary-input.scss'
})
export class SalaryInputComponent {
  @Input() salary: number = 0;
  @Output() salaryChange = new EventEmitter<number>();

  onSalaryChange(value: string) {
    const numValue = parseFloat(value) || 0;
    this.salaryChange.emit(numValue);
  }
}
