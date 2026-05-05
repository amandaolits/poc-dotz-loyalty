import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../../shared/services/toast.service';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  const auth = inject(AuthService);
  return next(req).pipe(catchError((error: HttpErrorResponse) => {
    if (error.status === 401) { auth.logout(); toast.show('Sessão expirada', 'error'); }
    else if (error.status === 400 || error.status === 422) toast.show(error.error?.erro || 'Erro de validação', 'error');
    else if (error.status === 500) toast.show('Erro inesperado', 'error');
    return throwError(() => error);
  }));
};
