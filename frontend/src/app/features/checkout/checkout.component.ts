import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../shared/services/toast.service';
import { Endereco } from '../../shared/models';
import { CardComponent, ButtonComponent, EmptyStateComponent } from '../../shared/components';

@Component({
  selector: 'app-checkout', standalone: true,
  imports: [CommonModule, RouterLink, CardComponent, ButtonComponent, EmptyStateComponent],
  template: `
    <div class="container"><a routerLink="/dashboard" class="back">← Voltar</a><h1>Resgate</h1>
      @if (enderecos().length === 0) { <app-empty-state icon="📍" message="Cadastre um endereço para resgatar"/><div class="center"><app-button (clicked)="router.navigate(['/enderecos'])">Cadastrar Endereço</app-button></div> }
      @else { <div class="section"><h2>Escolha o endereço</h2>@for (e of enderecos(); track e.id) { <app-card [clickable]="true" (click)="selected.set(e)" [class.sel]="selected()?.id === e.id"><p><strong>{{ e.logradouro }}, {{ e.numero }}</strong></p><p>{{ e.bairro }} - {{ e.cidade }}, {{ e.estado }}</p><p>CEP: {{ e.cep }}</p>@if (e.padrao) { <span class="badge">Padrão</span> }</app-card> }</div><app-button variant="primary" [disabled]="!selected()" (clicked)="onConfirmar()">Confirmar Resgate</app-button> }</div>`,
  styles: [`.container { max-width: 600px; margin: 0 auto; padding: 32px 16px; } .back { color: #FF6B00; text-decoration: none; font-weight: 600; } h1 { font-size: 24px; font-weight: 700; margin: 16px 0 24px; } h2 { font-size: 18px; font-weight: 600; margin-bottom: 16px; } .sel { border: 2px solid #FF6B00; } .badge { display: inline-block; background: #d1fae5; color: #065f46; padding: 2px 8px; border-radius: 9999px; font-size: 12px; } .center { text-align: center; margin-top: 24px; }`]
})
export class CheckoutComponent implements OnInit {
  private route = inject(ActivatedRoute); private api = inject(ApiService); private toast = inject(ToastService);
  router = inject(Router);
  enderecos = signal<Endereco[]>([]); selected = signal<Endereco | null>(null); produtoId = '';
  ngOnInit(): void { this.produtoId = this.route.snapshot.queryParamMap.get('produtoId') || ''; this.load(); }
  load(): void { this.api.get<Endereco[]>('/enderecos').subscribe({ next: (r) => { this.enderecos.set(r); const p = r.find(e => e.padrao); if (p) this.selected.set(p); } }); }
  onConfirmar(): void { const e = this.selected(); if (!e || !this.produtoId) return; this.api.post('/resgates', { produto_id: this.produtoId, endereco_id: e.id }).subscribe({ next: () => { this.toast.show('Resgate realizado!', 'success'); this.router.navigate(['/pedidos']); } }); }
}
