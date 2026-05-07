import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProdutosService } from '../produtos.service';
import { Produto } from '../../../shared/models';
import { FooterComponent, NavbarComponent, SkeletonComponent, EmptyStateComponent } from '../../../shared/components';
import { IconComponent } from '../../../shared/icons';

@Component({
  selector: 'app-produtos-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, FooterComponent, NavbarComponent, SkeletonComponent, EmptyStateComponent, IconComponent],
  template: `
    <app-navbar />
    <main class="produtos-main">
      <section class="hero">
        <div class="hero-card">
          <div class="hero-card__inner">
            <div class="hero-card__header">
              <h1 class="hero-card__title">Catálogo de Prêmios</h1>
              <p class="hero-card__subtitle">Use seus Dotz para resgatar os melhores produtos e experiências.</p>
            </div>
            <div class="hero-card__filters">
              <div class="hero-card__search">
                <app-icon name="search" class="hero-card__search-icon" [size]="20" color="var(--color-outline)" />
                <input
                  type="text"
                  class="hero-card__input"
                  placeholder="O que você quer resgatar hoje?"
                  [(ngModel)]="busca"
                  (ngModelChange)="onSearch()"
                />
              </div>
              <div class="hero-card__select">
                <select class="hero-card__select-input" [(ngModel)]="categoria" (ngModelChange)="onCategoryChange()">
                  <option value="">Categoria</option>
                  @for (cat of categorias(); track cat) {
                    <option [value]="cat">{{ cat }}</option>
                  }
                </select>
              </div>
              <div class="hero-card__select">
                <select class="hero-card__select-input" [(ngModel)]="subcategoria" (ngModelChange)="onSubcategoriaChange()">
                  <option value="">Subcategoria</option>
                  @for (sub of subcategorias(); track sub) {
                    <option [value]="sub">{{ sub }}</option>
                  }
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      @if (loading()) {
        <section class="grid">
          @for (i of [1,2,3,4,5,6,7,8]; track i) {
            <div class="grid__skeleton">
              <app-skeleton height="200px" />
              <div class="grid__skeleton-body">
                <app-skeleton height="20px" width="80%" />
                <app-skeleton height="16px" width="60%" />
                <app-skeleton height="44px" />
              </div>
            </div>
          }
        </section>
      } @else if (produtos().length === 0) {
        <app-empty-state message="Nenhum produto encontrado" />
      } @else {
        <section class="grid">
          @for (p of produtos(); track p.id) {
            <div class="card">
              <div class="card__image-wrap">
                <img
                  class="card__image"
                  [src]="p.imagem_url || '/assets/placeholder.svg'"
                  [alt]="p.nome"
                  loading="lazy"
                />
                <div class="card__badge">
                  DZ {{ p.pontos_necessarios | number:'1.0-0' }}
                </div>
              </div>
              <div class="card__body">
                <h3 class="card__title">{{ p.nome }}</h3>
                <p class="card__category">{{ p.categoria || 'Produto' }}{{ p.subcategoria ? ' • ' + p.subcategoria : '' }}</p>
                <button class="card__btn" [routerLink]="['/produtos', p.id]">Trocar agora</button>
              </div>
            </div>
          }
        </section>

        @if (totalPages() > 1) {
          <nav class="pagination">
            <button class="pagination__btn" [class.pagination__btn--disabled]="pagina() <= 1" (click)="goToPage(pagina() - 1)" [disabled]="pagina() <= 1">
              <app-icon name="chevron-left" [size]="20" />
            </button>
            @for (p of pageNumbers(); track $index) {
              @if (p === '...') {
                <span class="pagination__ellipsis">...</span>
              } @else {
                <button class="pagination__btn" [class.pagination__btn--active]="p === pagina()" (click)="goToPage(p)">
                  {{ p }}
                </button>
              }
            }
            <button class="pagination__btn" [class.pagination__btn--disabled]="pagina() >= totalPages()" (click)="goToPage(pagina() + 1)" [disabled]="pagina() >= totalPages()">
              <app-icon name="chevron-right" [size]="20" />
            </button>
          </nav>
        }
      }
    </main>
    <app-footer />
  `,
  styles: [`
    .produtos-main {
      max-width: 1280px;
      margin: 0 auto;
      padding: 32px 16px;
    }
    @media (min-width: 768px) {
      .produtos-main { padding: 32px; }
    }

    .hero { margin-bottom: var(--space-xl); }
    .hero-card {
      background: var(--color-surface);
      border-radius: var(--radius-xl);
      border: 1px solid var(--color-outline-variant);
      box-shadow: var(--shadow-card);
    }
    .hero-card__inner {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    @media (min-width: 768px) {
      .hero-card__inner { padding: 32px; }
    }
    .hero-card__title {
      font-size: var(--font-size-h1);
      font-weight: var(--font-weight-h1);
      color: var(--color-on-background);
      line-height: var(--font-line-height-h1);
      margin: 0 0 8px;
    }
    .hero-card__subtitle {
      font-size: var(--font-size-body-md);
      color: var(--color-on-surface-variant);
      margin: 0;
    }
    .hero-card__filters {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
    }
    @media (min-width: 768px) {
      .hero-card__filters {
        grid-template-columns: 2fr 1fr 1fr;
      }
    }
    .hero-card__search {
      position: relative;
    }
    .hero-card__search-icon {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      pointer-events: none;
    }
    .hero-card__input {
      width: 100%;
      padding: 12px 16px 12px 48px;
      background: var(--color-surface);
      border: 1px solid var(--color-outline-variant);
      border-radius: var(--radius-xl);
      font-size: var(--font-size-body-md);
      font-family: var(--font-family);
      outline: none;
      transition: all 200ms;
      box-sizing: border-box;
    }
    .hero-card__input:focus {
      border-color: var(--color-primary-container);
      box-shadow: 0 0 0 2px var(--color-primary-fixed);
    }
    .hero-card__select { position: relative; }
    .hero-card__select-input {
      width: 100%;
      padding: 12px 16px;
      background: var(--color-surface);
      border: 1px solid var(--color-outline-variant);
      border-radius: var(--radius-xl);
      font-size: var(--font-size-body-md);
      font-family: var(--font-family);
      outline: none;
      transition: all 200ms;
      appearance: none;
      box-sizing: border-box;
      cursor: pointer;
    }
    .hero-card__select-input:focus {
      border-color: var(--color-primary-container);
      box-shadow: 0 0 0 2px var(--color-primary-fixed);
    }

    .grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 24px;
      margin-bottom: var(--space-xl);
    }
    @media (min-width: 640px) { .grid { grid-template-columns: repeat(2, 1fr); } }
    @media (min-width: 1024px) { .grid { grid-template-columns: repeat(3, 1fr); } }
    @media (min-width: 1280px) { .grid { grid-template-columns: repeat(4, 1fr); } }

    .grid__skeleton {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .grid__skeleton-body {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .card {
      background: var(--color-surface);
      border-radius: var(--radius-xl);
      overflow: hidden;
      border: 1px solid var(--color-outline-variant);
      box-shadow: var(--shadow-card);
      transition: all 200ms;
    }
    .card:hover {
      box-shadow: var(--shadow-card-hover);
      transform: translateY(-2px);
    }
    .card__image-wrap {
      position: relative;
      aspect-ratio: 1 / 1;
      overflow: hidden;
      background: var(--color-surface-variant);
    }
    .card__image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 300ms;
    }
    .card:hover .card__image {
      transform: scale(1.05);
    }
    .card__badge {
      position: absolute;
      top: 16px;
      right: 16px;
      background: var(--color-primary);
      color: var(--color-on-primary);
      padding: 4px 12px;
      border-radius: var(--radius-full);
      font-size: var(--font-size-label-bold);
      font-weight: var(--font-weight-label-bold);
      line-height: 1.2;
      white-space: nowrap;
    }
    .card__body {
      padding: 24px;
    }
    .card__title {
      font-size: var(--font-size-h3);
      font-weight: var(--font-weight-h3);
      color: var(--color-on-surface);
      line-height: var(--font-line-height-h3);
      margin: 0 0 8px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .card__category {
      font-size: var(--font-size-label-sm);
      color: var(--color-on-surface-variant);
      margin: 0 0 16px;
    }
    .card__btn {
      width: 100%;
      background: var(--color-primary);
      color: var(--color-on-primary);
      border: none;
      padding: 12px;
      border-radius: var(--radius-xl);
      font-size: var(--font-size-label-bold);
      font-weight: var(--font-weight-label-bold);
      cursor: pointer;
      transition: opacity 200ms;
    }
    .card__btn:hover {
      opacity: 0.9;
    }
    .card__btn:active {
      transform: scale(0.98);
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      padding: 48px 0;
    }
    .pagination__btn {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-xl);
      border: 1px solid var(--color-outline-variant);
      background: transparent;
      color: var(--color-on-surface-variant);
      font-size: var(--font-size-label-bold);
      font-weight: var(--font-weight-label-bold);
      cursor: pointer;
      transition: all 200ms;
    }
    .pagination__btn:hover:not(:disabled) {
      background: var(--color-surface);
    }
    .pagination__btn:active:not(:disabled) {
      transform: scale(0.95);
    }
    .pagination__btn--active {
      background: var(--color-primary);
      color: var(--color-on-primary);
      border-color: var(--color-primary);
    }
    .pagination__btn--active:hover {
      opacity: 0.9;
    }
    .pagination__btn--disabled {
      opacity: 0.5;
      cursor: default;
    }
    .pagination__ellipsis {
      padding: 0 8px;
      color: var(--color-on-surface-variant);
    }
  `]
})
export class ListComponent implements OnInit {
  private service = inject(ProdutosService);
  protected produtos = signal<Produto[]>([]);
  protected loading = signal(true);
  protected busca = '';
  protected categoria = '';
  protected subcategoria = '';
  protected pagina = signal(1);
  private total = signal(0);
  protected limite = 12;
  protected categorias = signal<string[]>([]);
  protected subcategorias = signal<string[]>([]);

  protected totalPages = computed(() => Math.ceil(this.total() / this.limite));

  protected pageNumbers = computed(() => {
    const total = this.totalPages();
    const current = this.pagina();
    if (total <= 1) return [] as (number | string)[];

    const pages: (number | string)[] = [];
    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (current > 3) pages.push('...');
      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (current < total - 2) pages.push('...');
      pages.push(total);
    }
    return pages;
  });

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.service.listar({
      busca: this.busca || undefined,
      categoria: this.categoria || undefined,
      subcategoria: this.subcategoria || undefined,
      pagina: this.pagina(),
    }).subscribe({
      next: (r) => {
        this.produtos.set(r.produtos);
        this.total.set(r.total);
        const cats = [...new Set(r.produtos.map(p => p.categoria).filter(Boolean))] as string[];
        this.categorias.set(cats);
        if (this.subcategoria && this.categoria) {
          const subs = [...new Set(r.produtos.filter(p => p.categoria === this.categoria).map(p => p.subcategoria).filter(Boolean))] as string[];
          this.subcategorias.set(subs);
        } else {
          const subs = [...new Set(r.produtos.map(p => p.subcategoria).filter(Boolean))] as string[];
          this.subcategorias.set(subs);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  protected onSearch(): void {
    this.pagina.set(1);
    this.load();
  }

  protected onCategoryChange(): void {
    this.subcategoria = '';
    this.pagina.set(1);
    this.load();
  }

  protected onSubcategoriaChange(): void {
    this.pagina.set(1);
    this.load();
  }

  protected goToPage(p: number | string): void {
    const page = typeof p === 'number' ? p : parseInt(p, 10);
    if (isNaN(page) || page < 1 || page > this.totalPages()) return;
    this.pagina.set(page);
    this.load();
  }
}
