import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { CardComponent } from '../../../shared/components/card/card.component';

@Component({
  selector: 'app-login', standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ButtonComponent, InputComponent, CardComponent],
  template: `
    <div class="login-page">
      <app-card class="card">
        <h1 class="title">Dotz</h1><p class="sub">Acesse sua conta</p>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <app-input label="Email" type="email" placeholder="seu@email.com" formControlName="email" [error]="getError('email')"/>
          <app-input label="Senha" type="password" placeholder="Sua senha" formControlName="senha" [error]="getError('senha')"/>
          <app-button type="submit" [disabled]="loading || form.invalid">{{ loading ? 'Entrando...' : 'Entrar' }}</app-button>
        </form>
        <p class="link">Não tem conta? <a routerLink="/cadastro">Cadastre-se</a></p>
      </app-card>
    </div>`,
  styles: [`.login-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; } .card { max-width: 420px; width: 100%; } .title { color: #FF6B00; font-size: 32px; font-weight: 700; text-align: center; } .sub { color: #6B7280; text-align: center; margin-bottom: 24px; } form { display: flex; flex-direction: column; gap: 16px; } .link { text-align: center; margin-top: 16px; font-size: 14px; } .link a { color: #FF6B00; text-decoration: none; font-weight: 600; }`]
})
export class LoginComponent {
  private fb = inject(FormBuilder); private auth = inject(AuthService); private router = inject(Router);
  form = this.fb.group({ email: ['', [Validators.required, Validators.email]], senha: ['', [Validators.required, Validators.minLength(6)]] });
  loading = false;
  getError(f: string): string { const c = this.form.get(f); if (!c || !c.touched) return ''; if (c.errors?.['required']) return 'Campo obrigatório'; if (c.errors?.['email']) return 'Email inválido'; if (c.errors?.['minlength']) return 'Mínimo 6 caracteres'; return ''; }
  onSubmit(): void { if (this.form.invalid || this.loading) return; this.loading = true; const { email, senha } = this.form.value; this.auth.login(email!, senha!).subscribe({ next: () => this.router.navigate(['/dashboard']), error: () => this.loading = false }); }
}