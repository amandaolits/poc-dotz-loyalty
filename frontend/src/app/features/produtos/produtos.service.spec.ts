import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { of } from "rxjs";
import { ProdutosService } from "./produtos.service";
import { environment } from "../../../environments/environment";

describe("ProdutosService", () => {
  let service: ProdutosService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(ProdutosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it("listar should GET /produtos with params", () => {
    service.listar({ categoria: "Eletrônicos", pagina: 1 }).subscribe();

    const req = httpMock.expectOne(
      (r) => r.url === `${environment.apiUrl}/produtos` && r.params.has("categoria") && r.params.has("pagina")
    );
    expect(req.request.method).toBe("GET");
    req.flush({ produtos: [], total: 0, pagina: 1, limite: 12, categorias: [], subcategorias: [] });
  });

  it("buscarPorId should GET /produtos/:id", () => {
    service.buscarPorId("p1").subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/produtos/p1`);
    expect(req.request.method).toBe("GET");
    req.flush({});
  });

  it("detalhe should call buscarPorId", () => {
    jest.spyOn(service, "buscarPorId").mockReturnValue(of({} as any));
    service.detalhe("p1").subscribe();
    expect(service.buscarPorId).toHaveBeenCalledWith("p1");
  });
});
