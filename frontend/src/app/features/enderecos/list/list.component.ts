import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { EnderecoService } from '../endereco.service';
import { Endereco } from '../../../shared/models';
import { FooterComponent, NavbarComponent, SkeletonComponent } from '../../../shared/components';
import { IconComponent } from '../../../shared/icons';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-enderecos-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FooterComponent, NavbarComponent, SkeletonComponent, IconComponent],
  template: `
    <app-navbar />
    <main class="container enderecos-main">
      <div class="page-header">
        <div>
          <h1 class="text-h1 text-on-surface page-title">Meus Endereços</h1>
          <p class="text-body-md text-on-surface-variant subtitle">Gerencie seus endereços de entrega para trocar seus Dotz com facilidade.</p>
        </div>
        <a routerLink="/enderecos/novo" class="btn-primary-header">
          <app-icon name="plus" [size]="20" />
          Novo Endereço
        </a>
      </div>

      @if (loading()) {
        <div class="enderecos-grid">
          @for (i of [1,2,3]; track i) {
            <app-skeleton height="150px" />
          }
        </div>
      } @else if (enderecos().length === 0) {
        <div class="empty-state">
          <div class="empty-icon">
            <app-icon name="map-pin" [size]="48" />
          </div>
          <h2 class="text-h2 text-on-surface">Nenhum endereço encontrado</h2>
          <p class="text-body-md text-on-surface-variant empty-desc">Você ainda não cadastrou nenhum endereço. Adicione um agora para começar a usar seus Dotz!</p>
          <a routerLink="/enderecos/novo" class="btn-empty-cta">
            <app-icon name="plus" [size]="18" />
            Adicionar Endereço
          </a>
        </div>
      } @else {
        <div class="enderecos-grid">
          @for (endereco of enderecos(); track endereco.id) {
            <div class="endereco-card">
              <div>
                @if (endereco.padrao) {
                  <div class="badge-default">
                    <app-icon name="check-circle" [size]="14" />
                    Padrão
                  </div>
                }
                <h3 class="card-title text-h3">{{ endereco.logradouro }}, {{ endereco.numero }}</h3>
                @if (endereco.complemento) {
                  <p class="text-body-md text-on-surface-variant">{{ endereco.complemento }}</p>
                }
                <p class="text-body-md text-on-surface-variant">{{ endereco.cidade }} - {{ endereco.estado }}</p>
                <p class="text-label-sm text-on-surface-variant cep-line">CEP: {{ endereco.cep }}</p>
              </div>
              <div class="card-actions">
                <button class="action-btn" (click)="editar(endereco.id)">
                  <app-icon name="edit" [size]="16" />
                  Editar
                </button>
                <button class="action-btn action-btn--delete" (click)="remover(endereco.id)">
                  <app-icon name="trash" [size]="16" />
                  Excluir
                </button>
              </div>
            </div>
          }
          <div class="suggestion-card" routerLink="/enderecos/novo">
            <div class="suggestion-icon">
              <app-icon name="plus" [size]="32" />
            </div>
            <h3 class="text-h3 text-on-surface">Adicionar Outro</h3>
            <p class="text-body-md text-on-surface-variant suggestion-desc">Cadastre endereços de amigos ou familiares para presentes.</p>
          </div>
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
      flex-direction: column;
      gap: var(--space-md);
      margin-bottom: var(--space-xl);
    }
    @media (min-width: 768px) {
      .page-header {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
      }
      .page-title {
        margin-bottom: var(--space-base);
      }
    }
    .btn-primary-header {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-sm);
      background: var(--color-primary);
      color: var(--color-on-primary);
      padding: var(--space-md) var(--space-lg);
      border-radius: var(--radius-full);
      box-shadow: var(--shadow-card);
      transition: all var(--transition-fast);
      cursor: pointer;
      text-decoration: none;
      font-size: var(--font-size-label-bold);
      font-weight: var(--font-weight-label-bold);
      white-space: nowrap;
      align-self: flex-start;
    }
    .btn-primary-header:hover {
      box-shadow: var(--shadow-card-hover);
    }
    .enderecos-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-lg);
    }
    @media (min-width: 768px) {
      .enderecos-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media (min-width: 1024px) {
      .enderecos-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }
    .endereco-card {
      background: var(--color-surface-container-low);
      border-radius: var(--radius-xl);
      padding: var(--space-lg);
      border: 1px solid var(--color-outline-variant);
      box-shadow: var(--shadow-card);
      transition: all var(--transition-fast);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .endereco-card:hover {
      box-shadow: var(--shadow-card-hover);
    }
    .badge-default {
      display: inline-flex;
      align-items: center;
      gap: var(--space-xs);
      background: #dcfce7;
      color: #15803d;
      padding: var(--space-xs) var(--space-sm);
      border-radius: var(--radius-full);
      font-size: var(--font-size-label-sm);
      font-weight: var(--font-weight-label-sm);
      letter-spacing: var(--font-letter-spacing-label-sm);
      margin-bottom: var(--space-md);
    }
    .card-title {
      margin-bottom: var(--space-xs);
    }
    .cep-line {
      margin-top: var(--space-xs);
    }
    .card-actions {
      display: flex;
      gap: var(--space-md);
      margin-top: var(--space-lg);
      padding-top: var(--space-md);
      border-top: 1px solid var(--color-outline-variant);
    }
    .action-btn {
      display: inline-flex;
      align-items: center;
      gap: var(--space-xs);
      background: transparent;
      border: none;
      cursor: pointer;
      font-size: var(--font-size-label-bold);
      font-weight: var(--font-weight-label-bold);
      letter-spacing: var(--font-letter-spacing-label-bold);
      color: var(--color-on-surface-variant);
      padding: 0;
      transition: all var(--transition-fast);
      font-family: var(--font-family);
    }
    .action-btn:hover {
      color: var(--color-primary);
    }
    .action-btn--delete {
      color: var(--color-error);
    }
    .action-btn--delete:hover {
      opacity: 0.8;
    }
    .suggestion-card {
      border: 2px dashed var(--color-outline-variant);
      border-radius: var(--radius-xl);
      padding: var(--space-lg);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      gap: var(--space-md);
      cursor: pointer;
      transition: all var(--transition-fast);
    }
    .suggestion-card:hover {
      border-color: var(--color-primary-container);
    }
    .suggestion-icon {
      width: 64px;
      height: 64px;
      border-radius: var(--radius-full);
      background: var(--color-surface-container);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-primary);
      transition: all var(--transition-fast);
    }
    .suggestion-card:hover .suggestion-icon {
      background: var(--color-primary-fixed);
    }
    .suggestion-desc {
      max-width: 200px;
    }
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--space-2xl) 0;
      text-align: center;
      gap: var(--space-sm);
    }
    .empty-icon {
      width: 96px;
      height: 96px;
      border-radius: var(--radius-full);
      background: var(--color-surface-container);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-on-surface-variant);
      margin-bottom: var(--space-sm);
    }
    .empty-desc {
      max-width: 400px;
      margin-bottom: var(--space-md);
    }
    .btn-empty-cta {
      display: inline-flex;
      align-items: center;
      gap: var(--space-sm);
      background: var(--color-primary);
      color: var(--color-on-primary);
      padding: var(--space-md) var(--space-lg);
      border-radius: var(--radius-full);
      box-shadow: var(--shadow-card);
      transition: all var(--transition-fast);
      cursor: pointer;
      text-decoration: none;
      font-size: var(--font-size-label-bold);
      font-weight: var(--font-weight-label-bold);
    }
    .btn-empty-cta:hover {
      box-shadow: var(--shadow-card-hover);
    }
  `]
})
export class ListComponent implements OnInit {
  private service = inject(EnderecoService);
  private router = inject(Router);
  private toast = inject(ToastService);
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
        next: () => {
          this.toast.show('Endereço removido com sucesso!', 'success');
          this.load();
        },
        error: () => console.error('Erro ao remover endereço')
      });
    }
  }
}
