import { renderHook, act } from "@testing-library/react";
import { useForgotPasswordRequest } from "@/app/hooks/useFetchForgotPassword";
import { fetchForgotPassword } from "@/app/utils/fetchForgotPassword";

jest.mock("@/app/utils/fetchForgotPassword");

describe("useForgotPasswordRequest hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with default state", () => {
    const { result } = renderHook(() => useForgotPasswordRequest());

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.success).toBe(false);
  });

  it("should set success to true after successful requestCode call", async () => {
    (fetchForgotPassword as jest.Mock).mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useForgotPasswordRequest());

    await act(async () => {
      await result.current.requestCode("test@example.com");
    });

    expect(fetchForgotPassword).toHaveBeenCalledWith("test@example.com");
    expect(result.current.loading).toBe(false);
    expect(result.current.success).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it("should set error message on failed requestCode call", async () => {
    (fetchForgotPassword as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useForgotPasswordRequest());

    await act(async () => {
      await result.current.requestCode("test@example.com");
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.success).toBe(false);
    expect(result.current.error).toBe("Network error");
  });
});
