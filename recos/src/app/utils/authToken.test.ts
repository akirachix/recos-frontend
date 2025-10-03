import Cookies from "js-cookie";
import { setAuthToken, getAuthToken, removeAuthToken } from "../utils/authToken";

jest.mock("js-cookie", () => ({
  set: jest.fn(),
  get: jest.fn(),
  remove: jest.fn(),
}));

describe("Auth token cookie functions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("sets auth token cookie with correct options", () => {
    const token = "test-token";
    setAuthToken(token);

    expect(Cookies.set).toHaveBeenCalledWith(
      "auth_token",
      token,
      expect.objectContaining({
        expires: expect.any(Number),
        path: "/",
        sameSite: "strict",
        secure: expect.any(Boolean),
      })
    );
  });

  it("gets auth token cookie", () => {
    (Cookies.get as jest.Mock).mockReturnValue("existing-token");
    const token = getAuthToken();
    expect(Cookies.get).toHaveBeenCalledWith("auth_token");
    expect(token).toBe("existing-token");
  });

  it("removes auth token cookie", () => {
    removeAuthToken();
    expect(Cookies.remove).toHaveBeenCalledWith("auth_token");
  });
});
