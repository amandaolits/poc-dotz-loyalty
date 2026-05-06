import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProdutosService } from '../produtos.service';
import { Produto } from '../../../shared/models';
import { NavbarComponent, ButtonComponent, SkeletonComponent } from '../../../shared/components';

@Component({
  selector: 'app-produto-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, ButtonComponent, SkeletonComponent],
  template: `
    <app-navbar />
    <main class="container detail-main">
      @if (loading()) {
        <app-skeleton height="300px" />
      } @else if (produto()) {
        <div class="detail-grid">
          <div class="product-image-wrapper">
            <img [src]="produto()!.imagem_url" [alt]="produto()!.nome" class="product-image" />
          </div>
          <div class="product-info">
            <h1 class="product-name">{{ produto()!.nome }}</h1>
            @if (produto()!.categoria) {
              <p class="product-category">{{ produto()!.categoria }}</p>
            }
            <p class="product-description">{{ produto()!.descricao }}</p>
            <div class="product-points-section">
              <p class="points-label">Pontos necessários</p>
              <p class="points-value">{{ produto()!.pontos_necessarios | number:'1.0-0' }} <span class="points-unit">Dotz</span></p>
            </div>
            <a
              [routerLink]="['/checkout']"
              [queryParams]="{ produtoId: produto()!.id }"
              class="resgatar-link"
            >
              <app-button class="resgatar-btn">Resgatar agora</app-button>
            </a>
          </div>
        </div>
      }
    </main>
  `,
  styles: [`
    .detail-main {
      padding-top: var(--space-xl);
      padding-bottom: var(--space-2xl);
    }
    .detail-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-xl);
    }
    @media (min-width: 768px) {
      .detail-grid {
        grid-template-columns: 1fr 1fr;
      }
    }
    .product-image-wrapper {
      border-radius: var(--radius-xl);
      overflow: hidden;
    }
    .product-image {
      width: 100%;
      height: auto;
      object-fit: cover;
      border-radius: var(--radius-xl);
    }
    .product-info {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }
    .product-name {
      font-size: var(--font-size-h1);
      font-weight: var(--font-weight-h1);
      color: var(--color-on-surface);
      line-height: var(--font-line-height-h1);
    }
    .product-category {
      display: inline-block;
      padding: var(--space-xs) var(--space-md);
      background: var(--color-surface-container);
      color: var(--color-on-primary-container);
      border-radius: var(--radius-full);
      font-size: var(--font-size-label-sm);
      font-weight: var(--font-weight-label-sm);
      width: fit-content;
    }
    .product-description {
      font-size: var(--font-size-body-md);
      color: var(--color-on-surface-variant);
      line-height: var(--font-line-height-body-md);
    }
    .product-points-section {
      padding: var(--space-lg);
      background: var(--color-surface-container);
      border-radius: var(--radius-xl);
      margin: var(--space-md) 0;
    }
    .points-label {
      font-size: var(--font-size-label-bold);
      color: var(--color-on-surface-variant);
      margin-bottom: var(--space-xs);
    }
    .points-value {
      font-size: 48px;
      font-weight: var(--font-weight-h1);
      color: var(--color-primary);
      line-height: var(--font-line-height-h1);
    }
    .points-unit {
      font-size: var(--font-size-h2);
      color: var(--color-on-surface-variant);
    }
    .resgatar-link {
      text-decoration: none;
    }
    .resgatar-btn {
      width: 100%;
    }
  `]
})
export class DetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private service = inject(ProdutosService);
  produto = signal<Produto | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.service.detalhe(id).subscribe({
        next: (p) => {
          this.produto.set(p);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
    }
  }
}
