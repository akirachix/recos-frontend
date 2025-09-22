import { fetchVerifyResetCode } from "./fetchVerifyResetCode";

describe("fetchVerifyResetCode", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("resolve with JSON response on successful fetch", async () => {
    const mockResponse = { success: true, message: "Code verified" };

    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      statusText: "OK",
      json: async () => mockResponse,
    } as Response);

    const result = await fetchVerifyResetCode("test@example.com", "123456");
    expect(global.fetch).toHaveBeenCalledWith("/api/verify-reset-code", expect.objectContaining({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@example.com", code: "123456" }),
    }));
    expect(result).toEqual(mockResponse);
  });

  it("throw error with statusText if response not ok", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      statusText: "Bad Request",
      json: async () => ({ error: "Invalid code" }),
    } as Response);

    await expect(fetchVerifyResetCode("fail@example.com", "000000")).rejects.toThrow(
      "Something went wrong during code verificationBad Request"
    );
  });

  it("throw error if fetch rejects", async () => {
    global.fetch = jest.fn().mockRejectedValueOnce(new Error("Network failure"));

    await expect(fetchVerifyResetCode("error@example.com", "111111")).rejects.toThrow(
      "Failed to verify the code: Network failure"
    );
  });
});
