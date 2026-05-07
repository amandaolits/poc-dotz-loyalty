import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PedidoService } from '../pedido.service';
import { Pedido } from '../../../shared/models';
import { FooterComponent, NavbarComponent, CardComponent, SkeletonComponent, EmptyStateComponent, StatusChipComponent } from '../../../shared/components';

@Component({
  selector: 'app-pedidos-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FooterComponent, NavbarComponent, CardComponent, SkeletonComponent, EmptyStateComponent, StatusChipComponent],
  template: `
    <app-navbar />
    <main class="container pedidos-main">
      <h1 class="page-title">Meus Pedidos</h1>

      @if (loading()) {
        <div class="pedidos-list">
          @for (i of [1,2,3]; track i) {
            <app-skeleton height="100px" />
          }
        </div>
      } @else if (pedidos().length === 0) {
        <app-empty-state message="Nenhum pedido realizado" />
      } @else {
        <div class="pedidos-list">
          @for (pedido of pedidos(); track pedido.id) {
            <a [routerLink]="['/pedidos', pedido.id]" class="pedido-link">
              <app-card class="pedido-card elevated">
                <div class="pedido-info">
                  <div>
                    <h3 class="pedido-produto">{{ pedido.produto_nome }}</h3>
                    <p class="pedido-date">{{ pedido.data_pedido | date:'dd/MM/yyyy' }}</p>
                  </div>
                  <div class="pedido-right">
                    <p class="pedido-points">{{ pedido.pontos_gastos | number:'1.0-0' }} Dotz</p>
                    <app-status-chip [status]="pedido.status" [label]="pedido.status" />
                  </div>
                </div>
              </app-card>
            </a>
          }
        </div>
      }
    </main>
    <app-footer />
  `,
  styles: [`
    .pedidos-main {
      padding-top: var(--space-xl);
      padding-bottom: var(--space-2xl);
    }
    .page-title {
      font-size: var(--font-size-h1);
      font-weight: var(--font-weight-h1);
      color: var(--color-on-surface);
      margin-bottom: var(--space-xl);
    }
    .pedidos-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }
    .pedido-link {
      text-decoration: none;
      color: inherit;
    }
    .pedido-card {
      transition: all var(--transition-fast);
    }
    .pedido-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--space-md);
    }
    .pedido-produto {
      font-size: var(--font-size-h3);
      font-weight: var(--font-weight-h3);
      color: var(--color-on-surface);
      margin-bottom: var(--space-xs);
    }
    .pedido-date {
      font-size: var(--font-size-label-sm);
      color: var(--color-on-surface-variant);
    }
    .pedido-right {
      text-align: right;
    }
    .pedido-points {
      font-size: var(--font-size-body-lg);
      font-weight: var(--font-weight-h2);
      color: var(--color-primary);
      margin-bottom: var(--space-xs);
    }
  `]
})
export class ListComponent implements OnInit {
  private service = inject(PedidoService);
  pedidos = signal<Pedido[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.service.listar().subscribe({
      next: (pedidos) => {
        this.pedidos.set(pedidos);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
