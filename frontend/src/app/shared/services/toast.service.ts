import { Injectable, signal } from '@angular/core';
import { ToastMessage } from '../models';

let nextId = 0;

@Injectable({ providedIn: 'root' })
export class ToastService {
  private _messages = signal<ToastMessage[]>([]);
  messages = this._messages.asReadonly();
  show(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    const id = `toast-${++nextId}`;
    this._messages.update(msgs => [...msgs, { id, message, type }]);
    setTimeout(() => {
      this._messages.update(msgs => msgs.filter(m => m.id !== id));
    }, 4000);
  }
}
