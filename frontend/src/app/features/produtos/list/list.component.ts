import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProdutosService } from '../produtos.service';
import { Produto } from '../../../shared/models';
import { NavbarComponent, ProductCardComponent, SkeletonComponent, EmptyStateComponent } from '../../../shared/components';
import { IconComponent } from '../../../shared/icons';

@Component({
  selector: 'app-produtos-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NavbarComponent, ProductCardComponent, SkeletonComponent, EmptyStateComponent, IconComponent],
  template: `
    <app-navbar />
    <main class="container produtos-main">
      <div class="produtos-header">
        <h1 class="page-title">Produtos</h1>
        <div class="search-wrapper">
          <input
            type="text"
            placeholder="Buscar produtos..."
            [(ngModel)]="busca"
            (ngModelChange)="load()"
            class="search-input"
          />
          <span class="search-icon"><app-icon name="search" [size]="16" /></span>
        </div>
      </div>

      @if (loading()) {
        <div class="produtos-grid">
          @for (i of [1,2,3,4,5,6]; track i) {
            <div class="skeleton-card">
              <app-skeleton height="160px" />
              <app-skeleton width="80%" height="20px" />
            </div>
          }
        </div>
      } @else if (produtos().length === 0) {
        <app-empty-state message="Nenhum produto encontrado" />
      } @else {
        <div class="produtos-grid">
          @for (p of produtos(); track p.id) {
            <app-product-card [produto]="p" />
          }
        </div>
      }
    </main>
  `,
  styles: [`
    .produtos-main {
      padding-top: var(--space-xl);
      padding-bottom: var(--space-2xl);
    }
    .produtos-header {
      display: flex;
      align-items: center;
      gap: var(--space-lg);
      margin-bottom: var(--space-xl);
      flex-wrap: wrap;
    }
    .page-title {
      font-size: var(--font-size-h1);
      font-weight: var(--font-weight-h1);
      color: var(--color-on-surface);
      line-height: var(--font-line-height-h1);
    }
    .search-wrapper {
      flex: 1;
      max-width: 320px;
      position: relative;
    }
    .search-input {
      width: 100%;
      padding: var(--space-md) var(--space-lg);
      padding-left: 40px;
      border: 1px solid var(--color-outline-variant);
      border-radius: var(--radius-lg);
      font-size: var(--font-size-body-md);
      font-family: var(--font-family);
      background: var(--color-surface);
      transition: all var(--transition-fast);
    }
    .search-input:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: var(--shadow-focus);
    }
    .search-icon {
      position: absolute;
      left: var(--space-md);
      top: 50%;
      transform: translateY(-50%);
      color: var(--color-on-surface-variant);
      display: flex;
      align-items: center;
    }
    .produtos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: var(--space-lg);
    }
    .skeleton-card {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }
  `]
})
export class ListComponent implements OnInit {
  private service = inject(ProdutosService);
  produtos = signal<Produto[]>([]);
  loading = signal(true);
  busca = '';

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.service.listar({ busca: this.busca || undefined }).subscribe({
      next: (r) => {
        this.produtos.set(r.produtos);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
