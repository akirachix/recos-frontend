import { renderHook, act } from "@testing-library/react";
import { useResetPassword } from "./useFetchResetPassword";
import * as fetchUtils from "@/utils/fetchResetPassword";

jest.mock("@/app/utils/fetchResetPassword");

describe("useResetPassword hook", () => {
  const mockedFetchResetPassword = fetchUtils.fetchResetPassword as jest.MockedFunction<typeof fetchUtils.fetchResetPassword>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Initialize with default states", () => {
    const { result } = renderHook(() => useResetPassword());
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.success).toBe(false);
    expect(typeof result.current.resetPassword).toBe("function");
  });

  it("set success true if response contains 'successful'", async () => {
    mockedFetchResetPassword.mockResolvedValueOnce({ detail: "Password reset successful" });

    const { result } = renderHook(() => useResetPassword());

    await act(async () => {
      await result.current.resetPassword("test@example.com", "pass123", "pass123");
    });

    expect(mockedFetchResetPassword).toHaveBeenCalledWith("test@example.com", "pass123", "pass123");
    expect(result.current.loading).toBe(false);
    expect(result.current.success).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it("set error when response.detail doesn't indicate success", async () => {
    mockedFetchResetPassword.mockResolvedValueOnce({ detail: "Some failure message" });

    const { result } = renderHook(() => useResetPassword());

    await act(async () => {
      await result.current.resetPassword("fail@example.com", "pass123", "pass123");
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.success).toBe(false);
    expect(result.current.error).toBe("Reset password failed");
  });

  it("set error with error message on fetch failure", async () => {
    mockedFetchResetPassword.mockRejectedValueOnce(new Error("Network Error"));

    const { result } = renderHook(() => useResetPassword());

    await act(async () => {
      await result.current.resetPassword("error@example.com", "pass123", "pass123");
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.success).toBe(false);
    expect(result.current.error).toBe("Network Error");
  });
});
