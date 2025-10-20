import '@testing-library/jest-dom';
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import UpdateProfilePage from "./page";
import useFetchProfile from "../hooks/useFetchProfile";
import { fetchUpdateProfile } from "../utils/fetchProfile";
import { removeAuthToken } from "../utils/authToken";
import { CompanyProvider } from "../context/CompanyContext";

global.URL.createObjectURL = jest.fn(() => 'some-url');

jest.mock("../hooks/useFetchProfile");
jest.mock("../utils/fetchProfile");
jest.mock("../utils/authToken");

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: () => '/',
}));

jest.mock("../hooks/useFetchCompanies", () => ({
  useCompanies: () => ({
    companies: [{ company_id: "1", company_name: "Test Company" }],
    isLoading: false,
  }),
}));

const renderWithCompanyProvider = (ui: React.ReactElement) => {
  return render(<CompanyProvider>{ui}</CompanyProvider>);
};

describe("UpdateProfilePage", () => {
  const pushMock = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
  });

  it("renders error message if profile fetch has error", () => {
    (useFetchProfile as jest.Mock).mockReturnValue({
      user: null,
      loading: false,
      error: "Failed to load",
    });
    renderWithCompanyProvider(<UpdateProfilePage />);
    expect(screen.getByText("Failed to load")).toBeInTheDocument();
  });

  it("prefills form with profile data", () => {
    (useFetchProfile as jest.Mock).mockReturnValue({
      user: { email: "jacky@gmail.com", first_name: "Jacky", last_name: "Uwase", image: null },
      loading: false,
      error: null,
    });
    renderWithCompanyProvider(<UpdateProfilePage />);
    expect(screen.getByDisplayValue("jacky@gmail.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Jacky Uwase")).toBeInTheDocument();
  });

  it("submits form and shows success then redirects appropriately", async () => {
    (useFetchProfile as jest.Mock).mockReturnValue({
      user: { email: "old@b.com", first_name: "Old", last_name: "Name", image: null },
      loading: false,
      error: null,
    });
    (fetchUpdateProfile as jest.Mock).mockResolvedValue({});
    (removeAuthToken as jest.Mock).mockImplementation(() => {});

    renderWithCompanyProvider(<UpdateProfilePage />);
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "new@b.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Full Name"), {
      target: { value: "New Name" },
    });

    fireEvent.submit(screen.getByRole("button", { name: "Save"}));

    await waitFor(() => expect(fetchUpdateProfile).toHaveBeenCalled());

    expect(await screen.findByText("Profile updated successfully!")).toBeInTheDocument();
  });

  it("displays error on failed update", async () => {
    (useFetchProfile as jest.Mock).mockReturnValue({
      user: { email: "jacky@gmail.com", first_name: "Jacky", last_name: "Uwase", image: null },
      loading: false,
      error: null,
    });
    (fetchUpdateProfile as jest.Mock).mockRejectedValue(new Error("fail"));

    renderWithCompanyProvider(<UpdateProfilePage />);
    fireEvent.submit(screen.getByRole("button", { name: "Save"}));

    await waitFor(() => expect(fetchUpdateProfile).toHaveBeenCalled());

    expect(await screen.findByText("Update failed. Please try again.")).toBeInTheDocument();
  });

  it("cancel button navigates to profile", () => {
    (useFetchProfile as jest.Mock).mockReturnValue({
      user: { email: "jacky@gmail.com", first_name: "Jacky", last_name: "Uwase", image: null },
      loading: false,
      error: null,
    });
    renderWithCompanyProvider(<UpdateProfilePage />);
    fireEvent.click(screen.getByText("Cancel"));
    expect(pushMock).toHaveBeenCalledWith("/profile");
  });

  it("password toggle shows and hides password", () => {
    (useFetchProfile as jest.Mock).mockReturnValue({
      user: { email: "jacky@gmail.com", first_name: "Jacky", last_name: "Uwase", image: null },
      loading: false,
      error: null,
    });
    renderWithCompanyProvider(<UpdateProfilePage />);
    const toggleBtn = screen.getByLabelText("Show password");
    const passwordInput = screen.getByPlaceholderText("Change Password") as HTMLInputElement;
    expect(passwordInput.type).toBe("password");

    fireEvent.click(toggleBtn);
    expect(screen.getByLabelText("Hide password")).toBeInTheDocument();
    expect(passwordInput.type).toBe("text");
  });
});
