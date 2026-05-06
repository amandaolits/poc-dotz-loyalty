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
      background: rgba(0, 163, 109, 0.1);
      color: #059669;
    }
    .chip-processando,
    .chip-em_andamento {
      background: rgba(254, 243, 199, 0.1);
      color: #D97706;
    }
    .chip-cancelado,
    .chip-cancelado {
      background: rgba(254, 226, 226, 0.1);
      color: #DC2626;
    }
    .chip-pendente {
      background: rgba(219, 234, 254, 0.1);
      color: #2563EB;
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
