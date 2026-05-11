import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DetailComponent } from "./detail.component";
import { PedidoService } from "../pedido.service";
import { provideHttpClient } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";

describe("PedidosDetailComponent", () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let service: jasmine.SpyObj<PedidoService>;

  const mockPedido = {
    id: "p1", usuario_id: "u1", produto_id: "pr1", endereco_entrega_id: "e1",
    pontos_gastos: 5000, status: "Confirmado", data_pedido: "2024-01-01",
    produto_nome: "Fone", logradouro: "Rua A", numero: "100", bairro: "Centro", cidade: "SP", estado: "SP",
  };

  beforeEach(async () => {
    service = jasmine.createSpyObj("PedidoService", ["buscarPorId"]);

    await TestBed.configureTestingModule({
      imports: [DetailComponent],
      providers: [
        provideHttpClient(),
        { provide: PedidoService, useValue: service },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => "p1" } } } },
      ],
    }).compileComponents();
  });

  it("should load pedido on init", () => {
    service.buscarPorId.and.returnValue(of(mockPedido));

    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.pedido()?.status).toBe("Confirmado");
    expect(service.buscarPorId).toHaveBeenCalledWith("p1");
  });
});
