import { renderHook, waitFor } from "@testing-library/react";
import { useCompanies } from "@/app/hooks/useFetchCompanies";

describe("useCompanies hook", () => {
  const token = "valid-token";

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("sets error and empties companies if token is missing", async () => {
    const { result } = renderHook(() => useCompanies(null));

    expect(result.current.error).toBe("Missing token");
    expect(result.current.companies.length).toBe(0);
  });

  it("fetches companies successfully", async () => {
    const mockCompanies = [
      { company_id: "1", company_name: "Company One" },
      { company_id: "2", company_name: "Company Two" },
    ];

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: mockCompanies }),
      } as Response)
    );

    const { result } = renderHook(() => useCompanies(token));

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(result.current.companies).toEqual(mockCompanies);
    });
  });

  it("handles fetch error", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        statusText: "Unauthorized",
      } as Response)
    );

    const { result } = renderHook(() => useCompanies(token));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.companies.length).toBe(0);
      expect(result.current.error).toBe("Failed to fetch companies: Unauthorized");
    });
  });

  it("handles unexpected data format", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ notData: [] }),
      } as Response)
    );

    const { result } = renderHook(() => useCompanies(token));
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.companies).toEqual([]);
    });
  });
});
