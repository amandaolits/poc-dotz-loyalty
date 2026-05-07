import { Component, input } from '@angular/core';

@Component({
  selector: 'app-status-chip',
  standalone: true,
  template: `<span class="chip" [class]="'chip-' + status().toLowerCase()">{{ label() }}</span>`,
  styles: [`
    .chip {
      display: inline-flex;
      align-items: center;
      padding: var(--space-xs) var(--space-md);
      border-radius: var(--radius-full);
      font-size: var(--font-size-label-sm);
      font-weight: var(--font-weight-label-sm);
      line-height: var(--font-line-height-label-sm);
      letter-spacing: var(--font-letter-spacing-label-sm);
    }
    .chip-confirmado,
    .chip-concluido {
      background: var(--color-success-container);
      color: var(--color-success);
    }
    .chip-processando,
    .chip-em_andamento {
      background: var(--color-warning-container);
      color: var(--color-warning);
    }
    .chip-cancelado {
      background: var(--color-error-container);
      color: var(--color-error);
    }
    .chip-pendente {
      background: var(--color-info-container);
      color: var(--color-info);
    }
    .chip-enviado {
      background: rgba(147, 197, 253, 0.1);
      color: #1D4ED8;
    }
  `]
})
export class StatusChipComponent {
  status = input<string>('Confirmado');
  label = input('');
}
