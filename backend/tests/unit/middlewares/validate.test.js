const { z } = require("zod");
const validate = require("../../../src/middlewares/validate");

function mockReq(body = {}) {
  return { body };
}

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe("validate middleware", () => {
  const schema = z.object({
    email: z.string().email("Email inválido"),
    senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  });

  it("should call next with validated data on valid input", () => {
    const req = mockReq({ email: "test@test.com", senha: "123456" });
    const res = mockRes();
    const next = jest.fn();

    validate(schema)(req, res, next);

    expect(req.validatedBody).toEqual({ email: "test@test.com", senha: "123456" });
    expect(next).toHaveBeenCalled();
  });

  it("should return 400 on invalid email", () => {
    const req = mockReq({ email: "invalido", senha: "123456" });
    const res = mockRes();
    const next = jest.fn();

    validate(schema)(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ erro: expect.any(String) }));
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 400 on short password", () => {
    const req = mockReq({ email: "test@test.com", senha: "123" });
    const res = mockRes();
    const next = jest.fn();

    validate(schema)(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ erro: expect.any(String) }));
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 400 on missing fields", () => {
    const req = mockReq({});
    const res = mockRes();
    const next = jest.fn();

    validate(schema)(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });
});
