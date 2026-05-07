import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { Transacao } from '../../shared/models';
import { NavbarComponent, CardComponent, SkeletonComponent, EmptyStateComponent } from '../../shared/components';
import { IconComponent } from '../../shared/icons';

@Component({
  selector: 'app-extrato',
  standalone: true,
  imports: [CommonModule, NavbarComponent, CardComponent, SkeletonComponent, EmptyStateComponent, IconComponent],
  template: `
    <app-navbar />
    <main class="container extrato-main">
      <h1 class="page-title">Extrato de Pontos</h1>

      @if (loading()) {
        <div class="extrato-list">
          @for (i of [1,2,3,4,5]; track i) {
            <app-skeleton height="80px" />
          }
        </div>
      } @else if (transacoes().length === 0) {
        <app-empty-state message="Nenhuma transação encontrada" />
      } @else {
        <div class="extrato-list">
          @for (transacao of transacoes(); track transacao.id) {
            <app-card class="transacao-card">
              <div class="transacao-info">
                <div class="transacao-icon" [class]="'icon-' + transacao.tipo">
                  @if (transacao.tipo === 'resgate') {
                    <app-icon name="shopping-cart" [size]="24" />
                  } @else {
                    <app-icon name="sparkles" [size]="24" />
                  }
                </div>
                <div class="transacao-details">
                  <p class="transacao-desc">{{ transacao.descricao }}</p>
                  <p class="transacao-date">{{ transacao.data_criacao | date:'dd/MM/yyyy HH:mm' }}</p>
                </div>
              </div>
              <p class="transacao-value" [class]="'value-' + transacao.tipo">
                @if (transacao.tipo === 'resgate') {
                  -{{ transacao.pontos | number:'1.0-0' }}
                } @else {
                  +{{ transacao.pontos | number:'1.0-0' }}
                }
              </p>
            </app-card>
          }
        </div>
      }
    </main>
  `,
  styles: [`
    .extrato-main {
      padding-top: var(--space-xl);
      padding-bottom: var(--space-2xl);
    }
    .page-title {
      font-size: var(--font-size-h1);
      font-weight: var(--font-weight-h1);
      color: var(--color-on-surface);
      margin-bottom: var(--space-xl);
    }
    .extrato-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }
    .transacao-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-md) var(--space-lg);
    }
    .transacao-info {
      display: flex;
      align-items: center;
      gap: var(--space-md);
    }
    .transacao-icon {
      font-size: 24px;
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-lg);
    }
    .icon-resgate {
      background: rgba(254, 226, 226, 0.1);
    }
    .icon-ganho {
      background: rgba(0, 163, 109, 0.1);
    }
    .transacao-desc {
      font-size: var(--font-size-body-md);
      color: var(--color-on-surface);
      margin-bottom: var(--space-xs);
    }
    .transacao-date {
      font-size: var(--font-size-label-sm);
      color: var(--color-on-surface-variant);
    }
    .transacao-value {
      font-size: var(--font-size-h3);
      font-weight: var(--font-weight-h3);
    }
    .value-resgate {
      color: var(--color-error);
    }
    .value-ganho {
      color: var(--color-tertiary);
    }
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
