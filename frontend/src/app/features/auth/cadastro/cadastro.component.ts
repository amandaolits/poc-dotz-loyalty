import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../shared/services/toast.service';
import { ButtonComponent, InputComponent, CardComponent } from '../../../shared/components';

@Component({
  selector: 'app-cadastro', standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ButtonComponent, InputComponent, CardComponent],
  template: `
    <div class="page">
      <app-card class="card">
        <h1 class="title">Dotz</h1><p class="sub">Crie sua conta</p>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <app-input label="Email" type="email" placeholder="seu@email.com" formControlName="email" [error]="getError('email')"/>
          <app-input label="Senha" type="password" placeholder="Mínimo 6 caracteres" formControlName="senha" [error]="getError('senha')"/>
          <app-input label="Confirmar Senha" type="password" placeholder="Repita a senha" formControlName="confirmarSenha" [error]="getError('confirmarSenha')"/>
          <app-button type="submit" [disabled]="loading || form.invalid">{{ loading ? 'Cadastrando...' : 'Cadastrar' }}</app-button>
        </form>
        <p class="link">Já tem conta? <a routerLink="/login">Fazer login</a></p>
      </app-card>
    </div>`,
  styles: [`.page { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; } .card { max-width: 420px; width: 100%; } .title { color: #FF6B00; font-size: 32px; font-weight: 700; text-align: center; } .sub { color: #6B7280; text-align: center; margin-bottom: 24px; } form { display: flex; flex-direction: column; gap: 16px; } .link { text-align: center; margin-top: 16px; font-size: 14px; } .link a { color: #FF6B00; text-decoration: none; font-weight: 600; }`]
})
export class CadastroComponent {
  private fb = inject(FormBuilder); private auth = inject(AuthService); private router = inject(Router); private toast = inject(ToastService);
  form = this.fb.group({ email: ['', [Validators.required, Validators.email]], senha: ['', [Validators.required, Validators.minLength(6)]], confirmarSenha: ['', [Validators.required]] });
  loading = false;
  getError(f: string): string { const c = this.form.get(f); if (!c || !c.touched) return ''; if (c.errors?.['required']) return 'Campo obrigatório'; if (c.errors?.['email']) return 'Email inválido'; if (c.errors?.['minlength']) return 'Mínimo 6 caracteres'; if (f === 'confirmarSenha' && c.value !== this.form.get('senha')?.value) return 'Senhas não conferem'; return ''; }
  onSubmit(): void { if (this.form.invalid || this.loading) return; const { email, senha, confirmarSenha } = this.form.value; if (senha !== confirmarSenha) return; this.loading = true; this.auth.cadastre(email!, senha!).subscribe({ next: () => { this.toast.show('Conta criada!', 'success'); this.router.navigate(['/login']); }, error: () => this.loading = false }); }
}