import { Component, input } from '@angular/core';

@Component({
  selector: 'app-card', standalone: true,
  template: `<div class="card" [class.clickable]="clickable()"><ng-content></ng-content></div>`,
  styles: [`.card { background: white; border-radius: 24px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #E5E7EB; } .card.clickable { cursor: pointer; transition: box-shadow 0.2s; } .card.clickable:hover { box-shadow: 0 8px 20px rgba(0,0,0,0.08); }`]
})
export class CardComponent { clickable = input(false); }
