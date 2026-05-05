import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { Produto, ProdutoListResponse } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class ProdutosService {
  private api = inject(ApiService);
  listar(p: { categoria?: string; busca?: string; pagina?: number }): Observable<ProdutoListResponse> {
    return this.api.get('/produtos', { categoria: p.categoria, busca: p.busca, pagina: String(p.pagina || 1), limite: '12' });
  }
  buscarPorId(id: string): Observable<Produto> { return this.api.get(`/produtos/${id}`); }
}
