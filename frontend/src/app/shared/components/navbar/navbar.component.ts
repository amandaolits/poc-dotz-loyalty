import { Component, inject, input } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { IconComponent } from '../../icons';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, DecimalPipe, IconComponent],
  template: `
    <header class="navbar-header">
      <div class="navbar-container">
        <div class="navbar-left">
          <a routerLink="/dashboard" class="logo">Dotz</a>
          <nav class="nav-links">
            <a routerLink="/produtos" class="nav-link" [class.active]="isActive('/produtos')">Produtos</a>
            <a routerLink="/pedidos" class="nav-link" [class.active]="isActive('/pedidos')">Pedidos</a>
            <a routerLink="/enderecos" class="nav-link" [class.active]="isActive('/enderecos')">Endereços</a>
            <a routerLink="/extrato" class="nav-link" [class.active]="isActive('/extrato')">Extrato</a>
          </nav>
        </div>
        <div class="navbar-right">
          <div class="saldo-chip">
            <app-icon name="wallet" [size]="20" />
            <span class="saldo-text">{{ saldo() | number:'1.0-0' }} Dotz</span>
          </div>
          <button class="logout-btn" (click)="auth.logout()">Sair</button>
          <div class="avatar">
            {{ auth.usuario()?.email?.charAt(0)?.toUpperCase() || '?' }}
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .navbar-header {
      background: var(--color-surface);
      border-bottom: 1px solid var(--color-outline-variant);
      height: 64px;
      position: sticky;
      top: 0;
      z-index: 50;
    }
    .navbar-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 100%;
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 16px;
    }
    @media (min-width: 768px) {
      .navbar-container {
        padding: 0 32px;
      }
    }
    .navbar-left {
      display: flex;
      align-items: center;
      gap: 32px;
    }
    .logo {
      font-size: 24px;
      font-weight: 900;
      letter-spacing: -0.02em;
      color: var(--color-primary);
      text-decoration: none;
      white-space: nowrap;
    }
    .nav-links {
      display: none;
      align-items: center;
      gap: 24px;
    }
    @media (min-width: 768px) {
      .nav-links {
        display: flex;
      }
    }
    .nav-link {
      font-size: var(--font-size-label-bold);
      color: var(--color-on-surface-variant);
      text-decoration: none;
      font-weight: 500;
      transition: color 200ms ease;
      white-space: nowrap;
    }
    .nav-link:hover {
      color: var(--color-primary);
    }
    .nav-link.active {
      color: var(--color-primary);
      font-weight: 600;
    }
    .navbar-right {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .saldo-chip {
      display: flex;
      align-items: center;
      gap: 8px;
      background: var(--color-primary-fixed);
      color: var(--color-on-primary-fixed);
      padding: 6px 12px;
      border-radius: var(--radius-full);
    }
    .saldo-text {
      font-size: var(--font-size-label-bold);
      font-weight: var(--font-weight-label-bold);
    }
    .logout-btn {
      display: none;
      background: none;
      border: none;
      color: var(--color-on-surface-variant);
      font-size: var(--font-size-label-bold);
      font-weight: 500;
      cursor: pointer;
      padding: 0;
      transition: color 200ms ease;
    }
    .logout-btn:hover {
      color: var(--color-primary);
    }
    @media (min-width: 768px) {
      .logout-btn {
        display: block;
      }
    }
    .avatar {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-full);
      background: var(--color-surface-variant);
      overflow: hidden;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-on-surface-variant);
      font-size: var(--font-size-label-bold);
      font-weight: var(--font-weight-label-bold);
    }
  `]
})
export class NavbarComponent {
  auth = inject(AuthService);
  private router = inject(Router);
  saldo = input<number>(0);

  isActive(route: string): boolean {
    return this.router.url.startsWith(route);
  }
}
