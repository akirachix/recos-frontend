import { renderHook } from "@testing-library/react";
import { useToken } from "./useToken";

describe("useToken hook", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return token from cookie", () => {
    jest.spyOn(require("../utils/authToken"), "getAuthToken").mockReturnValue("test-auth-token");

    const { result } = renderHook(() => useToken());

    expect(result.current).toBe("test-auth-token");
  });

  it("should return null if no token", () => {
    jest.spyOn(require("../utils/authToken"), "getAuthToken").mockReturnValue(null);

    const { result } = renderHook(() => useToken());

    expect(result.current).toBeNull();
  });
});

