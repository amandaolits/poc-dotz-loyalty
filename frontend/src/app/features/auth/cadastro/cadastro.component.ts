import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonComponent, InputComponent, CardComponent } from '../../../shared/components';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ButtonComponent, InputComponent, CardComponent],
  template: `
    <div class="cadastro-page">
      <app-card class="cadastro-card elevated">
        <div class="cadastro-header">
          <h1 class="logo">Dotz</h1>
          <p class="subtitle">Crie sua conta</p>
        </div>
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="cadastro-form">
          <app-input
            label="Email"
            type="email"
            placeholder="seu@email.com"
            formControlName="email"
            [error]="getError('email')"
              prefixIcon="mail"
          />
          <app-input
            label="Senha"
            type="password"
            placeholder="Mínimo 6 caracteres"
            formControlName="senha"
            [error]="getError('senha')"
              prefixIcon="lock"
          />
          <app-input
            label="Confirmar Senha"
            type="password"
            placeholder="Confirme sua senha"
            formControlName="confirmarSenha"
            [error]="getError('confirmarSenha')"
              prefixIcon="lock"
          />
          <app-button type="submit" [disabled]="loading || form.invalid" class="submit-btn">
            {{ loading ? 'Cadastrando...' : 'Cadastrar' }}
          </app-button>
        </form>
        <p class="link">
          Já tem conta? <a routerLink="/login">Faça login</a>
        </p>
      </app-card>
    </div>
  `,
  styles: [`
    .cadastro-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-lg);
      background: var(--color-background);
    }
    .cadastro-card {
      max-width: 420px;
      width: 100%;
    }
    .cadastro-header {
      text-align: center;
      margin-bottom: var(--space-xl);
    }
    .logo {
      color: var(--color-primary);
      font-size: var(--font-size-h1);
      font-weight: var(--font-weight-h1);
      line-height: var(--font-line-height-h1);
      letter-spacing: var(--font-letter-spacing-h1);
      margin-bottom: var(--space-sm);
    }
    .subtitle {
      color: var(--color-on-surface-variant);
      font-size: var(--font-size-body-md);
    }
    .cadastro-form {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }
    .submit-btn {
      width: 100%;
      margin-top: var(--space-sm);
    }
    .link {
      text-align: center;
      margin-top: var(--space-lg);
      font-size: var(--font-size-label-bold);
      color: var(--color-on-surface-variant);
    }
    .link a {
      color: var(--color-primary);
      text-decoration: none;
      font-weight: var(--font-weight-h2);
    }
    .link a:hover {
      text-decoration: underline;
    }
  `]
})
export class CadastroComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]],
    confirmarSenha: ['', [Validators.required]]
  });

  loading = false;

  getError(f: string): string {
    const c = this.form.get(f);
    if (!c || !c.touched) return '';
    if (c.errors?.['required']) return 'Campo obrigatório';
    if (c.errors?.['email']) return 'Email inválido';
    if (c.errors?.['minlength']) return 'Mínimo 6 caracteres';
    if (f === 'confirmarSenha' && this.form.value.senha !== this.form.value.confirmarSenha) {
      return 'Senhas não conferem';
    }
    return '';
  }

  onSubmit(): void {
    if (this.form.invalid || this.loading) return;
    if (this.form.value.senha !== this.form.value.confirmarSenha) return;
    this.loading = true;
    const { email, senha } = this.form.value;
    this.auth.cadastre(email!, senha!).subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.loading = false
    });
  }
}
