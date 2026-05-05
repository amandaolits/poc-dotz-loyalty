import { Injectable, signal } from '@angular/core';
import { ToastMessage } from '../models';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private _messages = signal<ToastMessage[]>([]);
  messages = this._messages.asReadonly();
  show(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    this._messages.set([{ message, type }]);
    setTimeout(() => this._messages.set([]), 4000);
  }
}
