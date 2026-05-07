import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { Pedido } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private api = inject(ApiService);
  listar(params?: Record<string, string>): Observable<Pedido[]> { return this.api.get<Pedido[]>('/pedidos', params); }
  buscarPorId(id: string): Observable<Pedido> { return this.api.get<Pedido>(`/pedidos/${id}`); }
}