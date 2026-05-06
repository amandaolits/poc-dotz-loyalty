import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  template: `
    <nav class="navbar">
      <div class="navbar-left">
        <a routerLink="/dashboard" class="logo">Dotz</a>
        <div class="nav-links">
          <a routerLink="/produtos" class="nav-link" [class.active]="isActive('/produtos')">Produtos</a>
          <a routerLink="/pedidos" class="nav-link" [class.active]="isActive('/pedidos')">Pedidos</a>
          <a routerLink="/enderecos" class="nav-link" [class.active]="isActive('/enderecos')">Endereços</a>
          <a routerLink="/extrato" class="nav-link" [class.active]="isActive('/extrato')">Extrato</a>
        </div>
      </div>
      <div class="navbar-right">
        @if (auth.usuario()) {
          <span class="user-email">{{ auth.usuario()!.email.split('@')[0] }}</span>
        }
        <button class="logout-btn" (click)="auth.logout()">Sair</button>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: var(--color-surface);
      padding: var(--space-md) var(--space-xl);
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--color-outline-variant);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .navbar-left {
      display: flex;
      align-items: center;
      gap: var(--space-xl);
    }
    .logo {
      color: var(--color-primary);
      font-size: 24px;
      font-weight: var(--font-weight-h1);
      text-decoration: none;
      white-space: nowrap;
    }
    .nav-links {
      display: flex;
      align-items: center;
      gap: var(--space-lg);
    }
    .nav-link {
      font-size: var(--font-size-label-bold);
      color: var(--color-on-surface-variant);
      text-decoration: none;
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-lg);
      transition: all var(--transition-fast);
      white-space: nowrap;
    }
    .nav-link:hover {
      background: var(--color-surface-container);
      color: var(--color-primary);
    }
    .nav-link.active {
      background: var(--color-primary-container);
      color: var(--color-primary);
      font-weight: 600;
    }
    .navbar-right {
      display: flex;
      align-items: center;
      gap: var(--space-lg);
    }
    .user-email {
      font-size: var(--font-size-body-md);
      color: var(--color-on-surface-variant);
    }
    .logout-btn {
      background: transparent;
      border: 1px solid var(--color-outline-variant);
      color: var(--color-on-surface-variant);
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-lg);
      cursor: pointer;
      font-size: var(--font-size-label-sm);
      font-weight: 600;
      transition: all var(--transition-fast);
      min-height: 36px;
    }
    .logout-btn:hover {
      background: var(--color-surface-container);
    }
  `]
})
export class NavbarComponent {
  auth = inject(AuthService);
  private router = inject(Router);

  isActive(route: string): boolean {
    return this.router.url.startsWith(route);
  }
}
