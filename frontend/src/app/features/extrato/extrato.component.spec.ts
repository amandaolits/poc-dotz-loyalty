import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ExtratoComponent } from "./extrato.component";
import { ApiService } from "../../core/services/api.service";
import { provideHttpClient } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";

describe("ExtratoComponent", () => {
  let apiService: jasmine.SpyObj<ApiService>;
  let component: ExtratoComponent;
  let fixture: ComponentFixture<ExtratoComponent>;

  const mockTransacoes = [
    { id: "t1", usuario_id: "u1", tipo: "ganho", pontos: 5000, descricao: "Ganho", data_criacao: "2024-01-01" },
    { id: "t2", usuario_id: "u1", tipo: "resgate", pontos: 2000, descricao: "Resgate", data_criacao: "2024-02-01" },
  ];

  beforeEach(async () => {
    apiService = jasmine.createSpyObj("ApiService", ["get"]);

    await TestBed.configureTestingModule({
      imports: [ExtratoComponent],
      providers: [
        provideHttpClient(),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null }, queryParamMap: { get: () => null } } } },
        { provide: ApiService, useValue: apiService },
      ],
    }).compileComponents();
  });

  it("should load transacoes on init", () => {
    apiService.get.and.returnValue(of({ transacoes: mockTransacoes, total: 2, pagina: 1 }));

    fixture = TestBed.createComponent(ExtratoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.transacoes().length).toBe(2);
  });

  it("should apply filter and reset page", () => {
    apiService.get.and.returnValue(of({ transacoes: [], total: 0, pagina: 1 }));
    fixture = TestBed.createComponent(ExtratoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.aplicarFiltro("3m");

    expect(component.filtroAtivo()).toBe("3m");
    expect(component.pagina()).toBe(1);
  });

  it("should change page", () => {
    apiService.get.and.returnValue(of({ transacoes: mockTransacoes, total: 20, pagina: 1 }));
    fixture = TestBed.createComponent(ExtratoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.irPagina(2);
    expect(component.pagina()).toBe(2);
  });
});
