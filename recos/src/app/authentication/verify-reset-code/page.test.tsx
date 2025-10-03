/* eslint-disable @next/next/no-img-element */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import VerifyResetCodePage from "@/app/authentication/verify-reset-code/page";

import { useFetchVerifyResetCode } from "@/app/hooks/useFetchVerifyResetCode";
import { useForgotPasswordRequest } from "@/app/hooks/useFetchForgotPassword";
import { useRouter } from "next/navigation";
import '@testing-library/jest-dom';

jest.mock("@/app/hooks/useFetchVerifyResetCode");
jest.mock("@/app/hooks/useFetchForgotPassword");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} alt={props.alt || ""} />,
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
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders 4 input boxes and email verification heading", () => {
    render(<VerifyResetCodePage />);
    expect(screen.getAllByRole("textbox")).toHaveLength(4);
    expect(screen.getByText(/email verification/i)).toBeInTheDocument();
  });

  it("moves focus to next input on digit entry", () => {
    render(<VerifyResetCodePage />);
    const inputs = screen.getAllByRole("textbox");

    const focusSpy = jest.spyOn(inputs[1], "focus");
    fireEvent.change(inputs[0], { target: { value: "5" } });

    expect(focusSpy).toHaveBeenCalled();

    focusSpy.mockRestore();
  });

  it("shows error and prevents submit if code incomplete", () => {
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

    expect(mockVerifyResetCode).toHaveBeenCalledWith(expect.any(String), "1234");
  });

  it("displays error message returned from verifyResetCode hook", () => {
    (useFetchVerifyResetCode as jest.Mock).mockReturnValue({
      loading: false,
      error: "Invalid code",
      verified: false,
      verifyResetCode: mockVerifyResetCode,
    });
    render(<VerifyResetCodePage />);
    expect(screen.getByText(/invalid code/i)).toBeInTheDocument();
  });

  it("redirects to reset-password page when verified", async () => {
    const { rerender } = render(<VerifyResetCodePage />);
    (useFetchVerifyResetCode as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
      verified: true,
      verifyResetCode: mockVerifyResetCode,
    });
    rerender(<VerifyResetCodePage />);
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(expect.stringContaining("/authentication/reset-password"));
    });
  });
});
