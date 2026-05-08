import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { EnderecoService } from "./endereco.service";
import { environment } from "../../../environments/environment";

describe("EnderecoService", () => {
  let service: EnderecoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(EnderecoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it("listar should GET /enderecos", () => {
    service.listar().subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/enderecos`);
    expect(req.request.method).toBe("GET");
    req.flush([]);
  });

  it("criar should POST /enderecos", () => {
    const dados = { cep: "01310-100", logradouro: "Rua A", numero: "100", bairro: "Centro", cidade: "SP", estado: "SP" };
    service.criar(dados).subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/enderecos`);
    expect(req.request.method).toBe("POST");
    expect(req.request.body).toEqual(dados);
    req.flush({});
  });

  it("atualizar should PUT /enderecos/:id", () => {
    const dados = { cep: "01310-100", logradouro: "Rua B", numero: "200", bairro: "Centro", cidade: "SP", estado: "SP" };
    service.atualizar("e1", dados).subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/enderecos/e1`);
    expect(req.request.method).toBe("PUT");
    req.flush({});
  });

  it("remover should DELETE /enderecos/:id", () => {
    service.remover("e1").subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/enderecos/e1`);
    expect(req.request.method).toBe("DELETE");
    req.flush({});
  });
});
