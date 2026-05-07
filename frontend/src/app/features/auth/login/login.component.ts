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
    <header class="header">
      <div class="header-inner">
        <div class="header-left">
          <span class="logo">Dotz</span>
          <nav class="header-nav">
            <a class="nav-link" href="#">Ganhar Dotz</a>
            <a class="nav-link" href="#">Trocar Dotz</a>
            <a class="nav-link" href="#">Parceiros</a>
            <a class="nav-link" href="#">Sobre</a>
          </nav>
        </div>
        <div class="header-right">
          <div class="header-greeting">
            <span class="greeting-text">Olá, visitante</span>
            <span class="greeting-divider"></span>
            <a class="greeting-link" href="#">Minha Conta</a>
          </div>
        </div>
      </div>
    </header>

    <main class="main">
      <div class="main-inner">
        <div class="card">
          <div class="card-header">
            <h1 class="text-h2 text-on-surface">Entrar na sua conta</h1>
            <p class="text-body-md text-on-surface-variant" style="margin-top: var(--space-xs)">Bem-vindo de volta ao mundo Dotz</p>
          </div>

          @if (error) {
          <div class="error-banner">
            <app-icon name="alert-circle" [size]="20" color="#DC2626" />
            <span class="error-text">E-mail ou senha inválidos</span>
          </div>
          }

          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <div class="field">
              <label class="field-label" for="email">E-mail</label>
              <input
                id="email"
                type="email"
                formControlName="email"
                placeholder="seuemail@exemplo.com"
                class="input"
                [class.input-error]="form.get('email')?.touched && form.get('email')?.invalid"
              />
            </div>

            <div class="field">
              <div class="password-header">
                <label class="field-label" for="password">Senha</label>
                <a class="forgot-link" href="#">Esqueceu a senha?</a>
              </div>
              <div class="password-wrapper">
                <input
                  id="password"
                  [type]="showPassword ? 'text' : 'password'"
                  formControlName="senha"
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
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

          <div class="register-link">
            <p class="register-text">Ainda não tem conta? <a class="register-anchor" routerLink="/cadastro">Cadastrar-se</a></p>
          </div>
        </div>

        <div class="promo-grid">
          <div class="promo-card">
            <div class="promo-icon-wrap">
              <app-icon name="shield" [size]="20" color="var(--color-primary)" />
            </div>
            <span class="promo-label">Acesso Seguro</span>
          </div>
          <div class="promo-card">
            <div class="promo-icon-wrap">
              <app-icon name="shopping-bag" [size]="20" color="var(--color-primary)" />
            </div>
            <span class="promo-label">Milhares de Trocas</span>
          </div>
        </div>
      </div>
    </main>

    <footer class="footer">
      <div class="footer-inner">
        <span class="footer-logo">Dotz</span>
        <div class="footer-links">
          <a class="footer-link" href="#">Termos</a>
          <a class="footer-link" href="#">Privacidade</a>
          <a class="footer-link" href="#">Ajuda</a>
          <a class="footer-link" href="#">Contato</a>
        </div>
        <p class="footer-copy">&copy; 2024 Dotz. Todos os direitos reservados.</p>
      </div>
    </footer>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background: var(--color-background);
    }

    .header {
      position: fixed;
      top: 0;
      width: 100%;
      z-index: 50;
      background: rgba(255,255,255,0.9);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border-bottom: 1px solid #f1f5f9;
      height: 80px;
    }

    .header-inner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100%;
      padding: 0 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 32px;
    }

    .logo {
      font-size: 30px;
      font-weight: 900;
      color: #ea580c;
      letter-spacing: -0.05em;
      line-height: 1;
    }

    .header-nav {
      display: none;
      gap: 24px;
    }

    @media (min-width: 768px) {
      .header-nav { display: flex; }
    }

    .nav-link {
      font-size: 14px;
      font-weight: 600;
      color: #475569;
      text-decoration: none;
      transition: color 0.3s;
    }

    .nav-link:hover { color: #ea580c; }

    .header-right {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .header-greeting {
      display: none;
      align-items: center;
      gap: 8px;
      color: #64748b;
      font-size: 14px;
      font-weight: 500;
    }

    @media (min-width: 640px) {
      .header-greeting { display: flex; }
    }

    .greeting-divider {
      display: inline-block;
      width: 1px;
      height: 16px;
      background: #cbd5e1;
    }

    .greeting-link {
      color: #ea580c;
      font-weight: 700;
      text-decoration: none;
    }

    .greeting-link:hover { text-decoration: underline; }

    .main {
      flex-grow: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 128px 24px 24px;
    }

    .main-inner {
      width: 100%;
      max-width: 480px;
    }

    .card {
      background: white;
      border-radius: var(--radius-lg);
      padding: var(--space-lg);
      border: 1px solid #e2e8f0;
      box-shadow: 0 20px 60px rgba(0,0,0,0.1);
    }

    .card-header {
      text-align: center;
      margin-bottom: var(--space-md);
    }

    .error-banner {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: var(--space-md);
      padding: var(--space-md);
      background: rgba(254, 226, 226, 0.3);
      border: 1px solid rgba(220, 38, 38, 0.1);
      border-radius: var(--radius-full);
    }

    .error-text {
      color: var(--color-error);
      font-weight: var(--font-weight-label-bold);
      font-size: var(--font-size-label-bold);
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
      margin-left: var(--space-md);
    }

    .password-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-left: var(--space-md);
    }

    .forgot-link {
      font-size: var(--font-size-label-sm);
      color: var(--color-primary);
      text-decoration: none;
      margin-right: var(--space-md);
    }

    .forgot-link:hover { text-decoration: underline; }

    .password-wrapper {
      position: relative;
    }

    .input {
      width: 100%;
      background: var(--color-surface-container-low);
      border: none;
      border-radius: var(--radius-full);
      padding: 16px 24px;
      font-size: var(--font-size-body-md);
      font-family: inherit;
      color: var(--color-on-surface);
      transition: all 0.3s;
      outline: none;
    }

    .input::placeholder {
      color: var(--color-on-surface-variant);
      opacity: 0.5;
    }

    .input:focus {
      box-shadow: 0 0 0 2px var(--color-primary-container);
      background: white;
    }

    .input-error {
      box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.3);
    }

    .toggle-vis {
      position: absolute;
      right: 20px;
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

    .toggle-vis:hover { color: #475569; }

    .submit-btn {
      width: 100%;
      background: var(--color-primary-container);
      color: var(--color-on-primary);
      font-size: var(--font-size-h3);
      font-weight: var(--font-weight-h3);
      padding: 16px 0;
      border: none;
      border-radius: var(--radius-full);
      cursor: pointer;
      transition: all 0.3s;
      box-shadow: 0 4px 14px rgba(255, 107, 0, 0.2);
    }

    .submit-btn:hover:not(:disabled) {
      transform: scale(1.02);
    }

    .submit-btn:active:not(:disabled) {
      transform: scale(0.98);
    }

    .submit-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .register-link {
      margin-top: var(--space-lg);
      text-align: center;
    }

    .register-text {
      font-size: var(--font-size-body-md);
      color: var(--color-on-surface-variant);
    }

    .register-anchor {
      color: #ea580c;
      font-weight: 700;
      text-decoration: none;
    }

    .register-anchor:hover {
      text-decoration: underline;
      text-underline-offset: 4px;
      text-decoration-thickness: 2px;
    }

    .promo-grid {
      margin-top: var(--space-md);
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-md);
    }

    .promo-card {
      background: rgba(255,255,255,0.5);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      padding: var(--space-md);
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .promo-icon-wrap {
      width: 40px;
      height: 40px;
      background: var(--color-primary-fixed);
      border-radius: var(--radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .promo-label {
      font-size: 12px;
      font-weight: var(--font-weight-label-bold);
      color: var(--color-on-surface-variant);
    }

    .footer {
      width: 100%;
      padding: 48px 0;
      margin-top: auto;
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
    }

    .footer-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24px;
    }

    @media (min-width: 768px) {
      .footer-inner {
        flex-direction: row;
        justify-content: space-between;
      }
    }

    .footer-logo {
      font-size: 18px;
      font-weight: 700;
      color: #94a3b8;
    }

    .footer-links {
      display: flex;
      gap: 32px;
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
      text-decoration-color: #ea580c;
      text-underline-offset: 4px;
    }

    .footer-copy {
      font-size: 12px;
      color: #64748b;
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
  error = false;
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
    this.error = false;
    const { email, senha } = this.form.value;
    this.auth.login(email!, senha!).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: () => {
        this.loading = false;
        this.error = true;
      }
    });
  }
}
