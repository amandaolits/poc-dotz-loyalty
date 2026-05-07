import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { IconComponent } from '../../../shared/icons/icon.component';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, IconComponent],
  template: `
    <header class="header">
      <div class="header-inner">
        <div class="header-left">
          <span class="logo">Dotz</span>
          <nav class="header-nav">
            <a class="nav-link" href="#">Início</a>
            <a class="nav-link" href="#">Como Funciona</a>
            <a class="nav-link" href="#">Parceiros</a>
          </nav>
        </div>
        <div class="header-right">
          <div class="header-greeting">
            <p class="greeting-top">Olá, visitante</p>
            <p class="greeting-bottom">Minha Conta</p>
          </div>
          <button class="menu-btn" aria-label="Menu">
            <app-icon name="menu" [size]="28" />
          </button>
        </div>
      </div>
    </header>

    <main class="main">
      <div class="main-grid">
        <div class="hero-column">
          <h1 class="hero-title">Ganhe recompensas incríveis a cada compra.</h1>
          <p class="hero-subtitle">Junte-se a milhões de usuários no Dotz e transforme seus gastos do dia a dia em viagens, eletrônicos e experiências inesquecíveis.</p>
          <div class="feature-cards">
            <div class="feature-card">
              <div class="feature-icon">
                <app-icon name="redeem" [size]="24" color="var(--color-primary)" />
              </div>
              <span class="feature-text">Mais de 50.000 opções de trocas</span>
            </div>
            <div class="feature-card">
              <div class="feature-icon">
                <app-icon name="rocket-launch" [size]="24" color="var(--color-primary)" />
              </div>
              <span class="feature-text">Acúmulo acelerado em lojas parceiras</span>
            </div>
          </div>
        </div>

        <div class="form-column">
          <div class="card">
            <div class="card-header">
              <h2 class="card-title">Criar conta</h2>
              <p class="card-subtitle">Preencha os dados abaixo para começar a ganhar.</p>
            </div>

            <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form">
              <div class="field">
                <label class="field-label" for="email">E-mail</label>
                <input
                  id="email"
                  type="email"
                  formControlName="email"
                  placeholder="seu@email.com"
                  class="input"
                  [class.input-error]="form.get('email')?.touched && form.get('email')?.invalid"
                />
                @if (form.get('email')?.touched && form.get('email')?.invalid) {
                  <span class="field-error">{{ getError('email') }}</span>
                }
              </div>

              <div class="field">
                <label class="field-label" for="password">Senha</label>
                <input
                  id="password"
                  type="password"
                  formControlName="senha"
                  placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;"
                  class="input"
                  [class.input-error]="form.get('senha')?.touched && form.get('senha')?.invalid"
                />
                <p class="field-hint">Mínimo 6 caracteres</p>
                @if (form.get('senha')?.touched && form.get('senha')?.invalid) {
                  <span class="field-error">{{ getError('senha') }}</span>
                }
              </div>

              <div class="field">
                <label class="field-label" for="confirmarSenha">Confirmar Senha</label>
                <input
                  id="confirmarSenha"
                  type="password"
                  formControlName="confirmarSenha"
                  placeholder="Confirme sua senha"
                  class="input"
                  [class.input-error]="form.get('confirmarSenha')?.touched && form.get('confirmarSenha')?.invalid"
                />
                @if (form.get('confirmarSenha')?.touched && form.get('confirmarSenha')?.invalid) {
                  <span class="field-error">{{ getError('confirmarSenha') }}</span>
                }
              </div>

              <div class="checkbox-row">
                <input class="checkbox-input" id="terms" type="checkbox" />
                <label class="checkbox-label" for="terms">Li e aceito os <a class="checkbox-link" href="#">Termos de Uso</a> e a <a class="checkbox-link" href="#">Política de Privacidade</a>.</label>
              </div>

              <button type="submit" class="submit-btn" [disabled]="loading || form.invalid">
                {{ loading ? 'Cadastrando...' : 'Cadastrar' }}
              </button>
            </form>

            <div class="divider">
              <p class="login-text">Já tenho conta? <a class="login-link" routerLink="/login">Faça login</a></p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <div class="blur blur-bottom-left"></div>
    <div class="blur blur-top-right"></div>
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
      background: white;
      box-shadow: 0px 10px 30px rgba(0,0,0,0.04);
    }

    .header-inner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 32px;
    }

    .logo {
      font-size: 28px;
      font-weight: 900;
      color: #ea580c;
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
      color: #6b7280;
      text-decoration: none;
      padding: 8px 12px;
      border-radius: 6px;
      transition: all 0.2s;
    }

    .nav-link:hover {
      background: #f9fafb;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .header-greeting {
      display: none;
      text-align: right;
    }

    @media (min-width: 640px) {
      .header-greeting { display: block; }
    }

    .greeting-top {
      font-size: var(--font-size-label-sm);
      color: var(--color-secondary);
    }

    .greeting-bottom {
      font-size: var(--font-size-label-bold);
      font-weight: var(--font-weight-label-bold);
      color: var(--color-on-surface);
    }

    .menu-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      border-radius: 9999px;
      color: #6b7280;
      display: flex;
      align-items: center;
      transition: background 0.2s;
    }

    .menu-btn:hover {
      background: #f9fafb;
    }

    .main {
      flex-grow: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 24px;
      padding-top: 100px;
      padding-bottom: 24px;
    }

    .main-grid {
      width: 100%;
      max-width: 1200px;
      display: grid;
      gap: 32px;
      align-items: center;
    }

    @media (min-width: 768px) {
      .main-grid {
        grid-template-columns: 1fr 1fr;
      }
    }

    .hero-column {
      display: none;
    }

    @media (min-width: 768px) {
      .hero-column {
        display: block;
      }
    }

    .hero-title {
      font-size: var(--font-size-h1);
      font-weight: var(--font-weight-h1);
      color: var(--color-on-surface);
      margin-bottom: 16px;
      line-height: 1.2;
    }

    .hero-subtitle {
      font-size: var(--font-size-body-lg);
      color: var(--color-secondary);
      margin-bottom: 24px;
      max-width: 500px;
      line-height: 1.6;
    }

    .feature-cards {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .feature-card {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 16px;
      background: white;
      border-radius: 8px;
      box-shadow: 0px 10px 30px rgba(0,0,0,0.02);
    }

    .feature-icon {
      width: 40px;
      height: 40px;
      background: var(--color-primary-fixed);
      border-radius: 9999px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .feature-text {
      font-size: var(--font-size-label-bold);
      font-weight: var(--font-weight-label-bold);
      color: var(--color-on-surface);
    }

    .form-column {
      display: flex;
      justify-content: center;
    }

    @media (min-width: 768px) {
      .form-column {
        justify-content: flex-end;
      }
    }

    .card {
      background: white;
      padding: 24px;
      border-radius: 16px;
      box-shadow: 0px 10px 30px rgba(0,0,0,0.04);
      width: 100%;
      max-width: 480px;
    }

    @media (min-width: 768px) {
      .card {
        padding: 32px;
      }
    }

    .card-header {
      margin-bottom: 24px;
    }

    .card-title {
      font-size: var(--font-size-h2);
      font-weight: var(--font-weight-h2);
      color: var(--color-on-surface);
      margin-bottom: 4px;
    }

    .card-subtitle {
      font-size: var(--font-size-body-md);
      color: var(--color-secondary);
    }

    .form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .field-label {
      font-size: var(--font-size-label-bold);
      font-weight: var(--font-weight-label-bold);
      color: var(--color-on-surface);
    }

    .input {
      width: 100%;
      padding: 12px 16px;
      background: #F2F4F7;
      border: none;
      border-radius: 8px;
      outline: none;
      font-size: var(--font-size-body-md);
      font-family: inherit;
      color: var(--color-on-surface);
      transition: all 0.2s;
    }

    .input::placeholder {
      color: var(--color-on-surface-variant);
    }

    .input:focus {
      box-shadow: 0 0 0 2px var(--color-primary-container);
      background: white;
    }

    .input-error {
      box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.3);
    }

    .field-hint {
      font-size: var(--font-size-label-sm);
      color: var(--color-secondary);
      padding: 0 4px;
    }

    .field-error {
      font-size: var(--font-size-label-sm);
      color: var(--color-error);
    }

    .checkbox-row {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      margin-top: 4px;
    }

    .checkbox-input {
      margin-top: 2px;
      border-radius: 4px;
      border-color: var(--color-outline-variant);
      accent-color: var(--color-primary);
      flex-shrink: 0;
    }

    .checkbox-label {
      font-size: var(--font-size-label-sm);
      color: var(--color-secondary);
      line-height: 1.4;
    }

    .checkbox-link {
      color: var(--color-primary);
      font-weight: 700;
      text-decoration: underline;
    }

    .submit-btn {
      width: 100%;
      padding: 14px 24px;
      background: var(--color-primary);
      color: white;
      font-size: 18px;
      font-weight: 600;
      border-radius: 9999px;
      border: none;
      cursor: pointer;
      box-shadow: 0 10px 15px -3px rgba(255, 107, 0, 0.3);
      transition: all 0.2s;
      margin-top: 16px;
    }

    .submit-btn:hover:not(:disabled) {
      opacity: 0.9;
    }

    .submit-btn:active:not(:disabled) {
      transform: scale(0.98);
    }

    .submit-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .divider {
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
    }

    .login-text {
      font-size: var(--font-size-body-md);
      color: var(--color-secondary);
    }

    .login-link {
      color: var(--color-primary);
      font-weight: 700;
      text-decoration: none;
    }

    .login-link:hover {
      text-decoration: underline;
    }

    .blur {
      position: fixed;
      border-radius: 9999px;
      pointer-events: none;
      z-index: -10;
    }

    .blur-bottom-left {
      bottom: -80px;
      left: -80px;
      width: 320px;
      height: 320px;
      background: rgba(255, 237, 213, 0.3);
      filter: blur(64px);
    }

    .blur-top-right {
      top: 80px;
      right: 40px;
      width: 160px;
      height: 160px;
      background: rgba(255, 237, 213, 0.2);
      filter: blur(32px);
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
    confirmarSenha: ['', Validators.required]
  });

  loading = false;

  getError(f: string): string {
    const c = this.form.get(f);
    if (!c || !c.touched) return '';
    if (c.errors?.['required']) return 'Campo obrigatório';
    if (c.errors?.['email']) return 'Email inválido';
    if (c.errors?.['minlength']) return 'Mínimo 6 caracteres';
    if (f === 'confirmarSenha' && this.form.value.senha !== this.form.value.confirmarSenha) return 'Senhas não conferem';
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
