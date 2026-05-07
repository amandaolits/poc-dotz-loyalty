import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EnderecoService } from '../endereco.service';
import { Endereco } from '../../../shared/models';
import { NavbarComponent, FooterComponent, SkeletonComponent } from '../../../shared/components';
import { FormComponent } from '../form/form.component';

@Component({
  selector: 'app-editar-endereco',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, SkeletonComponent, FormComponent],
  template: `
    <app-navbar />
    <main class="container form-page">
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
  `]
})
export class EditarEnderecoComponent implements OnInit {
  private service = inject(EnderecoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
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
    this.service.atualizar(id, dados).subscribe(() => this.router.navigate(['/enderecos']));
  }
}
