import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { PedidoService } from "./pedido.service";
import { environment } from "../../../environments/environment";

describe("PedidoService", () => {
  let service: PedidoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(PedidoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it("listar should GET /pedidos", () => {
    service.listar().subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/pedidos`);
    expect(req.request.method).toBe("GET");
    req.flush([]);
  });

  it("listar should pass params", () => {
    service.listar({ periodo: "30d" }).subscribe();
    const req = httpMock.expectOne((r) => r.url === `${environment.apiUrl}/pedidos` && r.params.has("periodo"));
    expect(req.request.params.get("periodo")).toBe("30d");
    req.flush([]);
  });

  it("buscarPorId should GET /pedidos/:id", () => {
    service.buscarPorId("ped1").subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/pedidos/ped1`);
    expect(req.request.method).toBe("GET");
    req.flush({});
  });
});
