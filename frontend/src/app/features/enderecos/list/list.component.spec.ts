import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ListComponent } from "./list.component";
import { EnderecoService } from "../endereco.service";
import { provideHttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { of } from "rxjs";

describe("EnderecosListComponent", () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let service: jasmine.SpyObj<EnderecoService>;
  let router: jasmine.SpyObj<Router>;

  const mockEnderecos = [
    { id: "e1", logradouro: "Rua A", numero: "100", bairro: "Centro", cidade: "SP", estado: "SP", cep: "01310-100", padrao: true, usuario_id: "u1", criado_em: "2024-01-01" },
    { id: "e2", logradouro: "Rua B", numero: "200", bairro: "Vila", cidade: "SP", estado: "SP", cep: "01310-200", padrao: false, usuario_id: "u1", criado_em: "2024-01-02" },
  ];

  beforeEach(async () => {
    service = jasmine.createSpyObj("EnderecoService", ["listar", "remover"]);
    router = jasmine.createSpyObj("Router", ["navigate", "createUrlTree", "serializeUrl"], { events: of(undefined), url: "/" });
    router.createUrlTree.and.returnValue({ toString: () => "" } as any);
    router.serializeUrl.and.returnValue("");

    await TestBed.configureTestingModule({
      imports: [ListComponent],
      providers: [
        provideHttpClient(),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null }, queryParamMap: { get: () => null } } } },
        { provide: EnderecoService, useValue: service },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();
  });

  it("should load enderecos on init", () => {
    service.listar.and.returnValue(of(mockEnderecos));

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.enderecos().length).toBe(2);
  });

  it("should navigate to edit", () => {
    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    component.editar("e1");
    expect(router.navigate).toHaveBeenCalledWith(["/enderecos", "e1", "editar"]);
  });
});
