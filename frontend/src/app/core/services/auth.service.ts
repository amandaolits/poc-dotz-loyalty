import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { Usuario, LoginResponse } from '../../shared/models';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = inject(ApiService);
  private router = inject(Router);
  private _usuario = signal<Usuario | null>(null);
  usuario = this._usuario.asReadonly();
  private _authenticated = signal(false);
  authenticated = this._authenticated.asReadonly();

  getToken(): string | null { return localStorage.getItem('dotz_token'); }
  setToken(token: string): void { localStorage.setItem('dotz_token', token); }
  removeToken(): void { localStorage.removeItem('dotz_token'); }

  login(email: string, senha: string): Observable<LoginResponse> {
    return this.api.post<LoginResponse>('/login', { email, senha }).pipe(
      tap((res) => { this.setToken(res.token); this._usuario.set(res.usuario); this._authenticated.set(true); })
    );
  }
  cadastre(email: string, senha: string): Observable<void> { return this.api.post<void>('/usuarios', { email, senha }); }
  loadMe(): Observable<Usuario> {
    return this.api.get<Usuario>('/me').pipe(tap((u) => { this._usuario.set(u); this._authenticated.set(true); }));
  }
  logout(): void { this.removeToken(); this._usuario.set(null); this._authenticated.set(false); this.router.navigate(['/login']); }
  init(): void { if (this.getToken()) this.loadMe().subscribe({ error: () => this.logout() }); }
}
