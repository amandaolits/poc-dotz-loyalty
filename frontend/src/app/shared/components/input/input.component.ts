import { Component, input } from '@angular/core';
import { ReactiveFormsModule, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IconComponent } from '../../icons';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [ReactiveFormsModule, IconComponent],
  template: `
    <label class="label">{{ label() }}</label>
    <div class="input-wrapper">
      @if (prefixIcon()) {
        <span class="prefix-icon">
          <app-icon [name]="prefixIcon()" [size]="16" />
        </span>
      }
      <input
        [type]="type()"
        [placeholder]="placeholder()"
        [formControl]="control"
        class="input"
        [class.error]="error()"
      />
      @if (suffixIcon()) {
        <span class="suffix-icon">
          <app-icon [name]="suffixIcon()" [size]="16" />
        </span>
      }
    </div>
    @if (error()) {
      <span class="error-msg">{{ error() }}</span>
    }
  `,
  styles: [`
    .label {
      display: block;
      font-size: var(--font-size-label-bold);
      font-weight: var(--font-weight-label-bold);
      color: var(--color-on-surface);
      margin-bottom: var(--space-sm);
    }
    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }
    .input {
      width: 100%;
      padding: var(--space-md) var(--space-lg);
      border: 1px solid var(--color-outline-variant);
      border-radius: var(--radius-lg);
      font-size: var(--font-size-body-md);
      font-family: var(--font-family);
      color: var(--color-on-surface);
      background: var(--color-surface);
      transition: all var(--transition-fast);
      min-height: 44px;
    }
    .input:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: var(--shadow-focus);
    }
    .input.error {
      border-color: var(--color-error);
    }
    .prefix-icon,
    .suffix-icon {
      position: absolute;
      color: var(--color-on-surface-variant);
      font-size: 16px;
      pointer-events: none;
    }
    .prefix-icon {
      left: var(--space-md);
    }
    .suffix-icon {
      right: var(--space-md);
    }
    .input-wrapper:has(.prefix-icon) .input {
      padding-left: 40px;
    }
    .input-wrapper:has(.suffix-icon) .input {
      padding-right: 40px;
    }
    .error-msg {
      display: block;
      color: var(--color-error);
      font-size: var(--font-size-label-sm);
      margin-top: var(--space-xs);
    }
  `],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: InputComponent, multi: true }]
})
export class InputComponent {
  label = input('');
  type = input('text');
  placeholder = input('');
  error = input('');
  prefixIcon = input('');
  suffixIcon = input('');
  control = new FormControl('');

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(v: string): void {
    this.control.setValue(v, { emitEvent: false });
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
    this.control.valueChanges.subscribe(fn);
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
