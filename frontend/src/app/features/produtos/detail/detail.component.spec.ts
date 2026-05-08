import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DetailComponent } from "./detail.component";
import { ProdutosService } from "../produtos.service";
import { provideHttpClient } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";

describe("ProdutosDetailComponent", () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let service: jasmine.SpyObj<ProdutosService>;

  const mockProduto = { id: "p1", nome: "Fone", descricao: "Fone Bluetooth", pontos_necessarios: 5000, ativo: true };

  beforeEach(async () => {
    service = jasmine.createSpyObj("ProdutosService", ["detalhe"]);

    await TestBed.configureTestingModule({
      imports: [DetailComponent],
      providers: [
        provideHttpClient(),
        { provide: ProdutosService, useValue: service },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => "p1" } } } },
      ],
    }).compileComponents();
  });

  it("should load produto on init", () => {
    service.detalhe.and.returnValue(of(mockProduto));

    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.produto()?.nome).toBe("Fone");
    expect(service.detalhe).toHaveBeenCalledWith("p1");
  });
});
