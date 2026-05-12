import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { ApiService } from '../../../core/services/api.service';
import { SaldoResponse } from '../../../shared/models';
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
          <button class="hamburger-btn" (click)="toggleMenu()" aria-label="Abrir menu" [class.active]="menuOpen()">
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
          </button>
        </div>
      </div>
    </header>

    @if (menuOpen()) {
      <div class="mobile-overlay" (click)="closeMenu()"></div>
      <nav class="mobile-menu" [class.open]="menuOpen()">
        <div class="mobile-menu__header">
          <div class="avatar avatar--large">
            {{ auth.usuario()?.email?.charAt(0)?.toUpperCase() || '?' }}
          </div>
          <span class="mobile-menu__email">{{ auth.usuario()?.email }}</span>
        </div>
        <div class="mobile-menu__links">
          <a routerLink="/produtos" class="mobile-menu__link" (click)="closeMenu()" [class.active]="isActive('/produtos')">
            <app-icon name="shopping-bag" [size]="20" />
            Produtos
          </a>
          <a routerLink="/pedidos" class="mobile-menu__link" (click)="closeMenu()" [class.active]="isActive('/pedidos')">
            <app-icon name="truck" [size]="20" />
            Pedidos
          </a>
          <a routerLink="/enderecos" class="mobile-menu__link" (click)="closeMenu()" [class.active]="isActive('/enderecos')">
            <app-icon name="map-pin" [size]="20" />
            Endereços
          </a>
          <a routerLink="/extrato" class="mobile-menu__link" (click)="closeMenu()" [class.active]="isActive('/extrato')">
            <app-icon name="receipt" [size]="20" />
            Extrato
          </a>
        </div>
        <div class="mobile-menu__footer">
          <button class="mobile-menu__logout" (click)="auth.logout()">
            <app-icon name="log-out" [size]="20" />
            Sair
          </button>
        </div>
      </nav>
    }
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
    .avatar--large {
      width: 48px;
      height: 48px;
      font-size: 20px;
    }
    .hamburger-btn {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 5px;
      width: 32px;
      height: 32px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      z-index: 60;
    }
    @media (min-width: 768px) {
      .hamburger-btn {
        display: none;
      }
    }
    .hamburger-line {
      display: block;
      width: 100%;
      height: 2px;
      background: var(--color-on-surface-variant);
      border-radius: 2px;
      transition: all 200ms;
    }
    .hamburger-btn.active .hamburger-line:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }
    .hamburger-btn.active .hamburger-line:nth-child(2) {
      opacity: 0;
    }
    .hamburger-btn.active .hamburger-line:nth-child(3) {
      transform: rotate(-45deg) translate(5px, -5px);
    }
    .mobile-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.4);
      z-index: 55;
    }
    .mobile-menu {
      position: fixed;
      top: 0;
      right: 0;
      width: 280px;
      height: 100vh;
      background: var(--color-surface);
      z-index: 56;
      display: flex;
      flex-direction: column;
      box-shadow: -4px 0 24px rgba(0,0,0,0.1);
    }
    .mobile-menu__header {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 32px 24px 24px;
      border-bottom: 1px solid var(--color-outline-variant);
    }
    .mobile-menu__email {
      font-size: var(--font-size-label-sm);
      color: var(--color-on-surface-variant);
    }
    .mobile-menu__links {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 8px;
    }
    .mobile-menu__link {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 16px;
      color: var(--color-on-surface);
      text-decoration: none;
      font-size: var(--font-size-body-md);
      font-weight: 500;
      border-radius: var(--radius-md);
      transition: all 150ms;
    }
    .mobile-menu__link:hover {
      background: var(--color-surface-container);
    }
    .mobile-menu__link.active {
      color: var(--color-primary);
      background: var(--color-primary-fixed);
    }
    .mobile-menu__footer {
      padding: 8px;
      border-top: 1px solid var(--color-outline-variant);
    }
    .mobile-menu__logout {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      padding: 14px 16px;
      background: none;
      border: none;
      color: var(--color-error);
      font-size: var(--font-size-body-md);
      font-weight: 500;
      cursor: pointer;
      border-radius: var(--radius-md);
      transition: all 150ms;
    }
    .mobile-menu__logout:hover {
      background: var(--color-error-container);
    }
  `]
})
export class NavbarComponent implements OnInit {
  auth = inject(AuthService);
  private router = inject(Router);
  private api = inject(ApiService);
  saldo = signal(0);
  currentYear = new Date().getFullYear();
  protected menuOpen = signal(false);

  ngOnInit(): void {
    this.api.get<SaldoResponse>('/saldo').subscribe({
      next: (r) => this.saldo.set(r.saldo_pontos)
    });
  }

  isActive(route: string): boolean {
    return this.router.url.startsWith(route);
  }

  protected toggleMenu(): void {
    this.menuOpen.update(v => !v);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }
}
