import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PedidoService } from '../pedido.service';
import { Pedido } from '../../../shared/models';
import { CardComponent, SkeletonComponent, StatusChipComponent, EmptyStateComponent } from '../../../shared/components';

@Component({
  selector: 'app-pedidos-list', standalone: true,
  imports: [CommonModule, RouterLink, CardComponent, SkeletonComponent, StatusChipComponent, EmptyStateComponent],
  template: `
    <div class="bar"><h1>Pedidos</h1></div>
    <div class="container">
      @if (loading()) { @for (i of [1,2,3]; track i) { <app-card style="margin-bottom:12px"><app-skeleton width="60%" height="16px"/></app-card> } }
      @else if (pedidos().length === 0) { <app-empty-state icon="📦" message="Nenhum pedido"/> }
      @else { @for (p of pedidos(); track p.id) { <app-card [clickable]="true" routerLink="/pedidos/{{ p.id }}" class="pedido">@if (p.produto_imagem) { <img [src]="p.produto_imagem" [alt]="p.produto_nome" class="img"/> }<div class="info"><h3>{{ p.produto_nome }}</h3><app-status-chip [status]="p.status"/><p class="pts">{{ p.pontos_gastos }} Dotz</p><p class="date">{{ p.data_pedido | date:'dd/MM/yyyy' }}</p></div></app-card> } }</div>`,
  styles: [`.bar { background: white; padding: 24px 32px; border-bottom: 1px solid #E5E7EB; } .container { padding: 32px 16px; } .pedido { display: flex; gap: 16px; margin-bottom: 12px; align-items: center; } .img { width: 80px; height: 80px; object-fit: cover; border-radius: 12px; } .info h3 { font-size: 16px; font-weight: 600; } .pts { color: #FF6B00; font-weight: 700; font-size: 14px; } .date { color: #9CA3AF; font-size: 12px; }`]
})
export class ListComponent implements OnInit {
  private service = inject(PedidoService);
  pedidos = signal<Pedido[]>([]); loading = signal(true);
  ngOnInit(): void { this.service.listar().subscribe({ next: (r) => { this.pedidos.set(r); this.loading.set(false); }, error: () => this.loading.set(false) }); }
}