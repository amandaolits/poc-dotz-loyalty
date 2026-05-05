import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { Endereco } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class EnderecoService {
  private api = inject(ApiService);
  listar(): Observable<Endereco[]> { return this.api.get<Endereco[]>('/enderecos'); }
  criar(d: any): Observable<Endereco> { return this.api.post<Endereco>('/enderecos', d); }
  atualizar(id: string, d: any): Observable<Endereco> { return this.api.put<Endereco>(`/enderecos/${id}`, d); }
  remover(id: string): Observable<void> { return this.api.delete<void>(`/enderecos/${id}`); }
}
