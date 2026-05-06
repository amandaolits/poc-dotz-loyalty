import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="footer">
      <p class="footer-text">Dotz Loyalty POC • {{ currentYear }}</p>
    </footer>
  `,
  styles: [`
    .footer {
      background: var(--color-surface);
      border-top: 1px solid var(--color-outline-variant);
      padding: var(--space-lg) var(--space-xl);
      text-align: center;
      margin-top: var(--space-2xl);
    }
    .footer-text {
      font-size: var(--font-size-label-sm);
      color: var(--color-on-surface-variant);
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
