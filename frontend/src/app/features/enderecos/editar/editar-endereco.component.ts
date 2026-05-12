import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EnderecoService } from '../endereco.service';
import { Endereco } from '../../../shared/models';
import { NavbarComponent, FooterComponent, SkeletonComponent } from '../../../shared/components';
import { IconComponent } from '../../../shared/icons';
import { FormComponent } from '../form/form.component';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-editar-endereco',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, FooterComponent, IconComponent, SkeletonComponent, FormComponent],
  template: `
    <app-navbar />
    <main class="container form-page">
      <a routerLink="/enderecos" class="back-link">
        <app-icon name="arrow-left" [size]="16" /> Voltar
      </a>
      @if (loading()) {
        <app-skeleton height="200px" />
      } @else {
        <h1 class="page-title">Editar Endereço</h1>
        <app-endereco-form [editando]="true" [endereco]="endereco()" (submitted)="atualizar($event)" />
      }
    </main>
    <app-footer />
  `,
  styles: [`
    .form-page { padding-top: var(--space-xl); padding-bottom: var(--space-2xl); }
    .page-title { font-size: var(--font-size-h1); font-weight: var(--font-weight-h1); color: var(--color-on-surface); margin-bottom: var(--space-lg); }
    .back-link { display: inline-flex; align-items: center; gap: var(--space-sm); color: var(--color-primary); text-decoration: none; font-weight: var(--font-weight-label-bold); margin-bottom: var(--space-lg); }
    .back-link:hover { text-decoration: underline; }
  `]
})
export class EditarEnderecoComponent implements OnInit {
  private service = inject(EnderecoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(ToastService);
  endereco = signal<Endereco | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.service.listar().subscribe({
      next: (lista) => {
        const found = lista.find(e => e.id === id);
        this.endereco.set(found || null);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  atualizar(dados: any): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.service.atualizar(id, dados).subscribe(() => {
      this.toast.show('Endereço atualizado com sucesso!', 'success');
      this.router.navigate(['/enderecos']);
    });
  }
}
