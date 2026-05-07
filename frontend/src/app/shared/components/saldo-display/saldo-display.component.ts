import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-saldo-display',
  standalone: true,
  imports: [DecimalPipe, RouterLink],
  template: `
    <div class="saldo-card">
      <div class="saldo-left">
        <p class="label">{{ label() }}</p>
        <p class="value">{{ saldo() | number:'1.0-0' }} <span class="unit">{{ unit() }}</span></p>
        <p class="subtitle">{{ subtitle() }}</p>
      </div>
      @if (showButton()) {
        <a [routerLink]="buttonLink()" class="saldo-btn">{{ buttonText() }}</a>
      }
    </div>
  `,
  styles: [`
    .saldo-card {
      background: #F5F5F5;
      border-radius: var(--radius-xl);
      padding: var(--space-2xl);
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      gap: var(--space-lg);
    }
    .saldo-left {
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
    }
    .label {
      font-size: var(--font-size-body-md);
      color: var(--color-on-surface-variant);
    }
    .value {
      font-size: var(--font-size-hero, 48px);
      font-weight: var(--font-weight-h1);
      color: var(--color-primary);
      line-height: 1;
    }
    .unit {
      font-size: var(--font-size-h2);
      color: var(--color-on-surface-variant);
      font-weight: var(--font-weight-h2);
    }
    .subtitle {
      font-size: var(--font-size-label-sm);
      color: var(--color-on-surface-variant);
      max-width: 360px;
      line-height: var(--font-line-height-body-md);
    }
    .saldo-btn {
      display: inline-flex;
      align-items: center;
      background: var(--color-primary);
      color: var(--color-on-primary);
      padding: var(--space-sm) var(--space-lg);
      border-radius: var(--radius-full);
      text-decoration: none;
      font-size: var(--font-size-label-bold);
      font-weight: var(--font-weight-label-bold);
      white-space: nowrap;
      transition: opacity var(--transition-fast);
      flex-shrink: 0;
    }
    .saldo-btn:hover {
      opacity: 0.9;
    }
    @media (max-width: 767px) {
      .saldo-card {
        flex-direction: column;
        align-items: stretch;
        text-align: center;
      }
      .saldo-left {
        align-items: center;
      }
      .subtitle {
        max-width: 100%;
      }
      .saldo-btn {
        justify-content: center;
      }
    }
  `]
})
export class SaldoDisplayComponent {
  saldo = input<number>(0);
  label = input('Seu saldo');
  unit = input('Dotz');
  subtitle = input('Você tem pontos prontos para trocar por recompensas incríveis');
  showButton = input(true);
  buttonText = input('Trocar meus Dotz');
  buttonLink = input('/produtos');
}
