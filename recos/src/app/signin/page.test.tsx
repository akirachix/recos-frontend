import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import SignIn from "./page";
import { useRouter } from "next/navigation";
import useLogin from "../hooks/useLogin";


jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("../hooks/useLogin");

describe("SignIn", () => {
  const pushMock = jest.fn();
  const loginMock = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();

    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    (useLogin as jest.Mock).mockReturnValue({
      login: loginMock,
      loading: false,
      error: null,
    });

    pushMock.mockClear();
    loginMock.mockClear();
    localStorage.clear();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("renders email and password fields", () => {
    render(<SignIn />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  it("toggles password visibility when the eye icon is clicked", () => {
    render(<SignIn />);
    const passwordInput = screen.getByLabelText("Password");
    const toggleButton = screen.getByRole("button", { name: /show password/i });
    expect(passwordInput).toHaveAttribute("type", "password");
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "text");
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("calls login and redirects on successful login with timer", async () => {
    loginMock.mockResolvedValueOnce(true);

    render(<SignIn />);
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "angie@gmail.com", name: "email" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "angie20", name: "password" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));


    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith({
        email: "angie@gmail.com",
        password: "angie20",
      });
      expect(screen.getByText("Successfully logged in!")).toBeInTheDocument();
    });


    jest.runAllTimers();

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/authentication/odoo");
    });
  });

  it("shows error message if login fails", () => {
    (useLogin as jest.Mock).mockReturnValue({
      login: jest.fn(),
      loading: false,
      error: "Invalid credentials",
    });

    render(<SignIn />);
    expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
  });

  it("updates input fields correctly", () => {
    render(<SignIn />);
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    fireEvent.change(emailInput, {
      target: { value: "angie@gmail.com", name: "email" },
    });
    fireEvent.change(passwordInput, {
      target: { value: "angie20", name: "password" },
    });
    expect(emailInput).toHaveValue("angie@gmail.com");
    expect(passwordInput).toHaveValue("angie20");
  });

  it("disables sign in button when loading", () => {
    (useLogin as jest.Mock).mockReturnValue({
      login: jest.fn(),
      loading: true,
      error: null,
    });
    render(<SignIn />);
    const button = screen.getByRole("button", { name: /signing in/i });
    expect(button).toBeDisabled();
  });

  it("renders multiple Sign Up links and verifies their hrefs", () => {
    render(<SignIn />);
    const links = screen.getAllByRole("link", { name: /sign up/i });
    expect(links.length).toBeGreaterThanOrEqual(2);
    links.forEach((link) => expect(link).toHaveAttribute("href", "/signup"));
  });

  it("renders Forgot Password link correctly", () => {
    render(<SignIn />);
    const forgotLink = screen.getByText(/forgot password\?/i);
    expect(forgotLink.closest("a")).toHaveAttribute("href", "/authentication/forgot-password");
  });
});
