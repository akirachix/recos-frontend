import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Signup from "./page";
import { useRouter } from "next/navigation";
import useRegister from "../hooks/useRegister";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("../hooks/useRegister");

describe("Signup", () => {
  const pushMock = jest.fn();
  const registerMock = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();

    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    (useRegister as jest.Mock).mockReturnValue({
      register: registerMock,
      loading: false,
      error: null,
    });

    pushMock.mockClear();
    registerMock.mockClear();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test("renders all form fields", () => {
    render(<Signup />);
    expect(screen.getByLabelText("First Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Last Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  test("toggles password visibility", () => {
    render(<Signup />);
    const passwordInput = screen.getByLabelText("Password");
    const toggleButton = screen.getByRole("button", { name: /show password/i });
    expect(passwordInput).toHaveAttribute("type", "password");
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "text");
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("calls register, shows success, and redirects on 'success'", async () => {
    registerMock.mockResolvedValueOnce("success");

    render(<Signup />);
    fireEvent.change(screen.getByLabelText("First Name"), {
      target: { value: "Lynn", name: "first_name" },
    });
    fireEvent.change(screen.getByLabelText("Last Name"), {
      target: { value: "Amondi", name: "last_name" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "amondilynn@gmail.com", name: "email" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "lynnamondi", name: "password" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(registerMock).toHaveBeenCalledWith({
        first_name: "Lynn",
        last_name: "Amondi",
        email: "amondilynn@gmail.com",
        password: "lynnamondi",
      });
      expect(screen.getByText("Successfully registered!")).toBeInTheDocument();
    });

    jest.runAllTimers();

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/signin");
    });
  });

  test("calls register and shows message on 'exists' result without redirect", async () => {
    registerMock.mockResolvedValueOnce("exists");

    render(<Signup />);
    fireEvent.change(screen.getByLabelText("First Name"), {
      target: { value: "Lynn", name: "first_name" },
    });
    fireEvent.change(screen.getByLabelText("Last Name"), {
      target: { value: "Amondi", name: "last_name" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "amondilynn@gmail.com", name: "email" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "lynnamondi", name: "password" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(registerMock).toHaveBeenCalledWith({
        first_name: "Lynn",
        last_name: "Amondi",
        email: "amondilynn@gmail.com",
        password: "lynnamondi",
      });
      expect(screen.getByText("User already exists. Please sign in.")).toBeInTheDocument();
    });

  
    expect(pushMock).not.toHaveBeenCalled();
  });

  test("shows error message when error exists", () => {
    (useRegister as jest.Mock).mockReturnValue({
      register: jest.fn(),
      loading: false,
      error: "Registration failed",
    });
    render(<Signup />);
    expect(screen.getByText("Registration failed")).toBeInTheDocument();
  });

  test("disables sign up button when loading", () => {
    (useRegister as jest.Mock).mockReturnValue({
      register: jest.fn(),
      loading: true,
      error: null,
    });
    render(<Signup />);
    const button = screen.getByRole("button", { name: /signing up/i });
    expect(button).toBeDisabled();
  });

  test("renders all Sign In links correctly", () => {
    render(<Signup />);
    const signInLinks = screen.getAllByRole("link", { name: /sign in/i });
    expect(signInLinks.length).toBeGreaterThanOrEqual(2);
    signInLinks.forEach(link => {
      expect(link).toHaveAttribute("href", "/signin");
    });
  });
});
