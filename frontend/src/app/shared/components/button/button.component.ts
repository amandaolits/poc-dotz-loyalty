import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `<button [type]="type()" [class]="buttonClass()" [disabled]="disabled()" (click)="clicked.emit($event)"><ng-content></ng-content></button>`,
  styles: [`
    :host {
      display: inline-block;
    }
    button {
      font-family: var(--font-family);
      font-weight: 600;
      border: none;
      cursor: pointer;
      transition: all var(--transition-fast);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-sm);
      min-height: 44px;
    }
    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .btn-primary {
      background: var(--color-primary);
      color: var(--color-on-primary);
      border-radius: var(--radius-lg);
    }
    .btn-primary:hover:not(:disabled) {
      background: #e55f00;
      box-shadow: var(--shadow-card);
    }
    .btn-secondary {
      background: transparent;
      color: var(--color-secondary);
      border: 1px solid var(--color-outline-variant);
      border-radius: var(--radius-lg);
    }
    .btn-secondary:hover:not(:disabled) {
      background: var(--color-surface-container);
    }
    .btn-text {
      background: transparent;
      color: var(--color-primary);
      border-radius: var(--radius-lg);
    }
    .btn-text:hover:not(:disabled) {
      background: var(--color-primary-container);
    }
    .btn-sm {
      padding: var(--space-sm) var(--space-md);
      font-size: var(--font-size-label-sm);
    }
    .btn-md {
      padding: var(--space-md) var(--space-lg);
      font-size: var(--font-size-body-md);
    }
    .btn-lg {
      padding: var(--space-lg) var(--space-xl);
      font-size: var(--font-size-body-lg);
    }
  `]
})
export class ButtonComponent {
  type = input<'button' | 'submit'>('button');
  variant = input<'primary' | 'secondary' | 'text'>('primary');
  size = input<'sm' | 'md' | 'lg'>('md');
  disabled = input(false);
  clicked = output<MouseEvent>();
  buttonClass(): string {
    return `btn-${this.variant()} btn-${this.size()}`;
  }
}
