import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ListComponent } from "./list.component";
import { ProdutosService } from "../produtos.service";
import { provideHttpClient } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";

describe("ProdutosListComponent", () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let service: jasmine.SpyObj<ProdutosService>;

  const mockResponse = {
    produtos: [
      { id: "p1", nome: "Fone", descricao: "Fone", pontos_necessarios: 5000, ativo: true, categoria: "Eletrônicos" },
      { id: "p2", nome: "TV", descricao: "TV", pontos_necessarios: 10000, ativo: true, categoria: "Eletrônicos" },
    ],
    total: 2,
    pagina: 1,
    limite: 12,
    categorias: ["Eletrônicos"],
    subcategorias: [],
  };

  beforeEach(async () => {
    service = jasmine.createSpyObj("ProdutosService", ["listar"]);

    await TestBed.configureTestingModule({
      imports: [ListComponent],
      providers: [
        provideHttpClient(),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null }, queryParamMap: { get: () => null } } } },
        { provide: ProdutosService, useValue: service },
      ],
    }).compileComponents();
  });

  it("should load produtos on init", () => {
    service.listar.and.returnValue(of(mockResponse));

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect((component as any).produtos()).toBeDefined();
  });
});
