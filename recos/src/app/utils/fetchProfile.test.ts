import { fetchProfile, fetchUpdateProfile } from "./fetchProfile";
import { getAuthToken } from "./authToken";

jest.mock("./authToken");

describe("fetchProfile", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should fetch profile and return first item if array", async () => {
    (getAuthToken as jest.Mock).mockReturnValue("fake-token");

    const mockResponse = [{ id: 1, name: "Jacky" }];
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response)
    );

    const result = await fetchProfile();
    expect(global.fetch).toHaveBeenCalledWith("/api/profile", {
      headers: { Authorization: "Token fake-token" },
    });
    expect(result).toEqual(mockResponse[0]);
  });

  it("should throw error if no token", async () => {
    (getAuthToken as jest.Mock).mockReturnValue(null);
    await expect(fetchProfile()).rejects.toThrow("No token found. Please log in.");
  });

  it("should throw error if response not ok", async () => {
    (getAuthToken as jest.Mock).mockReturnValue("fake-token");
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: false, statusText: "Unauthorized" } as Response)
    );
    await expect(fetchProfile()).rejects.toThrow("An error occurred during fetch profile: Unauthorized");
  });
});

describe("fetchUpdateProfile", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should update profile with JSON data", async () => {
    (getAuthToken as jest.Mock).mockReturnValue("token123");
    const updateData = { name: "Jane" };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      } as Response)
    );

    const result = await fetchUpdateProfile(updateData);
    expect(global.fetch).toHaveBeenCalledWith("/api/profile", {
      method: "PATCH",
      headers: {
        Authorization: "Token token123",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });
    expect(result).toEqual({ success: true });
  });

  it("should update profile with FormData data", async () => {
    (getAuthToken as jest.Mock).mockReturnValue("token123");
    const formData = new FormData();
    formData.append("file", new Blob(["file content"]));

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ updated: true }),
      } as Response)
    );

    const result = await fetchUpdateProfile(formData);
    expect(global.fetch).toHaveBeenCalledWith("/api/profile", {
      method: "PATCH",
      headers: {
        Authorization: "Token token123",
      },
      body: formData,
    });
    expect(result).toEqual({ updated: true });
  });

  it("should throw error when no token", async () => {
    (getAuthToken as jest.Mock).mockReturnValue(null);
    await expect(fetchUpdateProfile({})).rejects.toThrow("No auth token found. Please log in.");
  });

  it("should throw error if response not ok", async () => {
    (getAuthToken as jest.Mock).mockReturnValue("token123");
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: false, statusText: "Bad Request" } as Response)
    );
    await expect(fetchUpdateProfile({})).rejects.toThrow("An error occurred during update profile: Bad Request");
  });
});
