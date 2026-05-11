import { TestBed } from "@angular/core/testing";
import { HttpClient, provideHttpClient, withInterceptors } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { errorInterceptor } from "./error.interceptor";
import { AuthService } from "../services/auth.service";
import { ToastService } from "../../shared/services/toast.service";

describe("errorInterceptor", () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let authService: jasmine.SpyObj<AuthService>;
  let toastService: jasmine.SpyObj<ToastService>;

  beforeEach(() => {
    authService = jasmine.createSpyObj("AuthService", ["logout"]);
    toastService = jasmine.createSpyObj("ToastService", ["show"]);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authService },
        { provide: ToastService, useValue: toastService },
      ],
    });
    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it("should call logout and toast on 401", () => {
    httpClient.get("/api/test").subscribe({ error: () => {} });

    const req = httpMock.expectOne("/api/test");
    req.flush({ erro: "Token inválido" }, { status: 401, statusText: "Unauthorized" });

    expect(authService.logout).toHaveBeenCalled();
    expect(toastService.show).toHaveBeenCalledWith("Sessão expirada", "error");
  });

  it("should show toast on 400/422", () => {
    httpClient.get("/api/test").subscribe({ error: () => {} });

    const req = httpMock.expectOne("/api/test");
    req.flush({ erro: "Campo inválido" }, { status: 400, statusText: "Bad Request" });

    expect(toastService.show).toHaveBeenCalledWith("Campo inválido", "error");
    expect(authService.logout).not.toHaveBeenCalled();
  });

  it("should show generic toast on 500", () => {
    httpClient.get("/api/test").subscribe({ error: () => {} });

    const req = httpMock.expectOne("/api/test");
    req.flush(null, { status: 500, statusText: "Server Error" });

    expect(toastService.show).toHaveBeenCalledWith("Erro inesperado", "error");
  });

  it("should not show toast for non-error status", () => {
    httpClient.get("/api/test").subscribe();

    const req = httpMock.expectOne("/api/test");
    req.flush({}, { status: 200, statusText: "OK" });

    expect(toastService.show).not.toHaveBeenCalled();
  });
});
