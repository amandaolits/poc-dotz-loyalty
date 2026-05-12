import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast', standalone: true, imports: [CommonModule],
  template: `@for (msg of toast.messages(); track msg.id) { <div class="toast toast-{{ msg.type }}">{{ msg.message }}</div> }`,
  styles: [`.toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); padding: 12px 24px; border-radius: 12px; font-weight: 500; z-index: 1000; } .toast-success { background: #059669; color: white; } .toast-error { background: #ba1a1a; color: white; } .toast-info { background: #0062a1; color: white; }`]
})
export class ToastComponent { toast = inject(ToastService); }
