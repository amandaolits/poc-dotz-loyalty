import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { PedidoService } from '../pedido.service';
import { Pedido } from '../../../shared/models';
import { FooterComponent, NavbarComponent, SkeletonComponent } from '../../../shared/components';
import { IconComponent } from '../../../shared/icons';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-pedidos-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FooterComponent, NavbarComponent, SkeletonComponent, IconComponent],
  template: `
    <app-navbar />
    <main class="pedidos-main">
      <div class="container">
        <header class="page-header">
          <h1 class="page-title">Meus Pedidos</h1>
          <p class="page-subtitle">Acompanhe o status de suas trocas de Dotz e compras recentes.</p>
        </header>

        @if (loading()) {
          <div class="grid-12">
            <aside class="sidebar">
              <div class="filter-card">
                <app-skeleton height="24px" width="80px" />
                <div class="filter-skeleton-buttons">
                  @for (i of [1,2,3]; track i) {
                    <app-skeleton height="40px" />
                  }
                </div>
              </div>
            </aside>
            <div class="main-content">
              @for (i of [1,2,3]; track i) {
                <app-skeleton height="120px" />
              }
            </div>
          </div>
        } @else if (pedidos().length === 0) {
          <div class="empty-state">
            <app-icon name="package" />
            <p>Nenhum pedido realizado</p>
          </div>
        } @else {
          <div class="grid-12">
            <aside class="sidebar">
              <div class="filter-card">
                <h3 class="filter-title">Filtrar</h3>
                <div class="filter-buttons">
                  <button class="filter-btn" [class.active]="filtroAtivo() === undefined" (click)="aplicarFiltro('todos')">Todos os Pedidos</button>
                  <button class="filter-btn" [class.active]="filtroAtivo() === '30d'" (click)="aplicarFiltro('30d')">Últimos 30 dias</button>
                  <button class="filter-btn" [class.active]="filtroAtivo() === '1y'" (click)="aplicarFiltro('1y')">Este ano</button>
                </div>
              </div>
            </aside>
            <div class="main-content">
              @for (pedido of pedidos(); track pedido.id) {
                <a [routerLink]="['/pedidos', pedido.id]" class="order-card-link">
                  <div class="order-card">
                    <div class="order-thumb">
                      <img [src]="pedido.produto_imagem" [alt]="pedido.produto_nome" />
                    </div>
                    <div class="order-body">
                      <div class="order-header">
                        <span class="order-name">{{ pedido.produto_nome }}</span>
                        <span class="status-chip"
                          [class.status-confirmado]="pedido.status === 'Confirmado' || pedido.status === 'Concluido'"
                          [class.status-transito]="pedido.status === 'Em trânsito'"
                          [class.status-entregue]="pedido.status === 'Entregue'"
                          [class.status-pendente]="pedido.status === 'Pendente'"
                          [class.status-cancelado]="pedido.status === 'Cancelado'">{{ pedido.status }}</span>
                      </div>
                      <p class="order-date">{{ pedido.data_pedido | date:'dd/MM/yyyy' }}</p>
                    </div>
                    <div class="order-right">
                      <span class="order-points">{{ pedido.pontos_gastos | number:'1.0-0' }} <span class="points-label">DZ</span></span>
                      <span class="order-detail-link">Ver Detalhes</span>
                    </div>
                  </div>
                </a>
              }
            </div>
          </div>
        }
      </div>
    </main>
    <app-footer />
  `,
  styles: [`
    .pedidos-main {
      padding-top: var(--space-xl);
      padding-bottom: var(--space-2xl);
    }
    .page-header {
      margin-bottom: var(--space-xl);
    }
    .page-title {
      font-size: var(--font-size-h1);
      font-weight: var(--font-weight-h1);
      line-height: var(--font-line-height-h1);
      letter-spacing: var(--font-letter-spacing-h1);
      color: var(--color-on-surface);
      margin-bottom: var(--space-sm);
    }
    .page-subtitle {
      font-size: var(--font-size-body-md);
      color: var(--color-on-surface-variant);
    }
    .grid-12 {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-lg);
    }
    @media (min-width: 1024px) {
      .grid-12 {
        grid-template-columns: repeat(12, 1fr);
      }
      .sidebar { grid-column: span 3; }
      .main-content { grid-column: span 9; }
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
    .filter-buttons, .filter-skeleton-buttons {
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
    }
    .filter-btn {
      width: 100%;
      text-align: left;
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-md);
      border: none;
      cursor: pointer;
      font-size: var(--font-size-body-md);
      font-family: var(--font-family);
      background: transparent;
      color: var(--color-on-surface-variant);
      transition: background var(--transition-fast);
    }
    .filter-btn:hover {
      background: var(--color-surface);
    }
    .filter-btn.active {
      background: var(--color-primary-fixed);
      color: var(--color-primary);
      font-weight: var(--font-weight-label-bold);
    }
    .order-card-link {
      text-decoration: none;
      color: inherit;
      display: block;
    }
    .order-card {
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);
      align-items: center;
      background: var(--color-surface-container-low);
      border-radius: var(--radius-xl);
      padding: var(--space-lg);
      border: 1px solid var(--color-outline-variant);
      box-shadow: var(--shadow-card);
      transition: box-shadow var(--transition-fast);
    }
    .order-card:hover {
      box-shadow: var(--shadow-card-hover);
    }
    @media (min-width: 768px) {
      .order-card {
        flex-direction: row;
      }
    }
    .order-thumb {
      width: 80px;
      height: 80px;
      background: var(--color-surface);
      border-radius: var(--radius-lg);
      flex-shrink: 0;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--color-outline-variant);
    }
    .order-thumb img {
      width: 80px;
      height: 80px;
      object-fit: contain;
    }
    .order-body {
      flex: 1;
      text-align: center;
    }
    @media (min-width: 768px) {
      .order-body {
        text-align: left;
      }
    }
    .order-header {
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
      align-items: center;
      margin-bottom: var(--space-xs);
    }
    @media (min-width: 768px) {
      .order-header {
        flex-direction: row;
        align-items: center;
      }
    }
    .order-name {
      font-size: var(--font-size-h3);
      font-weight: var(--font-weight-h3);
      color: var(--color-on-surface);
    }
    .order-date {
      font-size: var(--font-size-caption);
      color: var(--color-on-surface-variant);
      margin-top: var(--space-xs);
    }
    .order-right {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    @media (min-width: 768px) {
      .order-right {
        align-items: flex-end;
      }
    }
    .order-points {
      font-size: var(--font-size-h2);
      font-weight: var(--font-weight-h2);
      color: var(--color-primary);
    }
    .points-label {
      font-size: var(--font-size-body-md);
    }
    .order-detail-link {
      margin-top: var(--space-sm);
      font-size: var(--font-size-label-sm);
      font-weight: var(--font-weight-label-bold);
      color: var(--color-primary);
    }
    .order-detail-link:hover {
      text-decoration: underline;
    }
    .status-chip {
      display: inline-flex;
      align-items: center;
      padding: var(--space-xs) var(--space-md);
      border-radius: var(--radius-full);
      font-size: var(--font-size-label-sm);
      font-weight: var(--font-weight-label-bold);
      white-space: nowrap;
    }
    .status-confirmado, .status-concluido {
      background: rgba(40, 167, 69, 0.1);
      color: #28A745;
    }
    .status-transito {
      background: rgba(0, 98, 161, 0.1);
      color: var(--color-tertiary);
    }
    .status-entregue {
      background: rgba(88, 95, 108, 0.1);
      color: var(--color-secondary);
    }
    .status-pendente {
      background: rgba(37, 99, 235, 0.1);
      color: var(--color-info);
    }
    .status-cancelado {
      background: var(--color-error-container);
      color: var(--color-error);
    }
    .empty-state {
      text-align: center;
      padding: var(--space-2xl);
      color: var(--color-on-surface-variant);
    }
    .empty-state p {
      margin-top: var(--space-md);
      font-size: var(--font-size-body-lg);
    }
    .main-content {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }
  `]
})
export class ListComponent implements OnInit {
  private service = inject(PedidoService);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);
  pedidos = signal<Pedido[]>([]);
  loading = signal(true);
  filtroAtivo = signal<string | undefined>(undefined);
  private filterMap: Record<string, string | undefined> = {
    'todos': undefined,
    '30d': '30d',
    '1y': '1y'
  };

  ngOnInit(): void {
    if (this.route.snapshot.queryParamMap.get('success') === 'true') {
      this.toast.show('Resgate realizado com sucesso!', 'success');
    }
    this.carregar();
  }

  private carregar(): void {
    this.loading.set(true);
    const params = this.filtroAtivo() ? { periodo: this.filtroAtivo()! } : undefined;
    this.service.listar(params).subscribe({
      next: (pedidos) => { this.pedidos.set(pedidos); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  aplicarFiltro(key: string): void {
    this.filtroAtivo.set(this.filterMap[key]);
    this.carregar();
  }
}
