import { renderHook, act } from "@testing-library/react";
import { waitFor } from "@testing-library/react";
import { useFetchProfile } from "./useFetchProfile";
import * as fetchProfileModule from "../utils/fetchProfile";

jest.mock("../utils/fetchProfile");

describe("useFetchProfile hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches and sets user data", async () => {
    const mockUser = { id: 1, email: "angela@gmail.com" };
    (fetchProfileModule.fetchProfile as jest.Mock).mockResolvedValue(mockUser);

    const { result } = renderHook(() => useFetchProfile());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.error).toBeNull();
  });

  it("sets error if fetchProfile fails", async () => {
    (fetchProfileModule.fetchProfile as jest.Mock).mockRejectedValue(new Error("Fetch failed"));

    const { result } = renderHook(() => useFetchProfile());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.user).toBeNull();
    expect(result.current.error).toBe("Fetch failed");
  });

  it("refetch and updates user data", async () => {
    const firstUser = { id: 1, email: "example1@gmail.com" };
    const secondUser = { id: 2, email: "example2@gmail.com" };
    (fetchProfileModule.fetchProfile as jest.Mock)
      .mockResolvedValueOnce(firstUser)
      .mockResolvedValueOnce(secondUser);

    const { result } = renderHook(() => useFetchProfile());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.user).toEqual(firstUser);

    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.user).toEqual(secondUser);
  });
});
