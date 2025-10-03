import '@testing-library/jest-dom';
import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { useRouter } from "next/navigation";
import ProfilePage from "./page";

jest.mock("../hooks/useFetchProfile", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: () => '/',
}));

import useFetchProfile from "../hooks/useFetchProfile";

describe("ProfilePage", () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    jest.clearAllMocks();
  });

  it("renders loading without crashing", () => {
    (useFetchProfile as jest.Mock).mockReturnValue({ user: null, error: null });
    render(<ProfilePage />);
  });

  it("renders error message", () => {
    (useFetchProfile as jest.Mock).mockReturnValue({ user: null, error: "Failed to fetch" });
    render(<ProfilePage />);
    expect(screen.getByText("Failed to fetch")).toBeInTheDocument();
  });

  it("renders profile data correctly", () => {
    const mockUser = {
      first_name: "Jacky",
      last_name: "Uwase",
      email: "angela@gmail.com",
      created_at: "2023-07-10T00:00:00Z",
      image: "/avatar.jpg",
    };
    (useFetchProfile as jest.Mock).mockReturnValue({ user: mockUser, error: null });

    render(<ProfilePage />);

    expect(screen.getByRole('heading', { name: /profile/i })).toBeInTheDocument();
    expect(screen.getByText("Details")).toBeInTheDocument();
    expect(screen.getByText("Jacky Uwase")).toBeInTheDocument();
    expect(screen.getByText("angela@gmail.com")).toBeInTheDocument();
    expect(screen.getByText("Jul 10, 2023")).toBeInTheDocument();

    const img = screen.getByAltText("User Avatar") as HTMLImageElement;
    expect(decodeURIComponent(img.src)).toContain(mockUser.image);
  });

  it("navigates to update-profile on edit button click", () => {
    const mockUser = { first_name: "Jacky", last_name: "Uwase", email: "", created_at: "", image: null };
    (useFetchProfile as jest.Mock).mockReturnValue({ user: mockUser, error: null });

    render(<ProfilePage />);
    const editButton = screen.getAllByRole("button", { name: /edit profile/i })[0];
    fireEvent.click(editButton);
    expect(pushMock).toHaveBeenCalledWith("/update-profile");
  });

  it("navigates to update-profile on update button click", () => {
    const mockUser = { first_name: "Jacky", last_name: "Uwase", email: "", created_at: "", image: null };
    (useFetchProfile as jest.Mock).mockReturnValue({ user: mockUser, error: null });

    render(<ProfilePage />);
    const updateButton = screen.getByRole("button", { name: /update/i });
    fireEvent.click(updateButton);
    expect(pushMock).toHaveBeenCalledWith("/update-profile");
  });
});
