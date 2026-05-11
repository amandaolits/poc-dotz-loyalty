import { TestBed } from "@angular/core/testing";
import { ToastService } from "./toast.service";

describe("ToastService", () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should add message", () => {
    service.show("Test message", "success");

    expect(service.messages().length).toBe(1);
    expect(service.messages()[0].message).toBe("Test message");
    expect(service.messages()[0].type).toBe("success");
  });

  it("should clear message after timeout", () => {
    service.show("Temp message", "info");

    expect(service.messages().length).toBe(1);

    jest.advanceTimersByTime(4000);

    expect(service.messages().length).toBe(0);
  });

  it("should default to info type", () => {
    service.show("Default type");

    expect(service.messages()[0].type).toBe("info");
  });
});
