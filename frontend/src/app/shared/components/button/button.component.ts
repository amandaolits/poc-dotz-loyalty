import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-button', standalone: true,
  template: `<button [type]="type()" [class]="buttonClass()" [disabled]="disabled()" (click)="clicked.emit($event)"><ng-content></ng-content></button>`,
  styles: [`.btn-primary { background: #FF6B00; color: white; border: none; padding: 12px 24px; border-radius: 12px; font-weight: 600; cursor: pointer; } .btn-primary:hover:not(:disabled) { background: #e55f00; } .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; } .btn-secondary { background: transparent; color: #6B7280; border: 1px solid #E5E7EB; padding: 12px 24px; border-radius: 12px; font-weight: 600; cursor: pointer; } .btn-sm { padding: 8px 16px; font-size: 14px; }`]
})
export class ButtonComponent {
  type = input<'button' | 'submit'>('button');
  variant = input<'primary' | 'secondary'>('primary');
  size = input<'sm' | 'md'>('md');
  disabled = input(false);
  clicked = output<MouseEvent>();
  buttonClass(): string { return `btn-${this.variant()} ${this.size() === 'sm' ? 'btn-sm' : ''}`; }
}
