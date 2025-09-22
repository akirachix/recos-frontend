import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import VerifyResetCodePage from "@/app/authentication/verify-reset-code/page";
import { useFetchVerifyResetCode } from "@/hooks/useFetchVerifyResetCode";
import { useForgotPasswordRequest } from "@/hooks/useFetchForgotPassword";
import { useRouter } from "next/navigation";


jest.mock("@/hooks/useFetchVerifyResetCode");
jest.mock("@/hooks/useFetchForgotPassword");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("next/image", () => ({
    __esModule: true,
    default: (props: any) => <img {...props} />,
  }));

describe("VerifyResetCodePage", () => {
  let mockVerifyResetCode: jest.Mock;
  let mockRequestCode: jest.Mock;
  let mockPush: jest.Mock;

  beforeEach(() => {
    mockVerifyResetCode = jest.fn();
    mockRequestCode = jest.fn();
    mockPush = jest.fn();

    (useFetchVerifyResetCode as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
      verified: false,
      verifyResetCode: mockVerifyResetCode,
    });

    (useForgotPasswordRequest as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
      success: false,
      requestCode: mockRequestCode,
    });

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });

    delete (window as any).location;
    (window as any).location = {
      search: "?email=test%40example.com",
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders the 4 code input boxes and email text", () => {
    render(<VerifyResetCodePage />);
    const inputs = screen.getAllByRole("textbox");
    expect(inputs).toHaveLength(4);

    expect(screen.getByText("test@example.com")).toBeInTheDocument();
    expect(screen.getByText(/email verification/i)).toBeInTheDocument();
  });

  it("focuses next input on valid digit entry", () => {
    render(<VerifyResetCodePage />);
    const inputs = screen.getAllByRole("textbox");

    const focusSpy = jest.spyOn(inputs[1], "focus");
    fireEvent.change(inputs[0], { target: { value: "1" } });

    expect(focusSpy).toHaveBeenCalled();

    focusSpy.mockRestore();
  });

  it("shows input error message when code length is incomplete and prevents submit", () => {
    render(<VerifyResetCodePage />);
    const inputs = screen.getAllByRole("textbox");
    const button = screen.getByRole("button", { name: /verify/i });

    fireEvent.change(inputs[0], { target: { value: "1" } });
    fireEvent.change(inputs[1], { target: { value: "2" } });
    fireEvent.click(button);

    expect(screen.getByText(/please enter the 4-digit code/i)).toBeInTheDocument();
    expect(mockVerifyResetCode).not.toHaveBeenCalled();
  });

  it("calls verifyResetCode with email and code on complete submit", () => {
    render(<VerifyResetCodePage />);
    const inputs = screen.getAllByRole("textbox");
    const button = screen.getByRole("button", { name: /verify/i });

    fireEvent.change(inputs[0], { target: { value: "1" } });
    fireEvent.change(inputs[1], { target: { value: "2" } });
    fireEvent.change(inputs[2], { target: { value: "3" } });
    fireEvent.change(inputs[3], { target: { value: "4" } });

    fireEvent.click(button);
    expect(mockVerifyResetCode).toHaveBeenCalledWith("test@example.com", "1234");
  });

  it("shows error message if verifyResetCode hook returns error", () => {
    (useFetchVerifyResetCode as jest.Mock).mockReturnValue({
      loading: false,
      error: "Invalid code",
      verified: false,
      verifyResetCode: mockVerifyResetCode,
    });
    render(<VerifyResetCodePage />);
    expect(screen.getByText(/invalid code/i)).toBeInTheDocument();
  });

  it("redirects to reset password page on verified", async () => {
    const { rerender } = render(<VerifyResetCodePage />);
    (useFetchVerifyResetCode as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
      verified: true,
      verifyResetCode: mockVerifyResetCode,
    });
    rerender(<VerifyResetCodePage />);

    await waitFor(() =>
      expect(mockPush).toHaveBeenCalledWith(
        "/authentication/reset-password?email=test%40example.com"
      )
    );
  });

  it("calls requestCode on resend click and shows resend messages", async () => {
    (useForgotPasswordRequest as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
      success: true,
      requestCode: mockRequestCode,
    });
    render(<VerifyResetCodePage />);
    const resendLink = screen.getByText(/resend/i);
    fireEvent.click(resendLink);

    expect(mockRequestCode).toHaveBeenCalledWith("test@example.com");
    await waitFor(() => {
      expect(screen.getByText(/code resent!/i)).toBeInTheDocument();
    });
  });
});
