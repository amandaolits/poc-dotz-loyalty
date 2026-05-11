import { TestBed } from "@angular/core/testing";
import { HttpClient, provideHttpClient, withInterceptors } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { authInterceptor } from "./auth.interceptor";
import { AuthService } from "../services/auth.service";

describe("authInterceptor", () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    authService = jasmine.createSpyObj("AuthService", ["getToken"]);
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authService },
      ],
    });
    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it("should add Authorization header when token exists", () => {
    authService.getToken.and.returnValue("test-jwt");

    httpClient.get("/api/test").subscribe();

    const req = httpMock.expectOne("/api/test");
    expect(req.request.headers.get("Authorization")).toBe("Bearer test-jwt");
    req.flush({});
  });

  it("should not add Authorization header when no token", () => {
    authService.getToken.and.returnValue(null);

    httpClient.get("/api/test").subscribe();

    const req = httpMock.expectOne("/api/test");
    expect(req.request.headers.has("Authorization")).toBe(false);
    req.flush({});
  });
});
