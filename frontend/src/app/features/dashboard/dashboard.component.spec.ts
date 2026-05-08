import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DashboardComponent } from "./dashboard.component";
import { ApiService } from "../../core/services/api.service";
import { AuthService } from "../../core/services/auth.service";
import { provideHttpClient } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { signal } from "@angular/core";
import { of } from "rxjs";

describe("DashboardComponent", () => {
  let apiService: jasmine.SpyObj<ApiService>;
  let authService: jasmine.SpyObj<AuthService>;
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    const mockUsuario = { id: "1", email: "test@test.com", saldo_pontos: 5000, criado_em: "2024-01-01" };
    apiService = jasmine.createSpyObj("ApiService", ["get"]);
    authService = jasmine.createSpyObj(
      "AuthService",
      {},
      { usuario: signal(mockUsuario) }
    );

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        provideHttpClient(),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null }, queryParamMap: { get: () => null } } } },
        { provide: ApiService, useValue: apiService },
        { provide: AuthService, useValue: authService },
      ],
    }).compileComponents();
  });

  it("should load saldo on init", () => {
    apiService.get.withArgs("/saldo").and.returnValue(of({ saldo_pontos: 5000 }));
    apiService.get.withArgs("/extrato", { limite: "5" }).and.returnValue(of({ transacoes: [] }));

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.saldo()).toBe(5000);
  });

  it("should show loading state initially", () => {
    apiService.get.withArgs("/saldo").and.returnValue(of({ saldo_pontos: 5000 }));
    apiService.get.withArgs("/extrato", { limite: "5" }).and.returnValue(of({ transacoes: [] }));

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;

    expect(component.loading()).toBe(true);
  });
});
