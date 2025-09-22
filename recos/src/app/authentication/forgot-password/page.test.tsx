import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ForgotPasswordPage from "../forgot-password/page"; 
import { useForgotPasswordRequest } from "@/hooks/useFetchForgotPassword";
import { useRouter } from "next/navigation";

jest.mock("../hooks/useFetchForgotPassword");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("ForgotPasswordPage", () => {
  let mockRequestCode: jest.Mock;
  let mockPush: jest.Mock;

  beforeEach(() => {
    mockRequestCode = jest.fn();
    mockPush = jest.fn();

    (useForgotPasswordRequest as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
      success: false,
      requestCode: mockRequestCode,
    });

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders email input and button", () => {
    render(<ForgotPasswordPage />);
    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /recover password/i })).toBeInTheDocument();
  });

  it("accepts input text changes", () => {
    render(<ForgotPasswordPage />);
    const input = screen.getByPlaceholderText(/enter your email/i);
    fireEvent.change(input, { target: { value: "user@example.com" } });
    expect(input).toHaveValue("user@example.com");
  });

  it("calls requestCode with email on submit", () => {
    render(<ForgotPasswordPage />);
    const input = screen.getByPlaceholderText(/enter your email/i);
    const button = screen.getByRole("button", { name: /recover password/i });
    fireEvent.change(input, { target: { value: "test@example.com" } });
    fireEvent.click(button);
    expect(mockRequestCode).toHaveBeenCalledWith("test@example.com");
  });

  it("disables button and shows loading state when loading", () => {
    (useForgotPasswordRequest as jest.Mock).mockReturnValue({
      loading: true,
      error: null,
      success: false,
      requestCode: mockRequestCode,
    });
    render(<ForgotPasswordPage />);
    const button = screen.getByRole("button", { name: /sending.../i });
    expect(button).toBeDisabled();
  });

  it("shows error message if present", () => {
    (useForgotPasswordRequest as jest.Mock).mockReturnValue({
      loading: false,
      error: "Invalid email",
      success: false,
      requestCode: mockRequestCode,
    });
    render(<ForgotPasswordPage />);
    expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
  });

  it("navigates to verify-reset-code page on success", async () => {
    const { rerender } = render(<ForgotPasswordPage />);
    const input = screen.getByPlaceholderText(/enter your email/i);

    fireEvent.change(input, { target: { value: "navigate@test.com" } });
    fireEvent.click(screen.getByRole("button", { name: /recover password/i }));

    expect(mockRequestCode).toHaveBeenCalledWith("navigate@test.com");

    (useForgotPasswordRequest as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
      success: true,
      requestCode: mockRequestCode,
    });

    rerender(<ForgotPasswordPage />);

    await waitFor(() =>
      expect(mockPush).toHaveBeenCalledWith(
        "/authentication/verify-reset-code?email=navigate%40test.com"
      )
    );
  });
});
