import { fetchForgotPassword } from "./fetchForgotPassword";

describe("fetchForgotPassword", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("resolve with JSON response on successful fetch", async () => {
    const mockResponse = { message: "Code sent" };

    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      statusText: "OK",
      json: async () => mockResponse,
    } as Response);

    const result = await fetchForgotPassword("test@example.com");
    expect(global.fetch).toHaveBeenCalledWith("/api/forgot-password", expect.objectContaining({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@example.com" }),
    }));
    expect(result).toEqual(mockResponse);
  });

  it("throw an error with status text if response not ok", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      statusText: "Bad Request",
      json: async () => ({ error: "Invalid email" }),
    } as Response);

    await expect(fetchForgotPassword("bad@example.com")).rejects.toThrow(
      "Something went wrong during forgot passwordBad Request"
    );
  });

  it("throw an error if fetch itself rejects", async () => {
    global.fetch = jest.fn().mockRejectedValueOnce(new Error("Network failure"));

    await expect(fetchForgotPassword("fail@example.com")).rejects.toThrow(
      "Failed to send forgot password request: Network failure"
    );
  });
});
