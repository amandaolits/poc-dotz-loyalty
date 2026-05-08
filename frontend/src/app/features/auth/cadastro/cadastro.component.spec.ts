import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CadastroComponent } from "./cadastro.component";
import { AuthService } from "../../../core/services/auth.service";
import { provideHttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { of, throwError } from "rxjs";

describe("CadastroComponent", () => {
  let component: CadastroComponent;
  let fixture: ComponentFixture<CadastroComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj("AuthService", ["cadastre"]);
    router = jasmine.createSpyObj("Router", ["navigate", "createUrlTree", "serializeUrl"], { events: of(undefined), url: "/" });
    router.createUrlTree.and.returnValue({ toString: () => "" } as any);
    router.serializeUrl.and.returnValue("");

    await TestBed.configureTestingModule({
      imports: [CadastroComponent],
      providers: [
        provideHttpClient(),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null }, queryParamMap: { get: () => null } } } },
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CadastroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should show error when passwords do not match", () => {
    component.form.setValue({ email: "test@test.com", senha: "123456", confirmarSenha: "654321" });
    expect(component.form.errors?.["senhasDiferentes"]).toBe(true);
  });

  it("should call cadastre on submit and redirect to login", () => {
    authService.cadastre.and.returnValue(of(void 0));
    component.form.setValue({ email: "new@test.com", senha: "123456", confirmarSenha: "123456" });
    component.onSubmit();

    expect(authService.cadastre).toHaveBeenCalledWith("new@test.com", "123456");
    expect(router.navigate).toHaveBeenCalledWith(["/login"]);
  });

  it("should show error on duplicate email", () => {
    authService.cadastre.and.returnValue(
      throwError(() => ({ status: 409, error: { erro: "Email já cadastrado" } }))
    );
    component.form.setValue({ email: "dup@test.com", senha: "123456", confirmarSenha: "123456" });
    component.onSubmit();

    expect(component.errorMessage).toBe("Email já cadastrado");
  });
});
