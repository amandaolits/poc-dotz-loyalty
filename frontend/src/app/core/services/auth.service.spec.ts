import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { AuthService } from "./auth.service";
import { environment } from "../../../environments/environment";

describe("AuthService", () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => httpMock.verify());

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("login should store token and set user", () => {
    const mockResponse = {
      token: "jwt-token",
      usuario: { id: "1", email: "test@test.com", saldo_pontos: 1000, criado_em: "2024-01-01" },
    };

    service.login("test@test.com", "123456").subscribe(() => {
      expect(service.authenticated()).toBe(true);
      expect(service.usuario()?.email).toBe("test@test.com");
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/login`);
    expect(req.request.method).toBe("POST");
    req.flush(mockResponse);

    expect(localStorage.getItem("dotz_token")).toBe("jwt-token");
  });

  it("logout should clear token and user", () => {
    localStorage.setItem("dotz_token", "jwt-token");
    service["_authenticated"].set(true);
    service["_usuario"].set({ id: "1", email: "test@test.com", saldo_pontos: 1000, criado_em: "2024-01-01" });

    service.logout();

    expect(localStorage.getItem("dotz_token")).toBeNull();
    expect(service.authenticated()).toBe(false);
    expect(service.usuario()).toBeNull();
  });

  it("getToken should return stored token", () => {
    localStorage.setItem("dotz_token", "test-token");
    expect(service.getToken()).toBe("test-token");
  });

  it("getToken should return null when no token", () => {
    expect(service.getToken()).toBeNull();
  });

  it("cadastre should POST to /usuarios", () => {
    service.cadastre("new@test.com", "123456").subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/usuarios`);
    expect(req.request.method).toBe("POST");
    expect(req.request.body).toEqual({ email: "new@test.com", senha: "123456" });
    req.flush({});
  });

  it("loadMe should fetch user and set authenticated", () => {
    const mockUser = { id: "1", email: "loaded@test.com", saldo_pontos: 5000, criado_em: "2024-01-01" };

    service.loadMe().subscribe((u) => {
      expect(u.email).toBe("loaded@test.com");
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/me`);
    expect(req.request.method).toBe("GET");
    req.flush(mockUser);

    expect(service.authenticated()).toBe(true);
  });
});
