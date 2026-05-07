import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';
import { SaldoResponse } from '../../shared/models';
import { FooterComponent, NavbarComponent, SaldoDisplayComponent, CardComponent, SkeletonComponent } from '../../shared/components';
import { IconComponent } from '../../shared/icons';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FooterComponent, NavbarComponent, SaldoDisplayComponent, CardComponent, SkeletonComponent, IconComponent],
  template: `
    <app-navbar />
    <main class="container dashboard-main">
      <div class="welcome-section">
        @if (usuario()) {
          <h1 class="welcome-text">Olá, {{ usuario()!.email.split('@')[0] }}!</h1>
        }
      </div>

      @if (loading()) {
        <app-skeleton height="120px" class="saldo-skeleton" />
      } @else {
        <app-saldo-display [saldo]="saldo()" class="saldo-section" />
      }

      <div class="quick-actions">
        <h2 class="section-title">O que você quer fazer?</h2>
        <div class="actions-grid">
          <a routerLink="/produtos" class="action-card">
            <span class="action-icon"><app-icon name="shopping-cart" [size]="32" /></span>
            <span class="action-label">Produtos</span>
            <span class="action-desc">Resgate com seus pontos</span>
          </a>
          <a routerLink="/pedidos" class="action-card">
            <span class="action-icon"><app-icon name="package" [size]="32" /></span>
            <span class="action-label">Pedidos</span>
            <span class="action-desc">Acompanhe seus resgates</span>
          </a>
          <a routerLink="/extrato" class="action-card">
            <span class="action-icon"><app-icon name="list" [size]="32" /></span>
            <span class="action-label">Extrato</span>
            <span class="action-desc">Histórico de pontos</span>
          </a>
          <a routerLink="/enderecos" class="action-card">
            <span class="action-icon"><app-icon name="map-pin" [size]="32" /></span>
            <span class="action-label">Endereços</span>
            <span class="action-desc">Gerencie seus endereços</span>
          </a>
        </div>
      </div>
    </main>
    <app-footer />
  `,
  styles: [`
    .dashboard-main {
      padding-top: var(--space-xl);
      padding-bottom: var(--space-2xl);
    }
    .welcome-section {
      margin-bottom: var(--space-lg);
    }
    .welcome-text {
      font-size: var(--font-size-h1);
      font-weight: var(--font-weight-h1);
      color: var(--color-on-surface);
      line-height: var(--font-line-height-h1);
    }
    .saldo-section {
      margin-bottom: var(--space-xl);
    }
    .saldo-skeleton {
      max-width: 400px;
      border-radius: var(--radius-xl);
    }
    .section-title {
      font-size: var(--font-size-h2);
      font-weight: var(--font-weight-h2);
      color: var(--color-on-surface);
      margin-bottom: var(--space-lg);
    }
    .actions-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--space-lg);
    }
    @media (min-width: 768px) {
      .actions-grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }
    .action-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: var(--space-xl);
      background: var(--color-surface);
      border-radius: var(--radius-xl);
      text-decoration: none;
      color: var(--color-on-surface);
      border: 1px solid var(--color-outline-variant);
      transition: all var(--transition-fast);
      cursor: pointer;
    }
    .action-card:hover {
      box-shadow: var(--shadow-card-hover);
      transform: translateY(-2px);
    }
    .action-icon {
      font-size: 32px;
      margin-bottom: var(--space-sm);
    }
    .action-label {
      font-size: var(--font-size-h3);
      font-weight: var(--font-weight-h3);
      margin-bottom: var(--space-xs);
    }
    .action-desc {
      font-size: var(--font-size-label-sm);
      color: var(--color-on-surface-variant);
      text-align: center;
    }
  `]
})
export class DashboardComponent implements OnInit {
  auth = inject(AuthService);
  private api = inject(ApiService);
  usuario = this.auth.usuario;
  saldo = signal(0);
  loading = signal(true);

  ngOnInit(): void {
    this.api.get<SaldoResponse>('/saldo').subscribe({
      next: (r) => {
        this.saldo.set(r.saldo_pontos);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
