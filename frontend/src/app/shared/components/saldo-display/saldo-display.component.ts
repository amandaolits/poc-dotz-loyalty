import { Component, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-saldo-display',
  standalone: true,
  imports: [DecimalPipe],
  template: `
    <div class="saldo-card">
      <p class="label">{{ label() }}</p>
      <p class="value">{{ saldo() | number:'1.0-0' }} <span class="unit">{{ unit() }}</span></p>
    </div>
  `,
  styles: [`
    .saldo-card {
      background: var(--color-surface);
      border-radius: var(--radius-xl);
      padding: var(--space-2xl);
      text-align: center;
      box-shadow: var(--shadow-card);
      border: 1px solid var(--color-outline-variant);
    }
    .label {
      font-size: var(--font-size-body-md);
      color: var(--color-on-surface-variant);
      margin-bottom: var(--space-sm);
    }
    .value {
      font-size: var(--font-size-hero, 48px);
      font-weight: var(--font-weight-h1);
      color: var(--color-primary);
      line-height: var(--font-line-height-h1);
    }
    .unit {
      font-size: var(--font-size-h2);
      color: var(--color-on-surface-variant);
      font-weight: var(--font-weight-h2);
    }
  `]
})
export class SaldoDisplayComponent {
  saldo = input<number>(0);
  label = input('Seu saldo');
  unit = input('Dotz');
}
