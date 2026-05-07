import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-left">
          <a routerLink="/dashboard" class="footer-logo">Dotz</a>
          <p class="footer-text">Programa de fidelidade • {{ currentYear }}</p>
        </div>
        <div class="footer-links">
          <a routerLink="/produtos" class="footer-link">Produtos</a>
          <a routerLink="/pedidos" class="footer-link">Pedidos</a>
          <a routerLink="/enderecos" class="footer-link">Endereços</a>
          <a routerLink="/extrato" class="footer-link">Extrato</a>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: #F5F5F5;
      border-top: 1px solid var(--color-outline-variant);
      padding: var(--space-xl) var(--space-margin-mobile);
      margin-top: var(--space-2xl);
    }
    @media (min-width: 768px) {
      .footer {
        padding: var(--space-xl) var(--space-margin-desktop);
      }
    }
    .footer-container {
      max-width: 1280px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
      align-items: center;
      text-align: center;
    }
    @media (min-width: 768px) {
      .footer-container {
        flex-direction: row;
        justify-content: space-between;
        text-align: left;
      }
    }
    .footer-left {
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
    }
    .footer-logo {
      font-size: var(--font-size-h3);
      font-weight: 900;
      letter-spacing: -0.02em;
      color: var(--color-primary);
      text-decoration: none;
    }
    .footer-text {
      font-size: var(--font-size-label-sm);
      color: var(--color-on-surface-variant);
    }
    .footer-links {
      display: flex;
      gap: var(--space-lg);
      flex-wrap: wrap;
      justify-content: center;
    }
    .footer-link {
      font-size: var(--font-size-label-sm);
      color: var(--color-on-surface-variant);
      text-decoration: none;
      transition: color var(--transition-fast);
    }
    .footer-link:hover {
      color: var(--color-primary);
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
