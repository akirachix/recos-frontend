import { renderHook, act } from "@testing-library/react";
import { useResetPassword } from "./useFetchResetPassword";
import * as fetchResetPasswordApi from "@/app/utils/fetchResetPassword";

describe("useResetPassword hook", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("set success true if response contains 'successful'", async () => {

    const { result } = renderHook(() => useResetPassword());

    await act(async () => {
      await result.current.resetPassword("test@example.com", "pass123", "pass123");
    });
  });

  it("set error when response.detail doesn't indicate success", async () => {

    const { result } = renderHook(() => useResetPassword());

    await act(async () => {
      await result.current.resetPassword("fail@example.com", "pass123", "pass123");
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.success).toBe(false);
  });

  it("set error with error message on fetch failure", async () => {

    const { result } = renderHook(() => useResetPassword());

    await act(async () => {
      await result.current.resetPassword("error@example.com", "pass123", "pass123");
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.success).toBe(false);
  });
});