import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CheckoutComponent } from "./checkout.component";
import { ApiService } from "../../core/services/api.service";
import { ProdutosService } from "../produtos/produtos.service";
import { EnderecoService } from "../enderecos/endereco.service";
import { provideHttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { of } from "rxjs";

describe("CheckoutComponent", () => {
  let component: CheckoutComponent;
  let fixture: ComponentFixture<CheckoutComponent>;
  let apiService: jasmine.SpyObj<ApiService>;
  let produtosService: jasmine.SpyObj<ProdutosService>;
  let enderecoService: jasmine.SpyObj<EnderecoService>;
  let router: jasmine.SpyObj<Router>;

  const mockProduto = { id: "p1", nome: "Fone", descricao: "Fone Bluetooth", pontos_necessarios: 5000, ativo: true };
  const mockEnderecos = [
    { id: "e1", logradouro: "Rua A", numero: "100", bairro: "Centro", cidade: "SP", estado: "SP", cep: "01310-100", padrao: true, usuario_id: "u1", criado_em: "2024-01-01" },
  ];

  beforeEach(async () => {
    apiService = jasmine.createSpyObj("ApiService", ["get", "post"]);
    produtosService = jasmine.createSpyObj("ProdutosService", ["detalhe"]);
    enderecoService = jasmine.createSpyObj("EnderecoService", ["listar"]);
    router = jasmine.createSpyObj("Router", ["navigate", "createUrlTree", "serializeUrl"], { events: of(undefined), url: "/" });
    router.createUrlTree.and.returnValue({ toString: () => "" } as any);
    router.serializeUrl.and.returnValue("");

    await TestBed.configureTestingModule({
      imports: [CheckoutComponent],
      providers: [
        provideHttpClient(),
        { provide: ApiService, useValue: apiService },
        { provide: ProdutosService, useValue: produtosService },
        { provide: EnderecoService, useValue: enderecoService },
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => "p1" } } } },
      ],
    }).compileComponents();

    apiService.get.and.returnValue(of({ saldo_pontos: 5000 }));
    produtosService.detalhe.and.returnValue(of(mockProduto));
    enderecoService.listar.and.returnValue(of(mockEnderecos));
  });

  it("should load produto and enderecos on init", () => {
    fixture = TestBed.createComponent(CheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.produto()?.nome).toBe("Fone");
    expect(component.enderecos().length).toBe(1);
  });

  it("should confirm resgate and navigate to pedidos", () => {
    apiService.post.and.returnValue(of({ id: "ped1", status: "Confirmado" }));
    fixture = TestBed.createComponent(CheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.enderecoSelecionado.set("e1");
    component.confirmarResgate();

    expect(apiService.post).toHaveBeenCalledWith("/resgates", { produto_id: "p1", endereco_id: "e1" });
    expect(router.navigate).toHaveBeenCalledWith(["/pedidos"], { queryParams: { success: "true" } });
  });

  it("should confirm resgate with default address", () => {
    apiService.post.and.returnValue(of({ id: "ped1", status: "Confirmado" }));
    fixture = TestBed.createComponent(CheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.confirmarResgate();

    expect(apiService.post).toHaveBeenCalledWith("/resgates", { produto_id: "p1", endereco_id: "e1" });
    expect(router.navigate).toHaveBeenCalledWith(["/pedidos"], { queryParams: { success: "true" } });
  });
});
