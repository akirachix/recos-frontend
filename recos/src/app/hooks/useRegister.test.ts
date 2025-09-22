import { renderHook, act } from "@testing-library/react";
import useRegister from "./useRegister";
import * as fetchRegister from "../utils/fetchRegister";

jest.mock("../utils/fetchRegister");

describe("useRegister hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize with loading false and error null", () => {
    const { result } = renderHook(() => useRegister());
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("should register successfully and return 'success'", async () => {
    (fetchRegister.registerUser as jest.Mock).mockResolvedValue({ user: {} });
    
    const { result } = renderHook(() => useRegister());

    let response: string | null = null;
    await act(async () => {
      response = await result.current.register({
        first_name: "Angie",
        last_name: "Baddie",
        email: "angie@gmail.com",
        password: "passwordangie",
      });
    });

    expect(fetchRegister.registerUser).toHaveBeenCalledWith({
      first_name: "Angie",
      last_name: "Baddie",
      email: "angie@gmail.com",
      password: "passwordangie",
    });
    expect(response).toBe("success");
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it("should set error and return null when registration fails with no result", async () => {
    (fetchRegister.registerUser as jest.Mock).mockResolvedValue(null);

    const { result } = renderHook(() => useRegister());

    let response: string | null = "not null";
    await act(async () => {
      response = await result.current.register({
        first_name: "Angie",
        last_name: "Baddie",
        email: "angie@gmail.com",
        password: "passwordangie",
      });
    });

    expect(response).toBeNull();
    expect(result.current.error).toBe("Registration failed");
    expect(result.current.loading).toBe(false);
  });

  it("should set error and return null on unknown registration error", async () => {
    (fetchRegister.registerUser as jest.Mock).mockResolvedValue({});

    const { result } = renderHook(() => useRegister());

    let response: string | null = "not null";
    await act(async () => {
      response = await result.current.register({
        first_name: "Angie",
        last_name: "Baddie",
        email: "angie@gmail.com",
        password: "passwordangie",
      });
    });

    expect(response).toBeNull();
    expect(result.current.error).toBe("Unknown registration error");
    expect(result.current.loading).toBe(false);
  });

  it("should handle thrown errors and return null", async () => {
    (fetchRegister.registerUser as jest.Mock).mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useRegister());

    let response: string | null = "not null";
    await act(async () => {
      response = await result.current.register({
        first_name: "Angie",
        last_name: "Baddie",
        email: "angie@gmail.com",
        password: "passwordangie",
      });
    });

    expect(response).toBeNull();
    expect(result.current.error).toBe("Network error");
    expect(result.current.loading).toBe(false);
  });
});
