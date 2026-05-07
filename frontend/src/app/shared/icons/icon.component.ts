import { Component, input } from '@angular/core';

@Component({
  selector: 'app-icon',
  standalone: true,
  template: `
    <svg class="icon" [attr.width]="size()" [attr.height]="size()" viewBox="0 0 24 24" fill="none" [attr.stroke]="color() || 'currentColor'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [attr.aria-label]="ariaLabel() || null" [attr.aria-hidden]="ariaLabel() ? null : 'true'" [attr.role]="ariaLabel() ? 'img' : null">
      @switch (name()) {
        @case ('mail') {
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
        }
        @case ('lock') {
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
        }
        @case ('shopping-cart') {
          <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
        }
        @case ('package') {
          <polyline points="16.5 9.4 7.55 4.24"/><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.29 7 12 12 20.71 7"/>
        }
        @case ('list') {
          <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
        }
        @case ('map-pin') {
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
        }
        @case ('sparkles') {
          <path d="M12 3l1.66 3.34L17 6.5l-3.34 1.66L12 11.5l-1.66-3.34L7 6.5l3.34-1.66L12 3z"/><path d="M18 14l1.5 3L21 17l-3 1.5L18 22l-1.5-3L13 17l3-1.5z"/><path d="M6 14l1.5-3L9 14l-3 1.5L6 19l-1.5-3L1 14l3-1.5z"/>
        }
        @case ('search') {
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        }
        @case ('chevron-right') {
          <polyline points="9 18 15 12 9 6"/>
        }
        @case ('check') {
          <polyline points="20 6 9 17 4 12"/>
        }
        @case ('plus') {
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        }
        @case ('trash') {
          <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/><path d="M10 11v6"/><path d="M14 11v6"/>
        }
        @case ('edit') {
          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
        }
        @case ('arrow-left') {
          <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
        }
        @case ('arrow-right') {
          <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
        }
      }
    </svg>
  `,
  styles: [`
    .icon { display: inline-block; vertical-align: middle; flex-shrink: 0; }
  `]
})
export class IconComponent {
  name = input.required<string>();
  size = input<number>(24);
  color = input<string>('');
  ariaLabel = input<string>('');
}
