import { loginUser } from "./fetchLogin";

describe("loginUser", () => {
  const mockFetch = jest.fn();
  global.fetch = mockFetch;

  const mockData = { email: "test@example.com", password: "pass" };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should return result json on successful login", async () => {
    const mockResponseData = { token: "no-token" };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponseData),
    });

    const result = await loginUser(mockData);

    expect(mockFetch).toHaveBeenCalledWith("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mockData),
      credentials: "include", 
    });

    expect(result).toEqual(mockResponseData);
  });

  test("should throw error if response is not ok", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: "Unauthorized",
      json: jest.fn().mockResolvedValue({ message: "Something went wrong during login: Unauthorized" }),
    });

    await expect(loginUser(mockData)).rejects.toThrow(
      "Something went wrong during login: Unauthorized"  
    );
  });

  test("should throw error when fetch rejects", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network failure"));

    await expect(loginUser(mockData)).rejects.toThrow("Network failure");
  });
});
