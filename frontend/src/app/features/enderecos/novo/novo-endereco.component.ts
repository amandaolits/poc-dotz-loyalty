import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EnderecoService } from '../endereco.service';
import { NavbarComponent, FooterComponent } from '../../../shared/components';
import { FormComponent } from '../form/form.component';

@Component({
  selector: 'app-novo-endereco',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, FormComponent],
  template: `
    <app-navbar />
    <main class="container form-page">
      <h1 class="page-title">Novo Endereço</h1>
      <app-endereco-form (submitted)="salvar($event)" />
    </main>
    <app-footer />
  `,
  styles: [`
    .form-page { padding-top: var(--space-xl); padding-bottom: var(--space-2xl); }
    .page-title { font-size: var(--font-size-h1); font-weight: var(--font-weight-h1); color: var(--color-on-surface); margin-bottom: var(--space-lg); }
  `]
})
export class NovoEnderecoComponent {
  private service = inject(EnderecoService);
  private router = inject(Router);

  salvar(dados: any): void {
    this.service.criar(dados).subscribe(() => this.router.navigate(['/enderecos']));
  }
}
