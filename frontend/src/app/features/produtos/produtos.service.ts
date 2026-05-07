import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { Produto, ProdutoListResponse } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class ProdutosService {
  private api = inject(ApiService);
  listar(p: { categoria?: string; subcategoria?: string; busca?: string; pagina?: number }): Observable<ProdutoListResponse> {
    const params: Record<string, string> = {};
    if (p.categoria) params['categoria'] = p.categoria;
    if (p.subcategoria) params['subcategoria'] = p.subcategoria;
    if (p.busca) params['busca'] = p.busca;
    params['pagina'] = String(p.pagina || 1);
    params['limite'] = '12';
    return this.api.get('/produtos', params);
  }
  buscarPorId(id: string): Observable<Produto> { return this.api.get(`/produtos/${id}`); }
  detalhe(id: string): Observable<Produto> { return this.buscarPorId(id); }
}
