import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PedidoService } from '../pedido.service';
import { Pedido } from '../../../shared/models';
import { NavbarComponent, FooterComponent, CardComponent, StatusChipComponent, SkeletonComponent } from '../../../shared/components';
import { IconComponent } from '../../../shared/icons';

@Component({
  selector: 'app-pedidos-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, FooterComponent, CardComponent, StatusChipComponent, SkeletonComponent, IconComponent],
  template: `
    <app-navbar />
    <main class="container detail-main">
      <a routerLink="/pedidos" class="back-link">
        <app-icon name="arrow-left" [size]="16" /> Voltar
      </a>
      @if (loading()) {
        <app-skeleton height="300px" />
      } @else if (pedido()) {
        <app-card class="detail-card elevated">
          @if (pedido()!.produto_imagem) {
            <img [src]="pedido()!.produto_imagem" [alt]="pedido()!.produto_nome" class="detail-img" />
          }
          <div class="detail-header">
            <h1 class="detail-title">{{ pedido()!.produto_nome }}</h1>
            <app-status-chip [status]="pedido()!.status" />
          </div>
          <div class="detail-points">
            <p class="points-value">{{ pedido()!.pontos_gastos | number:'1.0-0' }} <span class="points-unit">Dotz</span></p>
            <p class="points-label">gastos neste pedido</p>
          </div>
          <p class="detail-date">{{ pedido()!.data_pedido | date:'dd/MM/yyyy HH:mm' }}</p>

          <h2 class="section-title">Endereço de entrega</h2>
          <div class="address-box">
            <p class="address-line">{{ pedido()!.logradouro }}, {{ pedido()!.numero }}</p>
            @if (pedido()!.complemento) {
              <p class="address-line">{{ pedido()!.complemento }}</p>
            }
            <p class="address-line">{{ pedido()!.bairro }} - {{ pedido()!.cidade }}, {{ pedido()!.estado }}</p>
            <p class="address-line">CEP: {{ pedido()!.cep }}</p>
          </div>
        </app-card>
      }
    </main>
    <app-footer />
  `,
  styles: [`
    .detail-main { padding-top: var(--space-xl); padding-bottom: var(--space-2xl); }
    .back-link { display: inline-flex; align-items: center; gap: var(--space-sm); color: var(--color-primary); text-decoration: none; font-weight: var(--font-weight-label-bold); margin-bottom: var(--space-lg); }
    .back-link:hover { text-decoration: underline; }
    .detail-card { max-width: 600px; }
    .detail-img { width: 100%; max-height: 300px; object-fit: cover; border-radius: var(--radius-lg); margin-bottom: var(--space-lg); }
    .detail-header { display: flex; justify-content: space-between; align-items: flex-start; gap: var(--space-md); margin-bottom: var(--space-md); }
    .detail-title { font-size: var(--font-size-h2); font-weight: var(--font-weight-h2); color: var(--color-on-surface); line-height: var(--font-line-height-h2); }
    .detail-points { padding: var(--space-md); background: var(--color-surface-container); border-radius: var(--radius-lg); margin-bottom: var(--space-md); }
    .points-value { font-size: var(--font-size-h2); font-weight: var(--font-weight-h1); color: var(--color-primary); }
    .points-unit { font-size: var(--font-size-body-md); color: var(--color-on-surface-variant); }
    .points-label { font-size: var(--font-size-label-sm); color: var(--color-on-surface-variant); margin-top: var(--space-xs); }
    .detail-date { font-size: var(--font-size-body-md); color: var(--color-on-surface-variant); margin-bottom: var(--space-lg); }
    .section-title { font-size: var(--font-size-h3); font-weight: var(--font-weight-h3); color: var(--color-on-surface); margin-bottom: var(--space-md); padding-top: var(--space-md); border-top: 1px solid var(--color-outline-variant); }
    .address-box { background: var(--color-surface-container); border-radius: var(--radius-lg); padding: var(--space-md); display: flex; flex-direction: column; gap: var(--space-xs); }
    .address-line { font-size: var(--font-size-body-md); color: var(--color-on-surface); }
  `]
})
export class DetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private service = inject(PedidoService);
  pedido = signal<Pedido | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.service.buscarPorId(id).subscribe({
      next: (p) => { this.pedido.set(p); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }
}
