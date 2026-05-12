import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EnderecoService } from '../endereco.service';
import { NavbarComponent, FooterComponent } from '../../../shared/components';
import { IconComponent } from '../../../shared/icons';
import { FormComponent } from '../form/form.component';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-novo-endereco',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, FooterComponent, IconComponent, FormComponent],
  template: `
    <app-navbar />
    <main class="container form-page">
      <a routerLink="/enderecos" class="back-link">
        <app-icon name="arrow-left" [size]="16" /> Voltar
      </a>
      <h1 class="page-title">Novo Endereço</h1>
      <app-endereco-form (submitted)="salvar($event)" />
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
export class NovoEnderecoComponent {
  private service = inject(EnderecoService);
  private router = inject(Router);
  private toast = inject(ToastService);

  salvar(dados: any): void {
    this.service.criar(dados).subscribe(() => {
      this.toast.show('Endereço cadastrado com sucesso!', 'success');
      this.router.navigate(['/enderecos']);
    });
  }
}
