import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormComponent } from "./form.component";

describe("EnderecoFormComponent", () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should be invalid when required fields are empty", () => {
    expect(component.form.valid).toBe(false);
  });

  it("should be valid with all required fields", () => {
    component.form.setValue({
      cep: "01310-100",
      logradouro: "Rua A",
      numero: "100",
      complemento: "",
      bairro: "Centro",
      cidade: "SP",
      estado: "SP",
      padrao: false,
    });
    expect(component.form.valid).toBe(true);
  });

  it("should emit submitted data", () => {
    const spy = jasmine.createSpy();
    component.submitted.subscribe(spy);

    component.form.setValue({
      cep: "01310-100",
      logradouro: "Rua A",
      numero: "100",
      complemento: "",
      bairro: "Centro",
      cidade: "SP",
      estado: "SP",
      padrao: true,
    });
    component.onSubmit();

    expect(spy).toHaveBeenCalledWith(jasmine.objectContaining({ cep: "01310-100", padrao: true }));
  });

  it("should not emit when invalid", () => {
    const spy = jasmine.createSpy();
    component.submitted.subscribe(spy);
    component.onSubmit();
    expect(spy).not.toHaveBeenCalled();
  });
});
