import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'cadastro', loadComponent: () => import('./features/auth/cadastro/cadastro.component').then(m => m.CadastroComponent) },
  { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent), canActivate: [authGuard] },
  { path: 'produtos', loadComponent: () => import('./features/produtos/list/list.component').then(m => m.ListComponent), canActivate: [authGuard] },
  { path: 'produtos/:id', loadComponent: () => import('./features/produtos/detail/detail.component').then(m => m.DetailComponent), canActivate: [authGuard] },
  { path: 'checkout', loadComponent: () => import('./features/checkout/checkout.component').then(m => m.CheckoutComponent), canActivate: [authGuard] },
  { path: 'enderecos', loadComponent: () => import('./features/enderecos/list/list.component').then(m => m.ListComponent), canActivate: [authGuard] },
  { path: 'extrato', loadComponent: () => import('./features/extrato/extrato.component').then(m => m.ExtratoComponent), canActivate: [authGuard] },
  { path: 'pedidos', loadComponent: () => import('./features/pedidos/list/list.component').then(m => m.ListComponent), canActivate: [authGuard] },
  { path: 'pedidos/:id', loadComponent: () => import('./features/pedidos/detail/detail.component').then(m => m.DetailComponent), canActivate: [authGuard] },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' },
];
