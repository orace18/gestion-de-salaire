import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-salary-input',
  imports: [CommonModule, FormsModule],
  templateUrl: './salary-input.html',
  styleUrl: './salary-input.scss'
})
export class SalaryInputComponent implements OnChanges, OnInit {
  @Input() salary: number = 0;
  @Output() salaryChange = new EventEmitter<number>();

  editingValue = '';

  ngOnInit() {
    this.editingValue = String(this.salary || '');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['salary']) {
      this.editingValue = String(this.salary || '');
    }
  }

  onInput(value: string) {
    this.editingValue = value;
    const numValue = parseFloat(value) || 0;
    this.salaryChange.emit(numValue);
  }

  get displayAmount(): number {
    return parseFloat(this.editingValue) || 0;
  }
}
