import { renderHook, act } from "@testing-library/react";
import { useLogout } from "@/app/hooks/useFetchLogout";
import { fetchLogout } from "../utils/fetchLogout";
import { removeAuthToken } from "../utils/useToken";
import { useRouter } from "next/navigation";

jest.mock("../utils/fetchLogout");
jest.mock("../utils/useToken");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("useLogout", () => {
  let pushMock: jest.Mock;

  beforeEach(() => {
    pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });
    (fetchLogout as jest.Mock).mockResolvedValue(undefined);
    (removeAuthToken as jest.Mock).mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize in default state", () => {
    const { result } = renderHook(() => useLogout());
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.success).toBe(false);
  });

  it("should logout successfully", async () => {
    const { result } = renderHook(() => useLogout());

    await act(async () => {
      await result.current.logout();
    });

    expect(fetchLogout).toHaveBeenCalledTimes(1);
    expect(removeAuthToken).toHaveBeenCalledTimes(1);
    expect(result.current.success).toBe(true);
    expect(result.current.loading).toBe(false);
    expect(pushMock).toHaveBeenCalledWith("/signin");
  });

  it("should handle logout failure", async () => {
    (fetchLogout as jest.Mock).mockRejectedValue(new Error("Logout failed"));
    const { result } = renderHook(() => useLogout());

    await act(async () => {
      await result.current.logout();
    });

    expect(fetchLogout).toHaveBeenCalledTimes(1);
    expect(removeAuthToken).not.toHaveBeenCalled();
    expect(result.current.success).toBe(false);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe("Logout failed");
    expect(pushMock).not.toHaveBeenCalled();
  });
});
