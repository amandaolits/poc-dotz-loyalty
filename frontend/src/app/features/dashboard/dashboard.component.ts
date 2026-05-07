import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';
import { SaldoResponse, Transacao } from '../../shared/models';
import { FooterComponent, NavbarComponent, SaldoDisplayComponent, SkeletonComponent } from '../../shared/components';
import { IconComponent } from '../../shared/icons';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FooterComponent, NavbarComponent, SaldoDisplayComponent, SkeletonComponent, IconComponent],
  template: `
    <app-navbar />
    <main class="container dashboard-main">
      <div class="welcome-section">
        @if (usuario()) {
          <h1 class="welcome-text">Olá, {{ (usuario()?.email?.split('@') ?? [''])[0] }}!</h1>
        }
      </div>

      @if (loading()) {
        <app-skeleton height="120px" class="saldo-skeleton" />
      } @else {
        <app-saldo-display [saldo]="saldo()" class="saldo-section" />
      }

      <div class="dashboard-grid">
        <div class="grid-main">
          <div class="quick-actions">
            <h2 class="section-title">O que você quer fazer?</h2>
            <div class="actions-grid">
              <a routerLink="/produtos" class="action-card">
                <span class="action-icon-circle circle-orange">
                  <app-icon name="shopping-bag" [size]="24" color="#FFFFFF" />
                </span>
                <span class="action-label">Produtos</span>
                <span class="action-desc">Resgate com seus pontos</span>
              </a>
              <a routerLink="/pedidos" class="action-card">
                <span class="action-icon-circle circle-blue">
                  <app-icon name="truck" [size]="24" color="#FFFFFF" />
                </span>
                <span class="action-label">Pedidos</span>
                <span class="action-desc">Acompanhe seus resgates</span>
              </a>
              <a routerLink="/extrato" class="action-card">
                <span class="action-icon-circle circle-purple">
                  <app-icon name="receipt" [size]="24" color="#FFFFFF" />
                </span>
                <span class="action-label">Extrato</span>
                <span class="action-desc">Histórico de pontos</span>
              </a>
              <a routerLink="/enderecos" class="action-card">
                <span class="action-icon-circle circle-green">
                  <app-icon name="map-pin" [size]="24" color="#FFFFFF" />
                </span>
                <span class="action-label">Endereços</span>
                <span class="action-desc">Gerencie seus endereços</span>
              </a>
            </div>
          </div>

          <div class="banner">
            <div class="banner-content">
              <h2 class="banner-title">Ganhe o dobro de Dotz em eletrônicos</h2>
              <p class="banner-desc">Promoção válida até o fim do mês em produtos selecionados</p>
              <a routerLink="/produtos" class="banner-cta">Aproveitar</a>
            </div>
          </div>
        </div>

        <aside class="grid-sidebar">
          <h2 class="section-title">Atividades Recentes</h2>
          @if (activitiesLoading()) {
            <div class="activity-skeleton">
              @for (_ of [1,2,3,4]; track $index) {
                <app-skeleton height="60px" />
              }
            </div>
          } @else if (recentActivities().length === 0) {
            <p class="empty-activities">Nenhuma atividade recente</p>
          } @else {
            <div class="activity-list">
              @for (item of recentActivities(); track item.id) {
                <div class="activity-item">
                  <div class="activity-icon" [class]="item.tipo === 'resgate' ? 'icon-resgate' : 'icon-ganho'">
                    @if (item.tipo === 'resgate') {
                      <app-icon name="shopping-cart" [size]="18" />
                    } @else {
                      <app-icon name="sparkles" [size]="18" />
                    }
                  </div>
                  <div class="activity-info">
                    <p class="activity-desc">{{ item.descricao }}</p>
                    <p class="activity-date">{{ item.data_criacao | date:'dd/MM/yyyy' }}</p>
                  </div>
                  <p class="activity-value" [class]="item.tipo === 'resgate' ? 'value-resgate' : 'value-ganho'">
                    {{ item.tipo === 'resgate' ? '-' : '+' }}{{ item.pontos | number:'1.0-0' }}
                  </p>
                </div>
              }
            </div>
            <a routerLink="/extrato" class="view-all">
              Ver tudo
              <app-icon name="arrow-right" [size]="16" />
            </a>
          }
        </aside>
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
      display: block;
      margin-bottom: var(--space-xl);
    }
    .saldo-skeleton {
      display: block;
      max-width: 100%;
      border-radius: var(--radius-xl);
      margin-bottom: var(--space-xl);
    }
    .dashboard-grid {
      display: flex;
      flex-direction: column;
      gap: var(--space-xl);
    }
    @media (min-width: 768px) {
      .dashboard-grid {
        flex-direction: row;
      }
      .grid-main {
        flex: 0 0 calc(66.666% - var(--space-lg));
        max-width: calc(66.666% - var(--space-lg));
      }
      .grid-sidebar {
        flex: 0 0 calc(33.333% - var(--space-lg));
        max-width: calc(33.333% - var(--space-lg));
      }
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
      gap: var(--space-md);
    }
    @media (min-width: 768px) {
      .actions-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    .action-card {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: var(--space-lg);
      background: #F5F5F5;
      border-radius: var(--radius-xl);
      text-decoration: none;
      color: var(--color-on-surface);
      transition: all var(--transition-fast);
      cursor: pointer;
      gap: var(--space-sm);
      border: none;
    }
    .action-card:hover {
      box-shadow: var(--shadow-card-hover);
      transform: translateY(-2px);
    }
    .action-icon-circle {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-bottom: var(--space-sm);
    }
    .circle-orange { background: var(--color-primary); }
    .circle-blue { background: #2563EB; }
    .circle-purple { background: #8B5CF6; }
    .circle-green { background: #059669; }
    .action-label {
      font-size: var(--font-size-h3);
      font-weight: var(--font-weight-h3);
    }
    .action-desc {
      font-size: var(--font-size-label-sm);
      color: var(--color-on-surface-variant);
    }
    .banner {
      background: linear-gradient(135deg, #FF6B00 0%, #FF8C38 100%);
      border-radius: var(--radius-xl);
      padding: var(--space-2xl);
      margin-top: var(--space-md);
    }
    .banner-content {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--space-sm);
    }
    .banner-title {
      font-size: var(--font-size-h2);
      font-weight: var(--font-weight-h1);
      color: #FFFFFF;
      line-height: var(--font-line-height-h2);
    }
    .banner-desc {
      font-size: var(--font-size-body-md);
      color: rgba(255,255,255,0.85);
      margin-bottom: var(--space-sm);
    }
    .banner-cta {
      display: inline-flex;
      align-items: center;
      background: #FFFFFF;
      color: var(--color-primary);
      padding: var(--space-sm) var(--space-lg);
      border-radius: var(--radius-full);
      text-decoration: none;
      font-size: var(--font-size-label-bold);
      font-weight: var(--font-weight-label-bold);
      transition: opacity var(--transition-fast);
    }
    .banner-cta:hover {
      opacity: 0.9;
    }
    .grid-sidebar {
      display: flex;
      flex-direction: column;
    }
    .activity-skeleton {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }
    .activity-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }
    .activity-item {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      padding: var(--space-sm) 0;
    }
    .activity-icon {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .icon-resgate {
      background: rgba(254, 226, 226, 0.3);
      color: var(--color-error);
    }
    .icon-ganho {
      background: rgba(0, 163, 109, 0.15);
      color: var(--color-success);
    }
    .activity-info {
      flex: 1;
      min-width: 0;
    }
    .activity-desc {
      font-size: var(--font-size-body-md);
      color: var(--color-on-surface);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .activity-date {
      font-size: var(--font-size-label-sm);
      color: var(--color-on-surface-variant);
      margin-top: 2px;
    }
    .activity-value {
      font-size: var(--font-size-label-bold);
      font-weight: var(--font-weight-label-bold);
      white-space: nowrap;
      flex-shrink: 0;
    }
    .value-resgate { color: var(--color-error); }
    .value-ganho { color: var(--color-success); }
    .view-all {
      display: inline-flex;
      align-items: center;
      gap: var(--space-xs);
      color: var(--color-primary);
      text-decoration: none;
      font-size: var(--font-size-label-bold);
      font-weight: var(--font-weight-label-bold);
      margin-top: var(--space-md);
    }
    .view-all:hover {
      text-decoration: underline;
    }
    .empty-activities {
      font-size: var(--font-size-body-md);
      color: var(--color-on-surface-variant);
      padding: var(--space-lg) 0;
    }
  `]
})
export class DashboardComponent implements OnInit {
  auth = inject(AuthService);
  private api = inject(ApiService);
  usuario = this.auth.usuario;
  saldo = signal(0);
  loading = signal(true);
  recentActivities = signal<Transacao[]>([]);
  activitiesLoading = signal(true);

  ngOnInit(): void {
    this.api.get<SaldoResponse>('/saldo').subscribe({
      next: (r) => {
        this.saldo.set(r.saldo_pontos);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
    this.api.get<{ transacoes: Transacao[] }>('/extrato', { limite: '5' }).subscribe({
      next: (r) => {
        this.recentActivities.set(r.transacoes);
        this.activitiesLoading.set(false);
      },
      error: () => this.activitiesLoading.set(false)
    });
  }
}
