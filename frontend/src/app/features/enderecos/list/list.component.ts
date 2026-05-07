import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { EnderecoService } from '../endereco.service';
import { Endereco } from '../../../shared/models';
import { FooterComponent, NavbarComponent, ButtonComponent, CardComponent, SkeletonComponent, EmptyStateComponent } from '../../../shared/components';

@Component({
  selector: 'app-enderecos-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FooterComponent, NavbarComponent, ButtonComponent, CardComponent, SkeletonComponent, EmptyStateComponent],
  template: `
    <app-navbar />
    <main class="container enderecos-main">
      <div class="page-header">
        <h1 class="page-title">Meus Endereços</h1>
        <a routerLink="/enderecos/novo">
          <app-button>Novo Endereço</app-button>
        </a>
      </div>

      @if (loading()) {
        <div class="enderecos-list">
          @for (i of [1,2,3]; track i) {
            <app-skeleton height="100px" />
          }
        </div>
      } @else if (enderecos().length === 0) {
        <app-empty-state message="Nenhum endereço cadastrado" />
      } @else {
        <div class="enderecos-list">
          @for (endereco of enderecos(); track endereco.id) {
            <app-card class="endereco-card" [class.elevated]="true">
              <div class="endereco-info">
                <p class="endereco-street">{{ endereco.logradouro }}, {{ endereco.numero }}</p>
                @if (endereco.complemento) {
                  <p class="endereco-complement">{{ endereco.complemento }}</p>
                }
                <p class="endereco-city">{{ endereco.cidade }} - {{ endereco.estado }}, {{ endereco.cep }}</p>
              </div>
              @if (endereco.padrao) {
                <span class="default-badge">Padrão</span>
              }
              <div class="endereco-actions">
                <button class="action-btn" (click)="editar(endereco.id)">Editar</button>
                <button class="action-btn delete" (click)="remover(endereco.id)">Remover</button>
              </div>
            </app-card>
          }
        </div>
      }
    </main>
    <app-footer />
  `,
  styles: [`
    .enderecos-main {
      padding-top: var(--space-xl);
      padding-bottom: var(--space-2xl);
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-xl);
    }
    .page-title {
      font-size: var(--font-size-h1);
      font-weight: var(--font-weight-h1);
      color: var(--color-on-surface);
    }
    .enderecos-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }
    .endereco-card {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      flex-wrap: wrap;
    }
    .endereco-info {
      flex: 1;
    }
    .endereco-street {
      font-size: var(--font-size-h3);
      font-weight: var(--font-weight-h3);
      color: var(--color-on-surface);
      margin-bottom: var(--space-xs);
    }
    .endereco-complement {
      font-size: var(--font-size-body-md);
      color: var(--color-on-surface-variant);
      margin-bottom: var(--space-xs);
    }
    .endereco-city {
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
    }
    .endereco-actions {
      display: flex;
      gap: var(--space-sm);
    }
    .action-btn {
      background: transparent;
      border: 1px solid var(--color-outline-variant);
      color: var(--color-on-surface-variant);
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-lg);
      cursor: pointer;
      font-size: var(--font-size-label-sm);
      transition: all var(--transition-fast);
    }
    .action-btn:hover {
      background: var(--color-surface-container);
    }
    .action-btn.delete {
      color: var(--color-error);
      border-color: var(--color-error);
    }
    .action-btn.delete:hover {
      background: var(--color-error-container);
    }
  `]
})
export class ListComponent implements OnInit {
  private service = inject(EnderecoService);
  private router = inject(Router);
  enderecos = signal<Endereco[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.service.listar().subscribe({
      next: (enderecos) => {
        this.enderecos.set(enderecos);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  editar(id: string): void {
    this.router.navigate(['/enderecos', id, 'editar']);
  }

  remover(id: string): void {
    if (confirm('Tem certeza que deseja remover este endereço?')) {
      this.service.remover(id).subscribe({
        next: () => this.load(),
        error: () => console.error('Erro ao remover endereço')
      });
    }
  }
}
