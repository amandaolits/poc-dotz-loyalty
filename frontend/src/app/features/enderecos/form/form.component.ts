import { Component, inject, OnInit, input, output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Endereco } from '../../../shared/models';
import { InputComponent, ButtonComponent } from '../../../shared/components';

@Component({
  selector: 'app-endereco-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, ButtonComponent],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form">
      <div class="row">
        <app-input label="CEP" formControlName="cep" [error]="getError('cep')" />
        <app-input label="Estado" formControlName="estado" [error]="getError('estado')" />
      </div>

      <app-input label="Logradouro" formControlName="logradouro" [error]="getError('logradouro')" />

      <div class="row">
        <app-input label="Número" formControlName="numero" [error]="getError('numero')" />
        <app-input label="Complemento" formControlName="complemento" />
      </div>

      <app-input label="Bairro" formControlName="bairro" [error]="getError('bairro')" />

      <app-input label="Cidade" formControlName="cidade" [error]="getError('cidade')" />

      <div class="default-section">
        <label class="default-label">
          <input type="checkbox" formControlName="padrao" class="default-checkbox" />
          <span>Definir como endereço padrão</span>
        </label>
        <p class="default-hint">O endereço padrão será selecionado automaticamente nas trocas.</p>
      </div>

      <app-button type="submit" class="submit-btn" [disabled]="form.invalid">
        {{ editando() ? 'Salvar' : 'Cadastrar' }}
      </app-button>
    </form>`,
  styles: [`
    .form { display: flex; flex-direction: column; gap: 16px; }
    .row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .default-section {
      background: var(--color-surface-container-low, #f5f5f5);
      border: 1px solid var(--color-outline-variant, #cac4d0);
      border-radius: var(--radius-xl, 12px);
      padding: 16px;
      margin-top: 16px;
    }
    .default-label {
      display: flex; align-items: center; gap: 12px;
      font-weight: 600; font-size: 14px; cursor: pointer;
    }
    .default-checkbox { width: 18px; height: 18px; accent-color: var(--color-primary, #ff6d00); }
    .default-hint {
      font-size: 12px; color: var(--color-on-surface-variant, #49454f);
      margin-top: 8px; margin-left: 30px;
    }
    .submit-btn { width: 100%; }
  `]
})
export class FormComponent implements OnInit {
  private fb = inject(FormBuilder);
  editando = input(false); endereco = input<Endereco | null>(null);
  submitted = output<any>();
  form = this.fb.group({ cep: ['', Validators.required], logradouro: ['', Validators.required], numero: ['', Validators.required], complemento: [''], bairro: ['', Validators.required], cidade: ['', Validators.required], estado: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]], padrao: [false] });
  ngOnInit(): void { if (this.endereco()) this.form.patchValue(this.endereco()!); }
  getError(f: string): string { const c = this.form.get(f); if (!c || !c.touched) return ''; if (c.errors?.['required']) return 'Campo obrigatório'; return ''; }
  onSubmit(): void { if (this.form.invalid) return; this.submitted.emit(this.form.value); }
}
