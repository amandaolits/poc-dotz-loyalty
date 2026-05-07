import { Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state', standalone: true,
  template: `<div class="empty"><p class="empty-icon">{{ icon() }}</p><p class="empty-text">{{ message() }}</p></div>`,
  styles: [`.empty { text-align: center; padding: 48px 24px; } .empty-icon { font-size: 48px; margin-bottom: 16px; } .empty-text { color: #6B7280; font-size: 16px; }`]
})
export class EmptyStateComponent { icon = input('📦'); message = input('Nenhum item encontrado'); }
