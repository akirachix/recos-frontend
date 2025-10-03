
import { fetchResetPassword } from "./fetchResetPassword";

describe("fetchResetPassword", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("resolve with JSON response on successful fetch", async () => {
    const mockResponse = { statusText: "Password reset successful" };

    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      statusText: "OK",
      json: async () => mockResponse,
    } as Response);

    const result = await fetchResetPassword("test@example.com", "pass123", "pass123");
    expect(global.fetch).toHaveBeenCalledWith("/api/reset-password", expect.objectContaining({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@example.com", password: "pass123", confirm_password: "pass123" }),
    }));
    expect(result).toEqual(mockResponse);
  });

  it("throw error with statusText if response not ok", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      statusText: "Bad Request",
      json: async () => ({ error: "Invalid data" }),
    } as Response);

    await expect(fetchResetPassword("fail@example.com", "password", "password")).rejects.toThrow(
      "Something went wrong during reset passwordBad Request"
    );
  });

  it("throw error if fetch rejects", async () => {
    global.fetch = jest.fn().mockRejectedValueOnce(new Error("Network failure"));

    await expect(fetchResetPassword("error@example.com", "password", "password")).rejects.toThrow(
      "Failed to reset password: Network failure"
    );
  });
});