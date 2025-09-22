import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ResetPasswordPage from "@/app/authentication/reset-password/page";
import { useResetPassword } from "@/hooks/useFetchResetPassword";
import { useRouter } from "next/navigation";

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

jest.mock("@/hooks/useFetchResetPassword");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("ResetPasswordPage", () => {
  let mockResetPassword: jest.Mock;
  let mockPush: jest.Mock;

  beforeEach(() => {
    mockResetPassword = jest.fn();
    mockPush = jest.fn();

    (useResetPassword as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
      success: false,
      resetPassword: mockResetPassword,
    });

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    delete (window as any).location;
    (window as any).location = { search: "?email=test@example.com" };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders password and confirm password fields and submit button", () => {
    render(<ResetPasswordPage />);
    expect(screen.getByLabelText(/new password/i, { selector: "input" })).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i, { selector: "input" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /continue/i })).toBeInTheDocument();
  });

  it("toggles password visibility on icon button click", () => {
    render(<ResetPasswordPage />);
    const passwordInput = screen.getByLabelText(/new password/i, { selector: "input" });
    const toggleButtons = screen.getAllByRole("button").filter((btn) =>
      /password/i.test(btn.getAttribute("aria-label") || "")
    );

    fireEvent.click(toggleButtons[0]);
    expect(passwordInput).toHaveAttribute("type", "text");

    fireEvent.click(toggleButtons[0]);
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("shows error if passwords do not match when typing", () => {
    render(<ResetPasswordPage />);
    const passwordInput = screen.getByLabelText(/new password/i, { selector: "input" });
    const confirmInput = screen.getByLabelText(/confirm password/i, { selector: "input" });

    fireEvent.change(passwordInput, { target: { value: "pass1" } });
    fireEvent.change(confirmInput, { target: { value: "pass2" } });

    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
  });

  it("does not submit and shows error if passwords do not match on submit", () => {
    render(<ResetPasswordPage />);
    const passwordInput = screen.getByLabelText(/new password/i, { selector: "input" });
    const confirmInput = screen.getByLabelText(/confirm password/i, { selector: "input" });
    const button = screen.getByRole("button", { name: /continue/i });

    fireEvent.change(passwordInput, { target: { value: "password1" } });
    fireEvent.change(confirmInput, { target: { value: "password2" } });

    fireEvent.click(button);

    expect(mockResetPassword).not.toHaveBeenCalled();
    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
  });

  it("calls resetPassword with email and passwords when valid and submits", () => {
    render(<ResetPasswordPage />);
    const passwordInput = screen.getByLabelText(/new password/i, { selector: "input" });
    const confirmInput = screen.getByLabelText(/confirm password/i, { selector: "input" });
    const button = screen.getByRole("button", { name: /continue/i });

    fireEvent.change(passwordInput, { target: { value: "Password123!" } });
    fireEvent.change(confirmInput, { target: { value: "Password123!" } });

    fireEvent.click(button);

    expect(mockResetPassword).toHaveBeenCalledWith("test@example.com", "Password123!", "Password123!");
  });

  it("disables submit button and shows 'Changing...' when loading", () => {
    (useResetPassword as jest.Mock).mockReturnValue({
      loading: true,
      error: null,
      success: false,
      resetPassword: mockResetPassword,
    });

    render(<ResetPasswordPage />);
    const button = screen.getByRole("button", { name: /changing.../i });
    expect(button).toBeDisabled();
  });

  it("shows error message from hook if exists", () => {
    (useResetPassword as jest.Mock).mockReturnValue({
      loading: false,
      error: "Reset failed",
      success: false,
      resetPassword: mockResetPassword,
    });

    render(<ResetPasswordPage />);
    expect(screen.getByText(/reset failed/i)).toBeInTheDocument();
  });

  it("shows success message if reset successful", () => {
    (useResetPassword as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
      success: true,
      resetPassword: mockResetPassword,
    });

    render(<ResetPasswordPage />);
    expect(screen.getByText(/password reset successful/i)).toBeInTheDocument();
  });

  it("navigates to login on successful reset", async () => {
    (useResetPassword as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
      success: true,
      resetPassword: mockResetPassword,
    });

    render(<ResetPasswordPage />);
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/login"));
  });
});
