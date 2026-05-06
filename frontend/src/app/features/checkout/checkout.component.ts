import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProdutosService } from '../../features/produtos/produtos.service';
import { EnderecoService } from '../../features/enderecos/endereco.service';
import { ApiService } from '../../core/services/api.service';
import { Produto, Endereco } from '../../shared/models';
import { NavbarComponent, ButtonComponent, CardComponent, SkeletonComponent } from '../../shared/components';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, ButtonComponent, CardComponent, SkeletonComponent],
  template: `
    <app-navbar />
    <main class="container checkout-main">
      <h1 class="page-title">Checkout</h1>

      @if (loading()) {
        <app-skeleton height="300px" />
      } @else if (produto()) {
        <div class="checkout-grid">
          <!-- Resumo do Pedido -->
          <app-card class="order-summary elevated">
            <h2 class="section-title">Resumo do Pedido</h2>
            <div class="product-info">
              <img [src]="produto()!.imagem_url" [alt]="produto()!.nome" class="product-img" />
              <div>
                <h3 class="product-name">{{ produto()!.nome }}</h3>
                <p class="product-points">{{ produto()!.pontos_necessarios | number:'1.0-0' }} Dotz</p>
              </div>
            </div>
          </app-card>

          <!-- Endereço de Entrega -->
          <app-card class="address-section elevated">
            <h2 class="section-title">Endereço de Entrega</h2>
            @if (enderecos().length === 0) {
              <p class="no-address">Nenhum endereço cadastrado. <a routerLink="/enderecos">Cadastre um</a></p>
            } @else {
              <div class="address-list">
                @for (endereco of enderecos(); track endereco.id) {
                  <div
                    class="address-item"
                    [class.selected]="enderecoSelecionado() === endereco.id"
                    (click)="selecionarEndereco(endereco.id)"
                  >
                    <p class="address-street">{{ endereco.logradouro }}, {{ endereco.numero }}</p>
                    <p class="address-city">{{ endereco.cidade }} - {{ endereco.estado }}</p>
                    @if (endereco.padrao) {
                      <span class="default-badge">Padrão</span>
                    }
                  </div>
                }
              </div>
            }
          </app-card>

          <!-- Confirmar -->
          <app-button
            class="confirm-btn"
            [disabled]="!enderecoSelecionado() || processing()"
            (click)="confirmarResgate()"
          >
            {{ processing() ? 'Processando...' : 'Confirmar Resgate' }}
          </app-button>
        </div>
      }
    </main>
  `,
  styles: [`
    .checkout-main {
      padding-top: var(--space-xl);
      padding-bottom: var(--space-2xl);
    }
    .page-title {
      font-size: var(--font-size-h1);
      font-weight: var(--font-weight-h1);
      color: var(--color-on-surface);
      margin-bottom: var(--space-xl);
    }
    .checkout-grid {
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);
      max-width: 600px;
    }
    .section-title {
      font-size: var(--font-size-h2);
      font-weight: var(--font-weight-h2);
      color: var(--color-on-surface);
      margin-bottom: var(--space-lg);
    }
    .product-info {
      display: flex;
      gap: var(--space-md);
    }
    .product-img {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: var(--radius-lg);
    }
    .product-name {
      font-size: var(--font-size-h3);
      font-weight: var(--font-weight-h3);
      color: var(--color-on-surface);
    }
    .product-points {
      font-size: var(--font-size-body-lg);
      font-weight: var(--font-weight-h2);
      color: var(--color-primary);
    }
    .address-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }
    .address-item {
      padding: var(--space-md);
      border: 1px solid var(--color-outline-variant);
      border-radius: var(--radius-lg);
      cursor: pointer;
      transition: all var(--transition-fast);
    }
    .address-item.selected {
      border-color: var(--color-primary);
      background: var(--color-primary-container);
    }
    .address-street {
      font-size: var(--font-size-body-md);
      color: var(--color-on-surface);
      margin-bottom: var(--space-xs);
    }
    .address-city {
      font-size: var(--font-size-label-sm);
      color: var(--color-on-surface-variant);
    }
    .default-badge {
      display: inline-block;
      padding: var(--space-xs) var(--space-sm);
      background: var(--color-surface-container);
      color: var(--color-on-primary-container);
      border-radius: var(--radius-full);
      font-size: var(--font-size-label-sm);
      margin-top: var(--space-xs);
    }
    .no-address {
      font-size: var(--font-size-body-md);
      color: var(--color-on-surface-variant);
    }
    .no-address a {
      color: var(--color-primary);
    }
    .confirm-btn {
      width: 100%;
    }
  `]
})
export class CheckoutComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private produtosService = inject(ProdutosService);
  private enderecoService = inject(EnderecoService);
  private api = inject(ApiService);

  produto = signal<Produto | null>(null);
  enderecos = signal<Endereco[]>([]);
  enderecoSelecionado = signal<string | null>(null);
  loading = signal(true);
  processing = signal(false);

  ngOnInit(): void {
    const produtoId = this.route.snapshot.queryParamMap.get('produtoId');
    if (produtoId) {
      this.produtosService.detalhe(produtoId).subscribe({
        next: (p) => {
          this.produto.set(p);
          this.loadEnderecos();
        },
        error: () => this.loading.set(false)
      });
    }
  }

  loadEnderecos(): void {
    this.enderecoService.listar().subscribe({
      next: (enderecos) => {
        this.enderecos.set(enderecos);
        const padrao = enderecos.find(e => e.padrao);
        if (padrao) this.enderecoSelecionado.set(padrao.id);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  selecionarEndereco(id: string): void {
    this.enderecoSelecionado.set(id);
  }

  confirmarResgate(): void {
    if (!this.produto() || !this.enderecoSelecionado()) return;
    this.processing.set(true);
    this.api.post('/resgates', {
      produto_id: this.produto()!.id,
      endereco_id: this.enderecoSelecionado()
    }).subscribe({
      next: () => {
        this.router.navigate(['/pedidos'], { queryParams: { success: 'true' } });
      },
      error: () => this.processing.set(false)
    });
  }
}
