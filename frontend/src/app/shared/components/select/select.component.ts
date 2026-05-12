import { Component, input, model, HostListener, ElementRef, viewChild } from '@angular/core';

@Component({
  selector: 'app-select',
  standalone: true,
  template: `
    <div class="select-wrapper" #wrapper>
      <button
        type="button"
        class="select-trigger"
        [class.select-trigger--open]="open()"
        (click)="toggle()"
        (keydown)="onKeydown($event)"
        #trigger
      >
        <span class="select-trigger__text" [class.select-trigger__text--placeholder]="!value()">
          {{ displayText }}
        </span>
        <svg class="select-trigger__arrow" [class.select-trigger__arrow--open]="open()" width="12" height="8" viewBox="0 0 12 8" fill="none">
          <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      @if (open()) {
        <div class="select-dropdown" #dropdown>
          <div class="select-dropdown__inner">
            <button
              type="button"
              class="select-dropdown__item"
              [class.select-dropdown__item--selected]="!value()"
              (click)="select('')"
            >
              {{ placeholder() }}
            </button>
            @for (opt of options(); track opt.value) {
              <button
                type="button"
                class="select-dropdown__item"
                [class.select-dropdown__item--selected]="value() === opt.value"
                (click)="select(opt.value)"
              >
                {{ opt.label }}
              </button>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }
    .select-wrapper { position: relative; }
    .select-trigger {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 12px 16px;
      background: var(--color-surface);
      border: 1px solid var(--color-outline-variant);
      border-radius: var(--radius-xl);
      font-size: var(--font-size-body-md);
      font-family: var(--font-family);
      color: var(--color-on-surface);
      outline: none;
      transition: all 200ms;
      cursor: pointer;
      box-sizing: border-box;
      min-height: 44px;
      text-align: left;
    }
    .select-trigger:hover {
      border-color: var(--color-primary-container);
    }
    .select-trigger:focus-visible {
      border-color: var(--color-primary-container);
      box-shadow: 0 0 0 2px var(--color-primary-fixed);
    }
    .select-trigger--open {
      border-color: var(--color-primary-container);
      box-shadow: 0 0 0 2px var(--color-primary-fixed);
    }
    .select-trigger__text {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .select-trigger__text--placeholder {
      color: var(--color-on-surface-variant);
    }
    .select-trigger__arrow {
      flex-shrink: 0;
      color: var(--color-on-surface-variant);
      transition: transform 200ms;
    }
    .select-trigger__arrow--open {
      transform: rotate(180deg);
    }
    .select-dropdown {
      position: fixed;
      z-index: 1000;
      background: var(--color-surface);
      border: 1px solid var(--color-outline-variant);
      border-radius: var(--radius-lg);
      box-shadow: 0 8px 24px rgba(0,0,0,0.12);
      overflow: hidden;
      min-width: 180px;
    }
    .select-dropdown__inner {
      max-height: 240px;
      overflow-y: auto;
    }
    .select-dropdown__inner::-webkit-scrollbar {
      width: 6px;
    }
    .select-dropdown__inner::-webkit-scrollbar-track {
      background: transparent;
    }
    .select-dropdown__inner::-webkit-scrollbar-thumb {
      background: var(--color-outline-variant);
      border-radius: 3px;
    }
    .select-dropdown__item {
      display: block;
      width: 100%;
      padding: 10px 16px;
      background: transparent;
      border: none;
      font-size: var(--font-size-body-md);
      font-family: var(--font-family);
      color: var(--color-on-surface);
      text-align: left;
      cursor: pointer;
      transition: background 150ms;
      box-sizing: border-box;
    }
    .select-dropdown__item:hover {
      background: var(--color-surface-container);
    }
    .select-dropdown__item--selected {
      color: var(--color-primary);
      font-weight: 600;
    }
  `]
})
export class SelectComponent {
  options = input<{ value: string; label: string }[]>([]);
  placeholder = input('');
  value = model('');

  protected open = model(false);

  private triggerEl = viewChild<ElementRef>('trigger');
  private dropdownEl = viewChild<ElementRef>('dropdown');
  private wrapperEl = viewChild<ElementRef>('wrapper');

  protected get displayText(): string {
    const v = this.value();
    if (!v) return this.placeholder();
    const opt = this.options().find(o => o.value === v);
    return opt ? opt.label : v;
  }

  protected toggle(): void {
    if (this.open()) {
      this.close();
    } else {
      this.open.set(true);
      setTimeout(() => this.positionDropdown());
    }
  }

  protected select(val: string): void {
    this.value.set(val);
    this.close();
  }

  private close(): void {
    this.open.set(false);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.open()) {
      this.close();
      event.preventDefault();
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggle();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const wrapper = this.wrapperEl()?.nativeElement;
    if (wrapper && !wrapper.contains(event.target)) {
      this.close();
    }
  }

  @HostListener('window:resize')
  @HostListener('window:scroll')
  onWindowEvent(): void {
    if (this.open()) {
      this.positionDropdown();
    }
  }

  @HostListener('window:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.open()) {
      this.close();
    }
  }

  private positionDropdown(): void {
    const trigger = this.triggerEl()?.nativeElement;
    const dropdown = this.dropdownEl()?.nativeElement;
    if (!trigger || !dropdown) return;

    const triggerRect = trigger.getBoundingClientRect();
    const dropdownHeight = dropdown.scrollHeight;
    const viewportHeight = window.innerHeight;

    const spaceBelow = viewportHeight - triggerRect.bottom;
    const spaceAbove = triggerRect.top;

    let top: number;
    let maxHeight: number;

    if (spaceBelow >= dropdownHeight || spaceBelow >= spaceAbove) {
      top = triggerRect.bottom;
      maxHeight = Math.min(dropdownHeight, Math.max(spaceBelow - 8, 120));
    } else {
      top = Math.max(8, triggerRect.top - dropdownHeight);
      maxHeight = Math.min(dropdownHeight, Math.max(spaceAbove - 8, 120));
    }

    dropdown.style.top = top + 'px';
    dropdown.style.left = triggerRect.left + 'px';
    dropdown.style.width = triggerRect.width + 'px';
    dropdown.querySelector('.select-dropdown__inner')!.style.maxHeight = maxHeight + 'px';
  }
}
