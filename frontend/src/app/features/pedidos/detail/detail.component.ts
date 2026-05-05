import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PedidoService } from '../pedido.service';
import { Pedido } from '../../../shared/models';
import { CardComponent, StatusChipComponent, SkeletonComponent } from '../../../shared/components';

@Component({
  selector: 'app-pedidos-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, CardComponent, StatusChipComponent, SkeletonComponent],
  template: `
    <div class="container"><a routerLink="/pedidos" class="back">← Voltar</a>
      @if (loading()) { <app-skeleton width="100%" height="200px"/> } @else if (pedido()) {
        <app-card class="detail">
          @if (pedido()!.produto_imagem) { <img [src]="pedido()!.produto_imagem" [alt]="pedido()!.produto_nome" class="img"/> }
          <h1>{{ pedido()!.produto_nome }}</h1><app-status-chip [status]="pedido()!.status"/>
          <p class="pts">{{ pedido()!.pontos_gastos }} Dotz gastos</p><p class="date">{{ pedido()!.data_pedido | date:'dd/MM/yyyy HH:mm' }}</p>
          <h2>Endereço de entrega</h2><p>{{ pedido()!.logradouro }}, {{ pedido()!.numero }}</p><p>{{ pedido()!.bairro }} - {{ pedido()!.cidade }}, {{ pedido()!.estado }}</p><p>CEP: {{ pedido()!.cep }}</p>@if (pedido()!.complemento) { <p>{{ pedido()!.complemento }}</p> }
        </app-card>
      }</div>`,
  styles: [`.container { max-width: 600px; margin: 0 auto; padding: 32px 16px; } .back { color: #FF6B00; text-decoration: none; font-weight: 600; } .detail { margin-top: 24px; } .img { width: 100%; max-height: 300px; object-fit: cover; border-radius: 16px; margin-bottom: 16px; } h1 { font-size: 24px; font-weight: 700; } .pts { color: #FF6B00; font-weight: 700; font-size: 20px; margin-top: 12px; } .date { color: #9CA3AF; font-size: 14px; } h2 { font-size: 18px; font-weight: 600; margin-top: 24px; margin-bottom: 8px; }`]
})
export class DetailComponent implements OnInit {
  private route = inject(ActivatedRoute); private service = inject(PedidoService);
  pedido = signal<Pedido | null>(null); loading = signal(true);
  ngOnInit(): void { const id = this.route.snapshot.paramMap.get('id'); if (!id) return; this.service.buscarPorId(id).subscribe({ next: (p) => { this.pedido.set(p); this.loading.set(false); }, error: () => this.loading.set(false) }); }
}