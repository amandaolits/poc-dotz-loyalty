const jwt = require("jsonwebtoken");
const env = require("../../../src/config/env");
const authMiddleware = require("../../../src/middlewares/auth");

jest.mock("jsonwebtoken");

function mockReq(headers = {}) {
  return { headers };
}

function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe("authMiddleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 when no Authorization header", () => {
    const req = mockReq({});
    const res = mockRes();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ erro: "Token não fornecido" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 when token is empty", () => {
    const req = mockReq({ authorization: "Bearer " });
    const res = mockRes();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ erro: "Token inválido" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next with decoded user when token is valid", () => {
    jwt.verify.mockReturnValue({ userId: "abc-123", email: "test@test.com" });

    const req = mockReq({ authorization: "Bearer valid-token" });
    const res = mockRes();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith("valid-token", env.jwtSecret);
    expect(req.userId).toBe("abc-123");
    expect(req.userEmail).toBe("test@test.com");
    expect(next).toHaveBeenCalled();
  });

  it("should return 401 when token is expired or invalid", () => {
    jwt.verify.mockImplementation(() => {
      throw new Error("jwt expired");
    });

    const req = mockReq({ authorization: "Bearer bad-token" });
    const res = mockRes();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ erro: "Token inválido ou expirado" });
    expect(next).not.toHaveBeenCalled();
  });
});
