import { ComponentFixture, TestBed } from "@angular/core/testing";
import { LoginComponent } from "./login.component";
import { AuthService } from "../../../core/services/auth.service";
import { provideHttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { of, throwError } from "rxjs";

describe("LoginComponent", () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj("AuthService", ["login"]);
    router = jasmine.createSpyObj("Router", ["navigate", "createUrlTree", "serializeUrl"], { events: of(undefined), url: "/" });
    router.createUrlTree.and.returnValue({ toString: () => "" } as any);
    router.serializeUrl.and.returnValue("");

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideHttpClient(),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null }, queryParamMap: { get: () => null } } } },
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should show error on invalid login", () => {
    authService.login.and.returnValue(
      throwError(() => ({ status: 401, error: { erro: "Email ou senha inválidos" } }))
    );

    component.form.setValue({ email: "test@test.com", senha: "wrong1" });
    component.onSubmit();

    expect(component.errorMessage).toBe("Email ou senha inválidos");
  });

  it("should navigate to dashboard on successful login", () => {
    authService.login.and.returnValue(
      of({ token: "jwt", usuario: { id: "1", email: "test@test.com", saldo_pontos: 1000, criado_em: "2024-01-01" } })
    );

    component.form.setValue({ email: "test@test.com", senha: "123456" });
    component.onSubmit();

    expect(router.navigate).toHaveBeenCalledWith(["/dashboard"]);
  });

  it("should not submit when form is invalid", () => {
    component.form.setValue({ email: "", senha: "" });
    component.onSubmit();

    expect(authService.login).not.toHaveBeenCalled();
  });

  it("should toggle password visibility", () => {
    expect(component.showPassword).toBe(false);
    component.showPassword = !component.showPassword;
    expect(component.showPassword).toBe(true);
  });
});
