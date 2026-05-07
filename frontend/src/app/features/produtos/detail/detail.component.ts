import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProdutosService } from '../produtos.service';
import { Produto } from '../../../shared/models';
import { FooterComponent, NavbarComponent, ButtonComponent, SkeletonComponent } from '../../../shared/components';
import { IconComponent } from '../../../shared/icons';

@Component({
  selector: 'app-produto-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FooterComponent, NavbarComponent, ButtonComponent, SkeletonComponent, IconComponent],
  template: `
    <app-navbar />
    <main class="container detail-main">
      @if (loading()) {
        <app-skeleton height="300px" />
      } @else if (produto()) {
        <div class="back-link-wrapper">
          <a routerLink="/produtos" class="back-link">
            <app-icon name="arrow-left" />
            Voltar aos produtos
          </a>
        </div>
        <div class="detail-grid">
          <section class="image-section">
            <div class="image-wrapper">
              <img [src]="produto()!.imagem_url" [alt]="produto()!.nome" class="product-image" />
            </div>
          </section>
          <section class="info-section">
            @if (produto()!.categoria) {
              <span class="category-badge">{{ produto()!.categoria }}</span>
            }
            <h2 class="product-title">{{ produto()!.nome }}</h2>
            <p class="product-description">{{ produto()!.descricao }}</p>
            <div class="points-card">
              <span class="points-value">DZ {{ produto()!.pontos_necessarios | number:'1.0-0' }}</span>
              <p class="points-subtitle">Dispon\u00edvel em estoque para entrega imediata</p>
            </div>
            <div class="features-list">
              <div class="feature-item">
                <app-icon name="truck" />
                <span>Frete gr\u00e1tis para todo o Brasil</span>
              </div>
              <div class="feature-item">
                <app-icon name="check-circle" />
                <span>Garantia oficial de 12 meses</span>
              </div>
              <div class="feature-item">
                <app-icon name="trending-up" />
                <span>Troca f\u00e1cil e gratuita em at\u00e9 7 dias</span>
              </div>
            </div>
            <a [routerLink]="['/checkout']" [queryParams]="{ produtoId: produto()!.id }" class="resgatar-link">
              <app-button class="resgatar-btn">Resgatar Agora</app-button>
            </a>
          </section>
        </div>
      }
    </main>
    <app-footer />
  `,
  styles: [`
    .detail-main {
      padding-top: var(--space-xl);
      padding-bottom: var(--space-2xl);
    }
    .back-link-wrapper {
      margin-bottom: var(--space-lg);
    }
    .back-link {
      display: inline-flex;
      align-items: center;
      gap: var(--space-sm);
      font-size: var(--font-size-label-bold);
      font-weight: var(--font-weight-label-bold);
      color: var(--color-on-surface-variant);
      text-decoration: none;
      transition: color var(--transition-fast);
    }
    .back-link:hover {
      color: var(--color-primary);
    }
    .detail-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-xl);
      align-items: start;
    }
    @media (min-width: 1024px) {
      .detail-grid {
        grid-template-columns: 7fr 5fr;
        gap: 48px;
      }
    }
    .image-wrapper {
      aspect-ratio: 1 / 1;
      width: 100%;
      border-radius: var(--radius-xl);
      overflow: hidden;
      background: var(--color-surface);
      border: 1px solid var(--color-outline-variant);
      box-shadow: var(--shadow-card);
    }
    .product-image {
      width: 100%;
      height: 100%;
      object-fit: contain;
      padding: var(--space-2xl);
    }
    .info-section {
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);
    }
    @media (min-width: 1024px) {
      .info-section {
        position: sticky;
        top: 5rem;
      }
    }
    .category-badge {
      display: inline-block;
      width: fit-content;
      padding: var(--space-xs) var(--space-md);
      background: var(--color-surface-container);
      color: var(--color-on-primary-container);
      border-radius: var(--radius-full);
      font-size: var(--font-size-label-sm);
      font-weight: var(--font-weight-label-sm);
    }
    .product-title {
      font-size: var(--font-size-h1);
      font-weight: var(--font-weight-h1);
      line-height: var(--font-line-height-h1);
      letter-spacing: var(--font-letter-spacing-h1);
      color: var(--color-on-surface);
      margin: 0;
    }
    .product-description {
      font-size: var(--font-size-body-lg);
      font-weight: var(--font-weight-body-lg);
      line-height: var(--font-line-height-body-lg);
      color: var(--color-on-surface-variant);
      margin: 0;
    }
    .points-card {
      background: var(--color-primary);
      border-radius: var(--radius-full);
      padding: var(--space-lg);
    }
    .points-value {
      font-size: 48px;
      font-weight: var(--font-weight-h1);
      color: var(--color-on-primary);
      line-height: 1;
    }
    .points-subtitle {
      font-size: var(--font-size-label-sm);
      font-weight: var(--font-weight-label-sm);
      color: var(--color-on-primary);
      margin-top: var(--space-sm);
      margin-bottom: 0;
    }
    .features-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }
    .feature-item {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      font-size: var(--font-size-body-md);
      color: var(--color-on-surface);
    }
    .feature-item app-icon {
      color: var(--color-primary);
    }
    .resgatar-link {
      text-decoration: none;
      display: block;
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
