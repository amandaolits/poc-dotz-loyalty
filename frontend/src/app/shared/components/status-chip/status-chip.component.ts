import { Component, input } from '@angular/core';

@Component({
  selector: 'app-status-chip', standalone: true,
  template: `<span class="chip chip-{{ status() }}">{{ label() }}</span>`,
  styles: [`.chip { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; } .chip-confirmed { background: #D1FAE; color: #059669; } .chip-processing { background: #FEF3C7; color: #D97706; } .chip-cancelled { background: #FEE2E2; color: #DC2626; }`]
})
export class StatusChipComponent {
  status = input<'Confirmado' | 'Processando' | 'Cancelado'>('Confirmado');
  label = input('');
}
