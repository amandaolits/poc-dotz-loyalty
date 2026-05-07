import { Component, input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  template: `<div class="card" [class.clickable]="clickable()" [class.elevated]="variant() === 'elevated'" [class.outlined]="variant() === 'outlined'" [class.filled]="variant() === 'filled'" [class.pad-sm]="padding() === 'sm'" [class.pad-md]="padding() === 'md'"><ng-content></ng-content></div>`,
  styles: [`
    .card {
      background: var(--color-surface);
      border-radius: var(--radius-xl);
      padding: var(--space-lg);
      border: 1px solid var(--color-outline-variant);
      transition: all var(--transition-fast);
    }
    .card.clickable {
      cursor: pointer;
    }
    .card.clickable:hover {
      box-shadow: var(--shadow-card-hover);
      transform: translateY(-2px);
    }
    .card.elevated {
      box-shadow: var(--shadow-card);
      border: none;
    }
    .card.outlined {
      border: 1px solid var(--color-outline);
      box-shadow: none;
    }
    .card.filled {
      background: var(--color-surface-container);
      border: none;
    }
    .card.pad-sm { padding: var(--space-md); }
    .card.pad-md { padding: var(--space-md) var(--space-lg); }
  `]
})
export class CardComponent {
  clickable = input(false);
  variant = input<'default' | 'elevated' | 'outlined' | 'filled'>('default');
  padding = input<'sm' | 'md' | 'lg'>('lg');
}
