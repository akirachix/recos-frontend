// Improved fetchJobs and syncJobs with robust error handling and safe JSON parsing

export const fetchJobs = async (companyId?: string) => {
  try {
    const url = companyId
      ? `/api/jobs?companyId=${encodeURIComponent(companyId)}`
      : `/api/jobs`;

    const response = await fetch(url);

    if (!response.ok) {
      // Try to parse a JSON error body, fallback to text, and provide a sensible default
      let errorMessage = `Request failed with status ${response.status}`;
      const contentType = response.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        const errorData = await response
          .json()
          .catch(() => null);
        if (errorData && (errorData.error || errorData.message)) {
          errorMessage = String(errorData.error ?? errorData.message);
        }
      } else {
        const text = await response.text().catch(() => null);
        if (text) errorMessage = text;
      }

      throw new Error(errorMessage);
    }

    // Expect valid JSON on success
    const data = await response.json();
    return data;
  } catch (err) {
    // Preserve original error message when possible
    if (err instanceof Error) throw err;
    throw new Error("Unknown error while fetching jobs");
  }
};

export const syncJobs = async (companyId: string) => {
  try {
    const response = await fetch(`/api/sync-jobs/${encodeURIComponent(companyId)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      let errorMessage = `Request failed with status ${response.status}`;
      const contentType = response.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        const errorData = await response
          .json()
          .catch(() => null);
        if (errorData && (errorData.error || errorData.message)) {
          errorMessage = String(errorData.error ?? errorData.message);
        }
      } else {
        const text = await response.text().catch(() => null);
        if (text) errorMessage = text;
      }

      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    if (err instanceof Error) throw err;
    throw new Error("Unknown error while syncing jobs");
  }
};