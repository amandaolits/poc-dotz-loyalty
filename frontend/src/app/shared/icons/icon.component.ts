import { Component, input } from '@angular/core';

@Component({
  selector: 'app-icon',
  standalone: true,
  template: `
    <svg class="icon" [attr.width]="size()" [attr.height]="size()" viewBox="0 0 24 24" fill="none" [attr.stroke]="color() || 'currentColor'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [attr.aria-label]="ariaLabel() || null" [attr.aria-hidden]="ariaLabel() ? null : 'true'" [attr.role]="ariaLabel() ? 'img' : null">
      @switch (name()) {
        @case ('mail') {
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline>
        }
        @case ('lock') {
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0110 0v4"></path>
        }
        @case ('shopping-cart') {
          <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"></path>
        }
        @case ('package') {
          <polyline points="16.5 9.4 7.55 4.24"></polyline><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"></path><polyline points="3.29 7 12 12 20.71 7"></polyline>
        }
        @case ('list') {
          <line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line>
        }
        @case ('map-pin') {
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"></path><circle cx="12" cy="10" r="3"></circle>
        }
        @case ('sparkles') {
          <path d="M12 3l1.66 3.34L17 6.5l-3.34 1.66L12 11.5l-1.66-3.34L7 6.5l3.34-1.66L12 3z"></path><path d="M18 14l1.5 3L21 17l-3 1.5L18 22l-1.5-3L13 17l3-1.5z"></path><path d="M6 14l1.5-3L9 14l-3 1.5L6 19l-1.5-3L1 14l3-1.5z"></path>
        }
        @case ('search') {
          <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        }
        @case ('chevron-left') {
          <polyline points="15 18 9 12 15 6"></polyline>
        }
        @case ('chevron-right') {
          <polyline points="9 18 15 12 9 6"></polyline>
        }
        @case ('check') {
          <polyline points="20 6 9 17 4 12"></polyline>
        }
        @case ('plus') {
          <line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>
        }
        @case ('trash') {
          <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"></path><path d="M10 11v6"></path><path d="M14 11v6"></path>
        }
        @case ('edit') {
          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        }
        @case ('arrow-left') {
          <line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline>
        }
        @case ('arrow-right') {
          <line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline>
        }
        @case ('wallet') {
          <path d="M21 12v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2M3 12V6a2 2 0 012-2h14a2 2 0 012 2v6"></path><circle cx="16" cy="14" r="2"></circle>
        }
        @case ('shopping-bag') {
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 01-8 0"></path>
        }
        @case ('truck') {
          <path d="M5 17h14M5 17a2 2 0 11-4 0V7a2 2 0 012-2h12a2 2 0 012 2v10M19 17a2 2 0 104 0v-5l-3-4h-3"></path>
        }
        @case ('receipt') {
          <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1V2l-2 1-2-1-2 1-2-1-2 1-2-1z"></path><line x1="8" y1="7" x2="16" y2="7"></line><line x1="8" y1="11" x2="14" y2="11"></line><line x1="8" y1="15" x2="12" y2="15"></line>
        }
        @case ('plus-circle') {
          <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line>
        }
        @case ('stars') {
          <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5z"></path><path d="M18 16l1 2.5L22 19l-2.5 1L18 23l-1-2.5L14 19l2.5-1z"></path><path d="M6 16l-1 2.5L2 19l2.5 1L6 23l1-2.5L10 19l-2.5-1z"></path>
        }
        @case ('trending-up') {
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline>
        }
        @case ('check-circle') {
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>
        }
        @case ('clock') {
          <circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline>
        }
        @default {
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
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
