import { renderHook, act } from "@testing-library/react";
import { useFetchVerifyResetCode } from "./useFetchVerifyResetCode";
import * as fetchUtils from "@/app/utils/fetchVerifyResetCode";

jest.mock("@/app/utils/fetchVerifyResetCode");

describe("useFetchVerifyResetCode", () => {
  const mockedFetchVerifyResetCode = fetchUtils.fetchVerifyResetCode as jest.MockedFunction<typeof fetchUtils.fetchVerifyResetCode>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Initialize with default states", () => {
    const { result } = renderHook(() => useFetchVerifyResetCode());
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.verified).toBe(false);
    expect(typeof result.current.verifyResetCode).toBe("function");
  });

  it("set verified true if response.detail contains 'verified'", async () => {
    mockedFetchVerifyResetCode.mockResolvedValueOnce({ detail: "Code Verified Successfully" });

    const { result } = renderHook(() => useFetchVerifyResetCode());

    await act(async () => {
      await result.current.verifyResetCode("test@example.com", "1234");
    });

    expect(mockedFetchVerifyResetCode).toHaveBeenCalledWith("test@example.com", "1234");
    expect(result.current.loading).toBe(false);
    expect(result.current.verified).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it("set error if response.detail does not contain 'verified'", async () => {
    mockedFetchVerifyResetCode.mockResolvedValueOnce({ detail: "Verification failed" });

    const { result } = renderHook(() => useFetchVerifyResetCode());

    await act(async () => {
      await result.current.verifyResetCode("test@example.com", "0000");
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.verified).toBe(false);
    expect(result.current.error).toBe("Verification failed. Code not valid.");
  });

  it("set error message on fetch failure", async () => {
    mockedFetchVerifyResetCode.mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useFetchVerifyResetCode());

    await act(async () => {
      await result.current.verifyResetCode("test@example.com", "9999");
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.verified).toBe(false);
    expect(result.current.error).toBe("Network error");
  });
});
