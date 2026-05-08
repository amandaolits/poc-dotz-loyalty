import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { ApiService } from "./api.service";
import { environment } from "../../../environments/environment";

describe("ApiService", () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it("get should call GET with params", () => {
    service.get("/test", { key: "value" }).subscribe();

    const req = httpMock.expectOne((r) => r.url === `${environment.apiUrl}/test` && r.params.has("key"));
    expect(req.request.method).toBe("GET");
    req.flush({});
  });

  it("get should call GET without params", () => {
    service.get("/test").subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/test`);
    expect(req.request.method).toBe("GET");
    req.flush({});
  });

  it("post should call POST with body", () => {
    service.post("/test", { data: 1 }).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/test`);
    expect(req.request.method).toBe("POST");
    expect(req.request.body).toEqual({ data: 1 });
    req.flush({});
  });

  it("put should call PUT with body", () => {
    service.put("/test/1", { name: "new" }).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/test/1`);
    expect(req.request.method).toBe("PUT");
    expect(req.request.body).toEqual({ name: "new" });
    req.flush({});
  });

  it("delete should call DELETE", () => {
    service.delete("/test/1").subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/test/1`);
    expect(req.request.method).toBe("DELETE");
    req.flush({});
  });
});
