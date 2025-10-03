import { act, renderHook } from "@testing-library/react";
import { useForgotPasswordRequest } from "./useFetchForgotPassword";
import * as fetchUtils from "@/app/utils/fetchForgotPassword";

jest.mock("@/app/utils/fetchForgotPassword");

describe("useForgotPasswordRequest hook", () => {
  const mockedFetchForgotPassword = fetchUtils.fetchForgotPassword as jest.MockedFunction<typeof fetchUtils.fetchForgotPassword>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Initialize with default state", () => {
    const { result } = renderHook(() => useForgotPasswordRequest());

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.success).toBe(false);
    expect(typeof result.current.requestCode).toBe("function");
  });

  it("Set loading true, then success true on successful requestCode call", async () => {
    mockedFetchForgotPassword.mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useForgotPasswordRequest());

    await act(async () => {
      await result.current.requestCode("rahwa@gmail.com");
    });

    expect(mockedFetchForgotPassword).toHaveBeenCalledWith("rahwa@gmail.com");
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.success).toBe(true);
  });

  it("should set error on failed requestCode call", async () => {
    mockedFetchForgotPassword.mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useForgotPasswordRequest());

    await act(async () => {
      await result.current.requestCode("rahwa@gmail.com");
    });

    expect(mockedFetchForgotPassword).toHaveBeenCalledWith("rahwa@gmail.com");
    expect(result.current.loading).toBe(false);
    expect(result.current.success).toBe(false);
    expect(result.current.error).toBe("Network error");
  });
});
