import { renderHook, act } from "@testing-library/react";
import useLogin from "./useLogin";
import * as fetchLogin from "../utils/fetchLogin";
import * as useToken from "../utils/useToken";


jest.mock("../utils/fetchLogin");
jest.mock("../utils/useToken");

describe("useLogin hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should have initial loading false and error null", () => {
    const { result } = renderHook(() => useLogin());
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("should login successfully and set token", async () => {
    const fakeToken = "fake-jwt-token";

    (fetchLogin.loginUser as jest.Mock).mockResolvedValue({
      success: true,
      token: fakeToken,
    });
    const setAuthTokenSpy = jest.spyOn(useToken, "setAuthToken");

    const { result } = renderHook(() => useLogin());

    await act(async () => {
      const success = await result.current.login({ email: "angie@gmail.com", password: "angie" });
      expect(success).toBe(true);
    });

    expect(fetchLogin.loginUser).toHaveBeenCalledWith({
      email: "angie@gmail.com",
      password: "angie",
    });
    expect(setAuthTokenSpy).toHaveBeenCalledWith(fakeToken);
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it("should login fail on invalid credentials", async () => {
    (fetchLogin.loginUser as jest.Mock).mockResolvedValue({ success: false });

    const { result } = renderHook(() => useLogin());

    await act(async () => {
      const success = await result.current.login({ email: "angie@gmail.com", password: "baddie" });
      expect(success).toBe(false);
    });

    expect(result.current.error).toBe("Invalid credentials");
    expect(result.current.loading).toBe(false);
  });

  it("should capture and set error on fetch failure", async () => {
    (fetchLogin.loginUser as jest.Mock).mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useLogin());

    await act(async () => {
      const success = await result.current.login({ email: "angie@gmail.com", password: "fahh" });
      expect(success).toBe(false);
    });

    expect(result.current.error).toBe("Network error");
    expect(result.current.loading).toBe(false);
  });
});
