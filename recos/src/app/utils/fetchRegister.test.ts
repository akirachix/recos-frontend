import { registerUser } from "./fetchRegister";

describe("registerUser", () => {
  const mockFetch = jest.fn();
  global.fetch = mockFetch;

  const mockData = {
    first_name: "Angie",
    last_name: "Baddie",
    email: "baddie@gmail.com",
    password: "angieangela",
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should return result json on successful registration", async () => {
    const mockResponseData = { message: "User registered successfully" };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponseData),
    });

    const result = await registerUser(mockData);

    expect(mockFetch).toHaveBeenCalledWith("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mockData),
    });
    expect(result).toEqual(mockResponseData);
  });

  test("should throw error if response is not ok", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: "Conflict",
      json: jest.fn().mockResolvedValue({
        error: "Something went wrong during registrationConflict",
      }),
    });

    await expect(registerUser(mockData)).rejects.toThrow(
      "Failed to register user: Something went wrong during registrationConflict"
    );
  });

  test("should throw error when fetch rejects", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network failure"));

    await expect(registerUser(mockData)).rejects.toThrow("Network failure");
  });
});
