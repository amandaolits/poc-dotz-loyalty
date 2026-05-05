import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';
import { SaldoResponse } from '../../shared/models';
import { CardComponent, SkeletonComponent } from '../../shared/components';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, CardComponent, SkeletonComponent],
  template: `
    <nav class="header"><span class="logo">Dotz</span><div class="right">@if (usuario()) { <span>Olá, {{ usuario()!.email.split('@')[0] }}</span> }<button (click)="auth.logout()">Sair</button></div></nav>
    <div class="container">
      <app-card class="saldo">@if (loading()) { <app-skeleton width="120px" height="48px"/> } @else { <p class="label">Seu saldo</p><p class="value">{{ saldo() | number:'1.0-0' }} <span class="d">Dotz</span></p> }</app-card>
      <div class="links">
        <a routerLink="/produtos" class="link"><span>🛒</span>Produtos</a>
        <a routerLink="/pedidos" class="link"><span>📦</span>Pedidos</a>
        <a routerLink="/extrato" class="link"><span>📋</span>Extrato</a>
        <a routerLink="/enderecos" class="link"><span>📍</span>Endereços</a>
      </div>
    </div>`,
  styles: [`.header { background: white; padding: 16px 32px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #E5E7EB; } .logo { color: #FF6B00; font-size: 24px; font-weight: 700; } .right { display: flex; align-items: center; gap: 16px; } .saldo { margin-top: 32px; text-align: center; padding: 40px; } .label { color: #6B7280; } .value { color: #FF6B00; font-size: 48px; font-weight: 700; } .d { font-size: 24px; color: #6B7280; } .links { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-top: 32px; } @media (min-width: 768px) { .links { grid-template-columns: repeat(4, 1fr); } } .link { display: flex; flex-direction: column; align-items: center; padding: 24px; background: white; border-radius: 16px; text-decoration: none; color: #261812; border: 1px solid #E5E7EB; } .link span { font-size: 32px; margin-bottom: 8px; }`]
})
export class DashboardComponent implements OnInit {
  auth = inject(AuthService); private api = inject(ApiService);
  usuario = this.auth.usuario; saldo = signal(0); loading = signal(true);
  ngOnInit(): void { this.api.get<SaldoResponse>('/saldo').subscribe({ next: (r) => { this.saldo.set(r.saldo_pontos); this.loading.set(false); }, error: () => this.loading.set(false) }); }
}
