import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { Transacao, ExtratoResponse } from '../../shared/models';
import { CardComponent, SkeletonComponent, EmptyStateComponent } from '../../shared/components';

@Component({
  selector: 'app-extrato', standalone: true,
  imports: [CommonModule, FormsModule, CardComponent, SkeletonComponent, EmptyStateComponent],
  template: `
    <div class="bar"><h1>Extrato</h1><select [(ngModel)]="periodo" (change)="load()" class="filter"><option value="">Todos</option><option value="1m">Último mês</option><option value="3m">3 meses</option><option value="6m">6 meses</option></select></div>
    <div class="container">
      @if (loading()) { @for (i of [1,2,3]; track i) { <app-card style="margin-bottom:12px"><app-skeleton width="60%" height="16px"/></app-card> } }
      @else if (transacoes().length === 0) { <app-empty-state icon="📋" message="Nenhuma transação"/> }
      @else { @for (t of transacoes(); track t.id) { <app-card class="tx"><div class="info"><span class="tipo" [class.g]="t.tipo === 'ganho'" [class.r]="t.tipo === 'resgate'">{{ t.tipo === 'ganho' ? '⬆ Ganho' : '⬇ Resgate' }}</span><span class="desc">{{ t.descricao }}</span></div><div class="right"><span class="pts" [class.g]="t.tipo === 'ganho'" [class.r]="t.tipo === 'resgate'">{{ t.tipo === 'ganho' ? '+' : '-' }}{{ t.pontos }}</span><span class="date">{{ t.data_criacao | date:'dd/MM/yyyy HH:mm' }}</span></div></app-card> } }</div>`,
  styles: [`.bar { background: white; padding: 24px 32px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #E5E7EB; } .filter { padding: 8px 12px; border: 1px solid #D1D5DB; border-radius: 8px; } .container { padding: 32px 16px; } .tx { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; } .tipo { font-weight: 600; font-size: 14px; } .tipo.g { color: #059669; } .tipo.r { color: #FF6B00; } .desc { color: #6B7280; font-size: 14px; } .right { text-align: right; } .pts { font-weight: 700; font-size: 18px; display: block; } .pts.g { color: #059669; } .pts.r { color: #FF6B00; } .date { color: #9CA3AF; font-size: 12px; }`]
})
export class ExtratoComponent implements OnInit {
  private api = inject(ApiService);
  transacoes = signal<Transacao[]>([]); loading = signal(true); periodo = '';
  ngOnInit(): void { this.load(); }
  load(): void { this.loading.set(true); const params: Record<string, string> = {}; if (this.periodo) params['periodo'] = this.periodo; this.api.get<ExtratoResponse>('/extrato', params).subscribe({ next: (r) => { this.transacoes.set(r.transacoes); this.loading.set(false); }, error: () => this.loading.set(false) }); }
}