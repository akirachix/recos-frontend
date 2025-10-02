"use client";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ForgotPasswordPage from "./page";
import { useRouter } from "next/navigation";
import { useForgotPasswordRequest } from "@/app/hooks/useFetchForgotPassword";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/app/hooks/useFetchForgotPassword", () => ({
  useForgotPasswordRequest: jest.fn(),
}));

import "@testing-library/jest-dom";

describe("ForgotPasswordPage", () => {
  const mockPush = jest.fn();
  const mockRequestCode = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useForgotPasswordRequest as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
      success: false,
      requestCode: mockRequestCode,
    });
  });

  it("renders the email input and submit button", () => {
    render(<ForgotPasswordPage />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /recover password/i })).toBeInTheDocument();
  });

  it("updates email input value on change", () => {
    render(<ForgotPasswordPage />);
    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    expect(emailInput).toHaveValue("test@example.com");
  });

  it("calls requestCode on form submission", async () => {
    render(<ForgotPasswordPage />);
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole("button", { name: /recover password/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockRequestCode).toHaveBeenCalledWith("test@example.com");
    });
  });

  it("displays error message when error is present", () => {
    (useForgotPasswordRequest as jest.Mock).mockReturnValue({
      loading: false,
      error: "Invalid email",
      success: false,
      requestCode: mockRequestCode,
    });

    render(<ForgotPasswordPage />);
    expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
  });

  it("redirects to verify-reset-code on success", async () => {
    (useForgotPasswordRequest as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
      success: true,
      requestCode: mockRequestCode,
    });

    render(<ForgotPasswordPage />);
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole("button", { name: /recover password/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(
        `/authentication/verify-reset-code?email=${encodeURIComponent("test@example.com")}`
      );
    });
  });
});