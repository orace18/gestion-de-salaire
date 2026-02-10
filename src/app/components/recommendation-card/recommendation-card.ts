import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AiRecommendation } from '../../models/budget.model';

@Component({
  selector: 'app-recommendation-card',
  imports: [CommonModule],
  templateUrl: './recommendation-card.html',
  styleUrl: './recommendation-card.scss'
})
export class RecommendationCardComponent {
  @Input() recommendation: AiRecommendation | null = null;
  @Input() loading: boolean = false;
}
