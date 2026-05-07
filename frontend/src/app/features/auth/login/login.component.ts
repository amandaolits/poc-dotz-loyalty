import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { IconComponent } from '../../../shared/icons/icon.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, IconComponent],
  template: `
    <div class="bg-gradient"></div>

    <header class="header">
      <div class="header-inner">
        <span class="logo">Dotz</span>
      </div>
    </header>

    <main class="main">
      <div class="main-inner">
        <div class="card">
          @if (errorMessage) {
          <div class="error-banner">
            <app-icon name="alert-circle" [size]="20" color="#DC2626" />
            <span>{{ errorMessage }}</span>
          </div>
          }

          <div class="card-header">
            <h1 class="card-title">Boas-vindas de volta</h1>
            <p class="card-subtitle">Acesse sua conta para gerenciar seus Dotz.</p>
          </div>

          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <div class="field">
              <label class="field-label" for="email">E-mail</label>
              <div class="input-wrapper">
                <div class="input-icon-left">
                  <app-icon name="mail" [size]="20" color="#8e7164" />
                </div>
                <input
                  id="email"
                  type="email"
                  formControlName="email"
                  placeholder="seuemail@exemplo.com"
                  class="input"
                  [class.input-error]="form.get('email')?.touched && form.get('email')?.invalid"
                />
              </div>
            </div>

            <div class="field">
              <div class="password-header">
                <label class="field-label" for="password">Senha</label>
                <a class="forgot-link" href="#">Esqueceu a senha?</a>
              </div>
              <div class="input-wrapper">
                <div class="input-icon-left">
                  <app-icon name="lock" [size]="20" color="#8e7164" />
                </div>
                <input
                  id="password"
                  [type]="showPassword ? 'text' : 'password'"
                  formControlName="senha"
                  placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;"
                  class="input"
                  [class.input-error]="form.get('senha')?.touched && form.get('senha')?.invalid"
                />
                <button type="button" class="toggle-vis" (click)="showPassword = !showPassword" aria-label="Alternar visibilidade da senha">
                  <app-icon [name]="showPassword ? 'eye-off' : 'eye'" [size]="20" />
                </button>
              </div>
            </div>

            <button type="submit" class="submit-btn" [disabled]="loading || form.invalid">
              {{ loading ? 'Entrando...' : 'Entrar' }}
            </button>
          </form>

          <div class="social-divider">
            <span class="divider-line"></span>
            <span class="divider-text">ou continue com</span>
            <span class="divider-line"></span>
          </div>

          <div class="social-buttons">
            <button type="button" class="social-btn" (click)="loginGoogle()">
              <span class="social-btn-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </span>
              Entrar com Google
            </button>
            <button type="button" class="social-btn" (click)="loginApple()">
              <span class="social-btn-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" fill="currentColor"/>
                </svg>
              </span>
              Entrar com Apple
            </button>
          </div>

          <div class="register-link">
            <p class="register-text">Ainda não tem conta? <a class="register-anchor" routerLink="/cadastro">Cadastre-se</a></p>
          </div>
        </div>
      </div>
    </main>

    <footer class="footer">
      <div class="footer-inner">
        <span class="footer-logo">Dotz</span>
        <div class="footer-links">
          <a class="footer-link" href="#">Privacidade</a>
          <a class="footer-link" href="#">Termos</a>
          <a class="footer-link" href="#">Ajuda</a>
          <a class="footer-link" href="#">Parceiros</a>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background: var(--color-background);
      font-family: var(--font-family);
    }

    .bg-gradient {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 300px;
      background: linear-gradient(to bottom, transparent, var(--color-surface-container-low));
      pointer-events: none;
      z-index: 0;
    }

    .header {
      position: sticky;
      top: 0;
      z-index: 50;
      background: white;
      border-bottom: 1px solid #e2e8f0;
      padding: 16px 0;
    }

    .header-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
      text-align: center;
    }

    .logo {
      font-size: 30px;
      font-weight: 900;
      color: #ea580c;
      letter-spacing: -0.05em;
      line-height: 1;
    }

    .main {
      flex-grow: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 48px 24px;
      position: relative;
      z-index: 1;
    }

    .main-inner {
      width: 100%;
      max-width: 420px;
    }

    .card {
      background: white;
      border-radius: var(--radius-lg);
      padding: var(--space-lg);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
    }

    .error-banner {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: var(--space-md);
      padding: var(--space-sm) var(--space-md);
      background: var(--color-error-container);
      border: 1px solid rgba(220, 38, 38, 0.15);
      border-radius: var(--radius-md);
      font-size: var(--font-size-label-bold);
      font-weight: var(--font-weight-label-bold);
      color: var(--color-on-error-container);
    }

    .card-header {
      text-align: center;
      margin-bottom: var(--space-lg);
    }

    .card-title {
      font-size: var(--font-size-h2);
      font-weight: var(--font-weight-h2);
      color: var(--color-on-surface);
      line-height: var(--font-line-height-h2);
      margin-bottom: var(--space-xs);
    }

    .card-subtitle {
      font-size: var(--font-size-body-md);
      font-weight: var(--font-weight-body-md);
      color: var(--color-on-surface-variant);
      line-height: var(--font-line-height-body-md);
    }

    form {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
    }

    .field-label {
      font-size: var(--font-size-label-bold);
      font-weight: var(--font-weight-label-bold);
      color: var(--color-on-surface);
      margin-left: 4px;
    }

    .password-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .forgot-link {
      font-size: var(--font-size-label-sm);
      font-weight: var(--font-weight-label-sm);
      color: var(--color-primary);
      text-decoration: none;
      margin-right: 4px;
    }

    .forgot-link:hover {
      text-decoration: underline;
    }

    .input-wrapper {
      position: relative;
    }

    .input-icon-left {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      align-items: center;
      pointer-events: none;
      z-index: 1;
    }

    .input {
      width: 100%;
      padding: 16px 16px 16px 48px;
      background: var(--color-surface-container-low);
      border: 1px solid var(--color-outline-variant);
      border-radius: var(--radius-xl);
      font-size: var(--font-size-body-md);
      font-family: inherit;
      color: var(--color-on-surface);
      outline: none;
      transition: all 0.3s;
    }

    .input::placeholder {
      color: var(--color-on-surface-variant);
      opacity: 0.5;
    }

    .input:focus {
      border-color: var(--color-primary);
      box-shadow: 0 0 0 2px rgba(255, 107, 0, 0.15);
      background: white;
    }

    .input-error {
      border-color: var(--color-error) !important;
      box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.15) !important;
    }

    .toggle-vis {
      position: absolute;
      right: 16px;
      top: 50%;
      transform: translateY(-50%);
      color: #94a3b8;
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      display: flex;
      align-items: center;
    }

    .toggle-vis:hover {
      color: #475569;
    }

    .submit-btn {
      width: 100%;
      padding: 16px 24px;
      background: var(--color-primary);
      color: white;
      font-size: 18px;
      font-weight: 600;
      border: none;
      border-radius: 9999px;
      cursor: pointer;
      box-shadow: 0 10px 15px -3px rgba(255, 107, 0, 0.3);
      transition: all 0.2s;
    }

    .submit-btn:hover:not(:disabled) {
      filter: brightness(0.95);
    }

    .submit-btn:active:not(:disabled) {
      filter: brightness(0.9);
    }

    .submit-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .social-divider {
      display: flex;
      align-items: center;
      gap: 16px;
      margin: var(--space-md) 0;
    }

    .divider-line {
      flex: 1;
      height: 1px;
      background: #e2e8f0;
    }

    .divider-text {
      font-size: var(--font-size-label-sm);
      font-weight: var(--font-weight-label-sm);
      color: var(--color-on-surface-variant);
      white-space: nowrap;
    }

    .social-buttons {
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
      margin-bottom: var(--space-md);
    }

    .social-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      width: 100%;
      padding: 14px 0;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: var(--radius-xl);
      font-size: var(--font-size-body-md);
      font-weight: 500;
      color: var(--color-on-surface);
      cursor: pointer;
      transition: all 0.2s;
    }

    .social-btn:hover {
      background: #f8fafc;
      border-color: #cbd5e1;
    }

    .social-btn-icon {
      display: flex;
      align-items: center;
    }

    .register-link {
      text-align: center;
    }

    .register-text {
      font-size: var(--font-size-body-md);
      font-weight: var(--font-weight-body-md);
      color: var(--color-on-surface-variant);
    }

    .register-anchor {
      color: var(--color-primary);
      font-weight: 700;
      text-decoration: none;
    }

    .register-anchor:hover {
      text-decoration: underline;
    }

    .footer {
      background: #f9fafb;
      border-top: 1px solid #e2e8f0;
      padding: 24px 0;
      position: relative;
      z-index: 1;
    }

    .footer-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 24px;
    }

    .footer-logo {
      font-size: 18px;
      font-weight: 700;
      color: #94a3b8;
    }

    .footer-links {
      display: flex;
      gap: 24px;
      flex-wrap: wrap;
      justify-content: center;
    }

    .footer-link {
      font-size: 12px;
      color: #64748b;
      text-decoration: none;
      transition: color 0.2s;
    }

    .footer-link:hover {
      color: #1e293b;
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
  errorMessage: string | null = null;
  showPassword = false;

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
    this.errorMessage = null;
    const { email, senha } = this.form.value;
    this.auth.login(email!, senha!).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.erro || 'Erro ao fazer login. Tente novamente.';
      }
    });
  }

  loginGoogle(): void {
    // TODO: implement Google OAuth
  }

  loginApple(): void {
    // TODO: implement Apple OAuth
  }
}
