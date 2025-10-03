import { renderHook, act, waitFor } from "@testing-library/react";
import { useFetchUser } from "./useFetchUser";
import * as fetchUserModule from "../utils/fetchUser"; 

jest.mock("../utils/fetchUser"); 

describe("useFetchUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch user successfully and set states correctly", async () => {
    const mockUserData = { id: 1, first_name: "James", last_name: "Darren", email: "james@example.com", image: null };
    (fetchUserModule.fetchUser as jest.Mock).mockResolvedValue(mockUserData);

    const { result } = renderHook(() => useFetchUser());

    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBe(null);
    expect(result.current.error).toBe(null);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.user).toEqual(mockUserData);
    expect(result.current.error).toBe(null);
    expect(fetchUserModule.fetchUser).toHaveBeenCalledTimes(1);
  });

  it("should handle array response and take first element", async () => {
    const mockUserData = [
      { id: 1, first_name: "James", last_name: "Doe", email: "james@example.com" },
      { id: 2, first_name: "Julia", last_name: "Seth" },
    ];
    (fetchUserModule.fetchUser as jest.Mock).mockResolvedValue(mockUserData);

    const { result } = renderHook(() => useFetchUser());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.user).toEqual(mockUserData[0]);
  });

  it("should handle falsy user data and set user to null", async () => {
    (fetchUserModule.fetchUser as jest.Mock).mockResolvedValue(null);

    const { result } = renderHook(() => useFetchUser());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.user).toBe(null);
  });

  it("should set error on fetch failure", async () => {
    const mockError = new Error("Failed to fetch user");
    (fetchUserModule.fetchUser as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useFetchUser());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe(mockError.message);
    expect(result.current.user).toBe(null);
  });

  it("should run effect only once on mount", async () => {
    (fetchUserModule.fetchUser as jest.Mock).mockResolvedValue({ id: 1 });

    const { rerender } = renderHook(() => useFetchUser());

    await waitFor(() => expect(fetchUserModule.fetchUser).toHaveBeenCalledTimes(1));

    rerender();

    expect(fetchUserModule.fetchUser).toHaveBeenCalledTimes(1);
  });
});