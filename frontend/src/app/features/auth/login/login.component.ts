import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonComponent, InputComponent, CardComponent } from '../../../shared/components';
import { IconComponent } from '../../../shared/icons';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ButtonComponent, InputComponent, CardComponent, IconComponent],
  template: `
    <div class="login-page">
      <div class="login-card">
        <app-card variant="elevated">
          <div class="login-header">
            <h1 class="logo">Dotz</h1>
            <p class="subtitle">Acesse sua conta</p>
          </div>
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="login-form">
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
              placeholder="Sua senha"
              formControlName="senha"
              [error]="getError('senha')"
              prefixIcon="lock"
            />
            <app-button type="submit" [disabled]="loading || form.invalid" class="submit-btn">
              {{ loading ? 'Entrando...' : 'Entrar' }}
            </app-button>
          </form>
          <p class="link">
            Não tem conta? <a routerLink="/cadastro">Cadastre-se</a>
          </p>
        </app-card>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-lg);
      background: var(--color-background);
    }
    .login-card {
      max-width: 420px;
      width: 100%;
    }
    .login-header {
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
    .login-form {
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
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]]
  });

  loading = false;

  getError(f: string): string {
    const c = this.form.get(f);
    if (!c || !c.touched) return '';
    if (c.errors?.['required']) return 'Campo obrigatório';
    if (c.errors?.['email']) return 'Email inválido';
    if (c.errors?.['minlength']) return 'Mínimo 6 caracteres';
    return '';
  }

  onSubmit(): void {
    if (this.form.invalid || this.loading) return;
    this.loading = true;
    const { email, senha } = this.form.value;
    this.auth.login(email!, senha!).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: () => this.loading = false
    });
  }
}
