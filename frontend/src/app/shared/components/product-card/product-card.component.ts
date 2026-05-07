import { Component, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Produto } from '../../models';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  template: `
    <a class="product-card" [routerLink]="['/produtos', produto().id]" [class.clickable]="true">
      <img [src]="produto().imagem_url" [alt]="produto().nome" class="product-img" />
      <div class="product-info">
        <h3 class="product-name">{{ produto().nome }}</h3>
        <p class="product-points">{{ produto().pontos_necessarios | number:'1.0-0' }} Dotz</p>
        @if (produto().categoria) {
          <span class="product-category">{{ produto().categoria }}</span>
        }
      </div>
    </a>
  `,
  styles: [`
    .product-card {
      display: block;
      background: var(--color-surface);
      border-radius: var(--radius-xl);
      padding: var(--space-md);
      box-shadow: var(--shadow-card);
      border: 1px solid var(--color-outline-variant);
      text-decoration: none;
      color: var(--color-on-surface);
      transition: all var(--transition-fast);
      cursor: pointer;
    }
    .product-card:hover {
      box-shadow: var(--shadow-card-hover);
      transform: translateY(-2px);
    }
    .product-img {
      width: 100%;
      height: 160px;
      object-fit: cover;
      border-radius: var(--radius-lg);
      margin-bottom: var(--space-md);
    }
    .product-info {
      padding: 0 var(--space-sm);
    }
    .product-name {
      font-size: var(--font-size-h3);
      font-weight: var(--font-weight-h3);
      line-height: var(--font-line-height-h3);
      margin-bottom: var(--space-xs);
      color: var(--color-on-surface);
    }
    .product-points {
      font-size: var(--font-size-body-lg);
      font-weight: var(--font-weight-h2);
      color: var(--color-primary);
      margin-bottom: var(--space-sm);
    }
    .product-category {
      display: inline-block;
      padding: var(--space-xs) var(--space-sm);
      background: var(--color-surface-container);
      color: var(--color-on-primary-container);
      border-radius: var(--radius-full);
      font-size: var(--font-size-label-sm);
      font-weight: var(--font-weight-label-sm);
    }
  `]
})
export class ProductCardComponent {
  produto = input.required<Produto>();
}