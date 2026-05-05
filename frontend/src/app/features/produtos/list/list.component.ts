import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProdutosService } from '../produtos.service';
import { Produto } from '../../../shared/models';
import { CardComponent, SkeletonComponent, EmptyStateComponent } from '../../../shared/components';

@Component({
  selector: 'app-produtos-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, CardComponent, SkeletonComponent, EmptyStateComponent],
  template: `
    <div class="bar"><h1>Produtos</h1><input type="text" placeholder="Buscar..." [(ngModel)]="busca" (ngModelChange)="load()" class="search"/></div>
    <div class="container">@if (loading()) { <div class="grid">@for (i of [1,2,3,4,5,6]; track i) { <app-card><app-skeleton height="160px"/><app-skeleton width="80%" height="20px"/></app-card> } </div> } @else if (produtos().length === 0) { <app-empty-state message="Nenhum produto encontrado"/> } @else { <div class="grid">@for (p of produtos(); track p.id) { <app-card [clickable]="true" routerLink="/produtos/{{ p.id }}"><img [src]="p.imagem_url" [alt]="p.nome" class="img"/><h3>{{ p.nome }}</h3><p class="pts">{{ p.pontos_necessarios | number:'1.0-0' }} Dotz</p>@if (p.categoria) { <span class="chip">{{ p.categoria }}</span> }</app-card> } </div> }</div>`,
  styles: [`.bar { background: white; padding: 24px 32px; display: flex; align-items: center; gap: 16px; border-bottom: 1px solid #E5E7EB; } .search { flex: 1; max-width: 320px; padding: 10px 16px; border: 1px solid #D1D5DB; border-radius: 12px; } .container { padding: 32px 16px; } .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 24px; } .img { width: 100%; height: 160px; object-fit: cover; border-radius: 12px; margin-bottom: 12px; } .pts { color: #FF6B00; font-weight: 700; font-size: 18px; } .chip { display: inline-block; padding: 4px 10px; background: #fff1eb; color: #a04100; border-radius: 9999px; font-size: 12px; }`]
})
export class ListComponent implements OnInit {
  private service = inject(ProdutosService);
  produtos = signal<Produto[]>([]); loading = signal(true); busca = '';
  ngOnInit(): void { this.load(); }
  load(): void { this.loading.set(true); this.service.listar({ busca: this.busca || undefined }).subscribe({ next: (r) => { this.produtos.set(r.produtos); this.loading.set(false); }, error: () => this.loading.set(false) }); }
}
