import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProdutosService } from '../produtos.service';
import { ApiService } from '../../../core/services/api.service';
import { Produto, SaldoResponse } from '../../../shared/models';
import { CardComponent, ButtonComponent, SkeletonComponent } from '../../../shared/components';

@Component({
  selector: 'app-produtos-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, CardComponent, ButtonComponent, SkeletonComponent],
  template: `
    <div class="container"><a routerLink="/produtos" class="back">← Voltar</a>
      @if (loading()) { <app-skeleton width="100%" height="300px"/> } @else if (produto()) {
        <div class="detail">
          @if (produto()!.imagem_url) { <img [src]="produto()!.imagem_url" [alt]="produto()!.nome" class="img"/> }
          <h1>{{ produto()!.nome }}</h1><p class="pts">{{ produto()!.pontos_necessarios | number:'1.0-0' }} Dotz</p>
          <p class="desc">{{ produto()!.descricao }}</p>
          @if (insuficiente()) { <p class="warn">⚠️ Saldo insuficiente. Faltam {{ faltantes() }} Dotz.</p> }
          <app-button [disabled]="insuficiente()" (clicked)="onResgatar()">{{ insuficiente() ? 'Saldo Insuficiente' : 'Resgatar' }}</app-button>
        </div>
      }</div>`,
  styles: [`.container { max-width: 800px; margin: 0 auto; padding: 32px 16px; } .back { color: #FF6B00; text-decoration: none; font-weight: 600; } .img { width: 100%; max-height: 400px; object-fit: cover; border-radius: 24px; margin-bottom: 24px; } h1 { font-size: 28px; font-weight: 700; } .pts { color: #FF6B00; font-size: 32px; font-weight: 700; } .desc { color: #6B7280; line-height: 1.6; margin: 16px 0; } .warn { color: #92400e; background: #fef3c7; padding: 12px 16px; border-radius: 12px; margin-bottom: 16px; }`]
})
export class DetailComponent implements OnInit {
  private route = inject(ActivatedRoute); private router = inject(Router); private service = inject(ProdutosService); private api = inject(ApiService);
  produto = signal<Produto | null>(null); loading = signal(true); insuficiente = signal(false); faltantes = signal(0);
  ngOnInit(): void { const id = this.route.snapshot.paramMap.get('id'); if (!id) return; this.service.buscarPorId(id).subscribe({ next: (p) => { this.produto.set(p); this.check(p.pontos_necessarios); }, error: () => this.loading.set(false) }); }
  check(pts: number): void { this.api.get<SaldoResponse>('/saldo').subscribe({ next: (r) => { if (r.saldo_pontos < pts) { this.insuficiente.set(true); this.faltantes.set(pts - r.saldo_pontos); } this.loading.set(false); }, error: () => this.loading.set(false) }); }
  onResgatar(): void { this.router.navigate(['/checkout'], { queryParams: { produtoId: this.produto()?.id } }); }
}
