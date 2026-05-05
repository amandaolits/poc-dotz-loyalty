import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnderecoService } from '../endereco.service';
import { ToastService } from '../../../shared/services/toast.service';
import { Endereco } from '../../../shared/models';
import { CardComponent, ButtonComponent, EmptyStateComponent } from '../../../shared/components';
import { FormComponent } from '../form/form.component';

@Component({
  selector: 'app-enderecos-list',
  standalone: true,
  imports: [CommonModule, CardComponent, ButtonComponent, EmptyStateComponent, FormComponent],
  template: `
    <div class="bar"><h1>Endereços</h1><app-button variant="secondary" size="sm" (clicked)="showForm.set(true)">+ Novo</app-button></div>
    <div class="container">
      @if (showForm()) { <app-card class="fc"><h2>{{ editingId() ? 'Editar' : 'Novo' }} Endereço</h2><app-endereco-form [editando]="!!editingId()" [endereco]="editEndereco()" (submitted)="onSave($event)"/><app-button variant="secondary" size="sm" (clicked)="cancel()">Cancelar</app-button></app-card> }
      @if (enderecos().length === 0) { <app-empty-state icon="📍" message="Nenhum endereço cadastrado"/> }
      @else { <div class="grid">@for (e of enderecos(); track e.id) { <app-card><p><strong>{{ e.logradouro }}, {{ e.numero }}</strong></p><p>{{ e.bairro }} - {{ e.cidade }}, {{ e.estado }}</p><p>CEP: {{ e.cep }}</p>@if (e.padrao) { <span class="badge">Padrão</span> }<div class="act"><app-button variant="secondary" size="sm" (clicked)="edit(e)">Editar</app-button><app-button variant="secondary" size="sm" (clicked)="del(e.id)">Excluir</app-button></div></app-card> }</div> }</div>`,
  styles: [`.bar { background: white; padding: 24px 32px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #E5E7EB; } .container { padding: 32px 16px; } .fc { margin-bottom: 24px; } .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; } .badge { display: inline-block; background: #d1fae5; color: #065f46; padding: 2px 8px; border-radius: 9999px; font-size: 12px; } .act { display: flex; gap: 8px; margin-top: 12px; }`]
})
export class ListComponent implements OnInit {
  private service = inject(EnderecoService); private toast = inject(ToastService);
  enderecos = signal<Endereco[]>([]); showForm = signal(false); editingId = signal<string | null>(null); editEndereco = signal<Endereco | null>(null);
  ngOnInit(): void { this.load(); }
  load(): void { this.service.listar().subscribe(r => this.enderecos.set(r)); }
  onSave(d: any): void {
    if (this.editingId()) { this.service.atualizar(this.editingId()!, d).subscribe({ next: () => { this.toast.show('Atualizado', 'success'); this.load(); this.cancel(); } }); }
    else { this.service.criar(d).subscribe({ next: () => { this.toast.show('Criado', 'success'); this.load(); this.cancel(); } }); }
  }
  edit(e: Endereco): void { this.editingId.set(e.id); this.editEndereco.set(e); this.showForm.set(true); }
  del(id: string): void { this.service.remover(id).subscribe({ next: () => { this.toast.show('Removido', 'success'); this.load(); } }); }
  cancel(): void { this.showForm.set(false); this.editingId.set(null); this.editEndereco.set(null); }
}
