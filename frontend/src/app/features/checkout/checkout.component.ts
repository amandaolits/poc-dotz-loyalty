import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProdutosService } from '../../features/produtos/produtos.service';
import { EnderecoService } from '../../features/enderecos/endereco.service';
import { ApiService } from '../../core/services/api.service';
import { Produto, Endereco } from '../../shared/models';
import { FooterComponent, NavbarComponent, ButtonComponent, SkeletonComponent } from '../../shared/components';
import { IconComponent } from '../../shared/icons';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterLink, FooterComponent, NavbarComponent, ButtonComponent, SkeletonComponent, IconComponent],
  template: `
    <app-navbar />
    <main class="container checkout-main">
      @if (loading()) {
        <app-skeleton height="300px" />
      } @else if (produto()) {
        <div class="checkout-header">
          <h1 class="checkout-title">Finalizar Resgate</h1>
          <p class="checkout-subtitle">Revise os detalhes da sua troca antes de finalizar.</p>
        </div>

        <div class="checkout-grid">
          <div class="checkout-left">
            <section class="checkout-card">
              <h2 class="section-title">
                <app-icon name="map-pin" />
                Endereço de Entrega
              </h2>

              @if (enderecos().length === 0) {
                <p class="no-address">Nenhum endereço cadastrado. <a routerLink="/enderecos">Cadastre um</a></p>
              } @else {
                <div class="address-grid">
                  @for (endereco of enderecos(); track endereco.id) {
                    <div
                      class="address-card"
                      [class.selected]="enderecoSelecionado() === endereco.id"
                      (click)="selecionarEndereco(endereco.id)"
                    >
                      <div class="address-card-header">
                        @if (enderecoSelecionado() === endereco.id) {
                          <app-icon name="check-circle" class="check-icon" [size]="20" />
                        } @else {
                          <div class="radio-circle"></div>
                        }
                        <div class="address-card-info">
                          <span class="address-label">{{ endereco.logradouro }}, {{ endereco.numero }}</span>
                          @if (endereco.padrao) {
                            <span class="address-badge">Padrão</span>
                          }
                        </div>
                      </div>
                      @if (endereco.complemento) {
                        <p class="address-detail">{{ endereco.complemento }}</p>
                      }
                      <p class="address-detail">{{ endereco.bairro }}, {{ endereco.cidade }} - {{ endereco.estado }}</p>
                      <p class="address-detail">CEP: {{ endereco.cep }}</p>
                    </div>
                  }
                </div>
              }

              <button class="new-address-btn" routerLink="/enderecos">
                <app-icon name="plus" />
                Novo endereço
              </button>
            </section>
          </div>

          <aside class="checkout-right">
            <div class="summary-card">
              <div class="summary-product">
                <img [src]="produto()!.imagem_url" [alt]="produto()!.nome" class="summary-img" />
                <div class="summary-product-info">
                  <h3 class="summary-product-name">{{ produto()!.nome }}</h3>
                  @if (produto()!.categoria) {
                    <span class="summary-category">{{ produto()!.categoria }}</span>
                  }
                </div>
              </div>

              <div class="summary-line">
                <span>Item</span>
                <span>{{ produto()!.pontos_necessarios | number:'1.0-0' }} DZ</span>
              </div>

              <hr class="summary-divider" />

              <div class="summary-total">
                <span class="total-label">Total</span>
                <span class="total-points">{{ produto()!.pontos_necessarios | number:'1.0-0' }} DZ</span>
              </div>

              <app-button
                class="confirm-btn"
                [disabled]="!enderecoSelecionado() || processing()"
                (click)="confirmarResgate()"
              >
                <app-icon name="check-circle" />
                {{ processing() ? 'Processando...' : 'Confirmar Resgate' }}
              </app-button>

              <p class="info-text">Seu saldo será debitado após a confirmação</p>
            </div>
          </aside>
        </div>
      }
    </main>
    <app-footer />
  `,
  styles: [`
    .checkout-main {
      padding-top: var(--space-xl);
      padding-bottom: var(--space-2xl);
    }
    .checkout-header {
      margin-bottom: var(--space-xl);
    }
    .checkout-title {
      font-size: var(--font-size-h1);
      font-weight: var(--font-weight-h1);
      color: var(--color-on-surface);
      margin: 0;
    }
    .checkout-subtitle {
      font-size: var(--font-size-body-md);
      color: var(--color-on-surface-variant);
      margin: var(--space-sm) 0 0;
    }
    .checkout-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-xl);
    }
    @media (min-width: 1024px) {
      .checkout-grid {
        grid-template-columns: 7fr 5fr;
      }
    }
    .checkout-card {
      background: var(--color-surface);
      border-radius: 24px;
      padding: var(--space-xl);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      border: 1px solid var(--color-outline-variant);
    }
    .section-title {
      font-size: var(--font-size-h2);
      font-weight: var(--font-weight-h2);
      color: var(--color-on-surface);
      margin: 0 0 var(--space-lg);
      display: flex;
      align-items: center;
      gap: var(--space-sm);
    }
    .address-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-md);
    }
    @media (min-width: 768px) {
      .address-grid {
        grid-template-columns: 1fr 1fr;
      }
    }
    .address-card {
      padding: var(--space-md);
      background: var(--color-surface-container-low);
      border-radius: var(--radius-xl);
      border: 2px solid transparent;
      cursor: pointer;
      transition: all var(--transition-fast);
    }
    .address-card:hover:not(.selected) {
      border-color: var(--color-outline);
    }
    .address-card.selected {
      border-color: var(--color-primary);
      background: var(--color-primary-container);
    }
    .address-card-header {
      display: flex;
      align-items: flex-start;
      gap: var(--space-sm);
      margin-bottom: var(--space-xs);
    }
    .radio-circle {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 2px solid var(--color-outline);
      flex-shrink: 0;
      margin-top: 2px;
    }
    .address-card.selected .radio-circle {
      border-color: var(--color-primary);
      background: var(--color-primary);
    }
    .check-icon {
      color: var(--color-primary);
      flex-shrink: 0;
    }
    .address-card-info {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      flex-wrap: wrap;
    }
    .address-label {
      font-size: var(--font-size-label-bold);
      font-weight: var(--font-weight-label-bold);
      color: var(--color-on-surface);
    }
    .address-badge {
      font-size: 10px;
      padding: 2px 8px;
      border-radius: 9999px;
      background: var(--color-primary);
      color: var(--color-on-primary);
      font-weight: 700;
    }
    .address-detail {
      font-size: var(--font-size-body-md);
      color: var(--color-on-surface-variant);
      margin: 0 0 0 28px;
    }
    .no-address {
      font-size: var(--font-size-body-md);
      color: var(--color-on-surface-variant);
    }
    .no-address a {
      color: var(--color-primary);
    }
    .new-address-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-sm);
      width: 100%;
      padding: var(--space-md);
      margin-top: var(--space-md);
      border: 2px dashed var(--color-outline-variant);
      border-radius: var(--radius-xl);
      background: transparent;
      color: var(--color-on-surface-variant);
      font-family: var(--font-family);
      font-size: var(--font-size-label-bold);
      font-weight: var(--font-weight-label-bold);
      cursor: pointer;
      transition: all var(--transition-fast);
      text-decoration: none;
    }
    .new-address-btn:hover {
      border-color: var(--color-primary);
      color: var(--color-primary);
    }
    .checkout-right {
      display: flex;
      flex-direction: column;
    }
    .summary-card {
      background: var(--color-surface);
      border-radius: 24px;
      padding: var(--space-xl);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
      border: 1px solid var(--color-outline-variant);
    }
    @media (min-width: 1024px) {
      .summary-card {
        position: sticky;
        top: 5rem;
      }
    }
    .summary-product {
      display: flex;
      gap: var(--space-md);
      margin-bottom: var(--space-lg);
    }
    .summary-img {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: var(--radius-lg);
      flex-shrink: 0;
    }
    .summary-product-info {
      flex: 1;
      min-width: 0;
    }
    .summary-product-name {
      font-size: var(--font-size-h3);
      font-weight: var(--font-weight-h3);
      color: var(--color-on-surface);
      margin: 0 0 var(--space-xs);
    }
    .summary-category {
      font-size: var(--font-size-label-sm);
      color: var(--color-on-surface-variant);
    }
    .summary-line {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: var(--font-size-body-md);
      color: var(--color-on-surface-variant);
      margin-bottom: var(--space-md);
    }
    .summary-divider {
      border: none;
      border-top: 1px solid var(--color-outline-variant);
      margin: var(--space-md) 0;
    }
    .summary-total {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-lg);
    }
    .total-label {
      font-size: var(--font-size-label-bold);
      font-weight: var(--font-weight-label-bold);
      color: var(--color-on-surface);
    }
    .total-points {
      font-size: var(--font-size-h3);
      font-weight: var(--font-weight-h3);
      color: var(--color-primary);
    }
    .confirm-btn {
      width: 100%;
    }
    .confirm-btn app-icon {
      color: currentColor;
    }
    .info-text {
      font-size: var(--font-size-caption);
      color: var(--color-on-surface-variant);
      text-align: center;
      margin: var(--space-md) 0 0;
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
