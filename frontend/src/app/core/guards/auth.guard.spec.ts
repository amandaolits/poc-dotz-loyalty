import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { authGuard } from "./auth.guard";
import { AuthService } from "../services/auth.service";

function mockRoute() {
  return {} as ActivatedRouteSnapshot;
}
function mockState() {
  return {} as RouterStateSnapshot;
}

describe("authGuard", () => {
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authService = jasmine.createSpyObj("AuthService", ["authenticated", "getToken"]);
    router = jasmine.createSpyObj("Router", ["parseUrl"]);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
      ],
    });
  });

  it("should allow activation when authenticated", () => {
    authService.authenticated.and.returnValue(true);
    const result = TestBed.runInInjectionContext(() => authGuard(mockRoute(), mockState()));
    expect(result).toBe(true);
  });

  it("should allow activation when token exists but not yet authenticated", () => {
    authService.authenticated.and.returnValue(false);
    authService.getToken.and.returnValue("some-token");
    const result = TestBed.runInInjectionContext(() => authGuard(mockRoute(), mockState()));
    expect(result).toBe(true);
  });

  it("should redirect to login when not authenticated and no token", () => {
    authService.authenticated.and.returnValue(false);
    authService.getToken.and.returnValue(null);
    router.parseUrl.and.returnValue("/login" as any);

    const result = TestBed.runInInjectionContext(() => authGuard(mockRoute(), mockState()));
    expect(router.parseUrl).toHaveBeenCalledWith("/login");
  });
});
