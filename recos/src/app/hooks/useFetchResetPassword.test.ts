import { renderHook, act } from "@testing-library/react";
import { useResetPassword } from "./useFetchResetPassword";
import * as fetchResetPasswordApi from "@/app/utils/fetchResetPassword";

describe("useResetPassword hook", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("set success true if response contains 'successful'", async () => {
    const mock = jest.spyOn(fetchResetPasswordApi, "fetchResetPassword").mockResolvedValueOnce({ detail: "Password reset successful" });

    const { result } = renderHook(() => useResetPassword());

    await act(async () => {
      await result.current.resetPassword("test@example.com", "pass123", "pass123");
    });

    expect(mock).toHaveBeenCalledWith("test@example.com", "pass123", "pass123");
    expect(result.current.loading).toBe(false);
    expect(result.current.success).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it("set error when response.detail doesn't indicate success", async () => {
    const mock = jest.spyOn(fetchResetPasswordApi, "fetchResetPassword").mockResolvedValueOnce({ detail: "Some failure message" });

    const { result } = renderHook(() => useResetPassword());

    await act(async () => {
      await result.current.resetPassword("fail@example.com", "pass123", "pass123");
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.success).toBe(false);
    expect(result.current.error).toBe("Reset password failed");
  });

  it("set error with error message on fetch failure", async () => {
    const mock = jest.spyOn(fetchResetPasswordApi, "fetchResetPassword").mockRejectedValueOnce(new Error("Network Error"));

    const { result } = renderHook(() => useResetPassword());

    await act(async () => {
      await result.current.resetPassword("error@example.com", "pass123", "pass123");
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.success).toBe(false);
    expect(result.current.error).toBe("Network Error");
  });
});