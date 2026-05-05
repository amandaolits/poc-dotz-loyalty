import { Component, input } from '@angular/core';
import { ReactiveFormsModule, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input', standalone: true, imports: [ReactiveFormsModule],
  template: `<label class="label">{{ label() }}</label><input [type]="type()" [placeholder]="placeholder()" [formControl]="control" class="input" [class.error]="error()"/>@if (error()) { <span class="error-msg">{{ error() }}</span> }`,
  styles: [`.label { display: block; font-size: 14px; font-weight: 600; margin-bottom: 6px; } .input { width: 100%; padding: 12px 16px; border: 1px solid #D1D5DB; border-radius: 12px; font-size: 16px; font-family: inherit; } .input:focus { outline: none; border-color: #FF6B00; box-shadow: 0 0 0 2px rgba(255,107,0,0.2); } .input.error { border-color: #ba1a1a; } .error-msg { color: #ba1a1a; font-size: 12px; }`],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: InputComponent, multi: true }]
})
export class InputComponent {
  label = input(''); type = input('text'); placeholder = input(''); error = input('');
  control = new FormControl('');
  onChange: any = () => {}; onTouched: any = () => {};
  writeValue(v: string): void { this.control.setValue(v, { emitEvent: false }); }
  registerOnChange(fn: any): void { this.onChange = fn; this.control.valueChanges.subscribe(fn); }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
}
