import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ListComponent } from "./list.component";
import { PedidoService } from "../pedido.service";
import { provideHttpClient } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";

describe("PedidosListComponent", () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let service: jasmine.SpyObj<PedidoService>;

  const mockPedidos = [
    { id: "p1", usuario_id: "u1", produto_id: "pr1", endereco_entrega_id: "e1", pontos_gastos: 5000, status: "Confirmado", data_pedido: "2024-01-01", produto_nome: "Fone" },
  ];

  beforeEach(async () => {
    service = jasmine.createSpyObj("PedidoService", ["listar"]);

    await TestBed.configureTestingModule({
      imports: [ListComponent],
      providers: [
        provideHttpClient(),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null }, queryParamMap: { get: () => null } } } },
        { provide: PedidoService, useValue: service },
      ],
    }).compileComponents();
  });

  it("should load pedidos on init", () => {
    service.listar.and.returnValue(of(mockPedidos));

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.pedidos().length).toBe(1);
  });

  it("should apply filter", () => {
    service.listar.and.returnValue(of(mockPedidos));
    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.aplicarFiltro("30d");

    expect(component.filtroAtivo()).toBe("30d");
  });
});
