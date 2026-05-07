import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { Transacao } from '../../shared/models';
import { FooterComponent, NavbarComponent, SkeletonComponent } from '../../shared/components';
import { IconComponent } from '../../shared/icons';

@Component({
  selector: 'app-extrato',
  standalone: true,
  imports: [CommonModule, FooterComponent, NavbarComponent, SkeletonComponent, IconComponent],
  template: `
    <app-navbar />
    <main class="container extrato-main">
      <header class="page-header">
        <h1 class="page-title">Meu Extrato</h1>
        <p class="page-subtitle">Acompanhe seu histórico de ganhos e trocas de Dotz.</p>
      </header>

      <div class="grid-12">
        <aside class="sidebar">
          <div class="filter-card">
            <h3 class="filter-title">Filtros de Período</h3>
            <div class="filter-buttons">
              <button class="filter-btn active">Último mês</button>
              <button class="filter-btn">3 meses</button>
              <button class="filter-btn">Personalizado</button>
            </div>
          </div>
        </aside>

        <section class="main-content">
          <div class="transactions-card">
            @if (loading()) {
              <div class="transactions-list">
                @for (i of [1,2,3,4,5]; track i) {
                  <div class="transaction-row">
                    <div class="tx-icon-skeleton">
                      <app-skeleton height="48px" width="48px" />
                    </div>
                    <div class="tx-info-skeleton">
                      <app-skeleton height="16px" width="200px" />
                      <app-skeleton height="12px" width="140px" />
                    </div>
                    <div class="tx-date-skeleton">
                      <app-skeleton height="16px" width="100px" />
                    </div>
                    <div class="tx-points-skeleton">
                      <app-skeleton height="20px" width="80px" />
                    </div>
                  </div>
                }
              </div>
            } @else if (transacoes().length === 0) {
              <div class="empty-state">
                <p>Nenhuma transação encontrada</p>
              </div>
            } @else {
              <div class="table-header">
                <div class="th-icon"></div>
                <div class="th-desc">Descrição e Tipo</div>
                <div class="th-date">Data</div>
                <div class="th-points">Pontos</div>
              </div>

              <div class="transactions-list">
                @for (transacao of transacoes(); track transacao.id) {
                  <div class="transaction-row">
                    <div class="tx-icon" [class.icon-resgate]="transacao.tipo === 'resgate'" [class.icon-ganho]="transacao.tipo === 'ganho'">
                      @if (transacao.tipo === 'resgate') {
                        <app-icon name="shopping-cart" [size]="20" />
                      } @else {
                        <app-icon name="trending-up" [size]="20" />
                      }
                    </div>
                    <div class="tx-info">
                      <span class="tx-desc">{{ transacao.descricao }}</span>
                      <span class="tx-type">{{ transacao.tipo === 'resgate' ? 'Resgate' : 'Ganho' }}</span>
                    </div>
                    <div class="tx-date">{{ transacao.data_criacao | date:'dd/MM/yyyy HH:mm' }}</div>
                    <div class="tx-points" [class.points-resgate]="transacao.tipo === 'resgate'" [class.points-ganho]="transacao.tipo === 'ganho'">
                      @if (transacao.tipo === 'resgate') {
                        -{{ transacao.pontos | number:'1.0-0' }}
                      } @else {
                        +{{ transacao.pontos | number:'1.0-0' }}
                      }
                    </div>
                  </div>
                }
              </div>

              <div class="table-footer">
                <span class="footer-info">Mostrando {{ transacoes().length }} transações</span>
                <div class="pagination-btns">
                  <button class="pagination-btn" disabled>
                    <app-icon name="chevron-left" [size]="20" />
                  </button>
                  <button class="pagination-btn">
                    <app-icon name="chevron-right" [size]="20" />
                  </button>
                </div>
              </div>
            }
          </div>
        </section>
      </div>
    </main>
    <app-footer />
  `,
  styles: [`
    .extrato-main { padding-top: var(--space-xl); padding-bottom: var(--space-2xl); }
    .page-header { margin-bottom: var(--space-xl); }
    .page-title {
      font-size: var(--font-size-h1);
      font-weight: var(--font-weight-h1);
      line-height: var(--font-line-height-h1);
      letter-spacing: var(--font-letter-spacing-h1);
      color: var(--color-on-surface);
      margin-bottom: var(--space-sm);
    }
    .page-subtitle { font-size: var(--font-size-body-md); color: var(--color-on-surface-variant); }
    .grid-12 { display: grid; grid-template-columns: 1fr; gap: var(--space-lg); }
    @media (min-width: 1024px) {
      .grid-12 { grid-template-columns: repeat(12, 1fr); }
      .sidebar { grid-column: span 4; }
      .main-content { grid-column: span 8; }
    }
    .filter-card {
      background: var(--color-surface-container-low);
      border-radius: var(--radius-xl);
      padding: var(--space-lg);
      border: 1px solid var(--color-outline-variant);
      box-shadow: var(--shadow-card);
    }
    .filter-title {
      font-size: var(--font-size-h3);
      font-weight: var(--font-weight-h3);
      color: var(--color-on-surface);
      margin-bottom: var(--space-md);
    }
    .filter-buttons { display: flex; flex-direction: column; gap: var(--space-sm); }
    .filter-btn {
      width: 100%; text-align: left; padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-md); border: none; cursor: pointer;
      font-size: var(--font-size-body-md); font-family: var(--font-family);
      background: transparent; color: var(--color-on-surface-variant);
      transition: background var(--transition-fast);
    }
    .filter-btn:hover { background: var(--color-surface); }
    .filter-btn.active {
      background: var(--color-primary-fixed); color: var(--color-primary);
      font-weight: var(--font-weight-label-bold);
    }
    .transactions-card {
      background: var(--color-surface-container-low);
      border-radius: var(--radius-xl);
      border: 1px solid var(--color-outline-variant);
      box-shadow: var(--shadow-card);
      overflow: hidden;
    }
    .table-header { display: none; }
    @media (min-width: 768px) {
      .table-header {
        display: grid;
        grid-template-columns: auto 1fr auto auto;
        align-items: center;
        padding: var(--space-md) var(--space-xl);
        background: var(--color-surface-container);
        border-bottom: 1px solid var(--color-outline-variant);
        font-size: var(--font-size-label-sm);
        font-weight: var(--font-weight-label-bold);
        color: var(--color-on-surface-variant);
      }
    }
    .th-icon { width: 48px; }
    .th-date, .tx-date { text-align: right; padding: 0 var(--space-lg); }
    .th-points, .tx-points { text-align: right; width: 120px; }
    .transactions-list > * + * { border-top: 1px solid var(--color-outline-variant); }
    .transaction-row {
      display: grid;
      grid-template-columns: auto 1fr auto auto;
      align-items: center;
      padding: var(--space-lg) var(--space-xl);
      transition: background var(--transition-fast);
    }
    .transaction-row:hover { background: var(--color-surface); }
    .tx-icon {
      width: 48px; height: 48px; border-radius: var(--radius-full);
      display: flex; align-items: center; justify-content: center;
      margin-right: var(--space-md); flex-shrink: 0;
    }
    .icon-resgate { background: var(--color-error-container); color: var(--color-error); }
    .icon-ganho { background: rgba(0, 163, 109, 0.1); color: rgb(0, 163, 109); }
    .tx-info { display: flex; flex-direction: column; }
    .tx-desc {
      font-size: var(--font-size-body-md); font-weight: var(--font-weight-label-bold);
      color: var(--color-on-surface);
    }
    .transaction-row:hover .tx-desc { color: var(--color-primary); }
    .tx-type { font-size: var(--font-size-label-sm); color: var(--color-on-surface-variant); }
    .tx-date { display: none; }
    @media (min-width: 768px) { .tx-date { display: block; } }
    .points-resgate { color: var(--color-error); }
    .points-ganho { color: rgb(0, 163, 109); }
    .table-footer {
      display: flex; justify-content: space-between; align-items: center;
      padding: var(--space-md) var(--space-xl);
      background: var(--color-surface-container);
      border-top: 1px solid var(--color-outline-variant);
    }
    .footer-info { font-size: var(--font-size-label-sm); color: var(--color-on-surface-variant); }
    .pagination-btns { display: flex; gap: var(--space-xs); }
    .pagination-btn {
      padding: var(--space-xs); border-radius: var(--radius-sm); border: none;
      background: transparent; cursor: pointer; color: var(--color-on-surface-variant);
      transition: background var(--transition-fast);
      display: flex; align-items: center; justify-content: center;
    }
    .pagination-btn:hover:not(:disabled) { background: var(--color-surface-variant); }
    .pagination-btn:disabled { opacity: 0.5; cursor: default; }
    .empty-state { text-align: center; padding: var(--space-2xl); color: var(--color-on-surface-variant); }
    .tx-icon-skeleton, .tx-info-skeleton, .tx-date-skeleton, .tx-points-skeleton { display: flex; flex-direction: column; gap: var(--space-sm); }
    .tx-info-skeleton { flex: 1; }
  `]
})
export class ExtratoComponent implements OnInit {
  private api = inject(ApiService);
  transacoes = signal<Transacao[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.api.get<{ transacoes: Transacao[] }>('/extrato').subscribe({
      next: (r) => {
        this.transacoes.set(r.transacoes);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
