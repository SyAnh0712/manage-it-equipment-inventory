import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "../pages/auth/Login";
import { useAuth } from "../hooks/useAuth";

// Mock useNavigate and Link
const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

// Mock useAuth
const mockLogin = vi.fn();
vi.mock("../hooks/useAuth", () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

describe("Login Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all form fields and submit button", () => {
    render(<Login />);

    expect(screen.getByLabelText("Corporate Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /login to system/i }),
    ).toBeInTheDocument();
  });

  it("toggles password visibility when toggle button is clicked", async () => {
    render(<Login />);

    const passwordInput = screen.getByLabelText("Password");
    const toggleButton = screen.getByRole("button", { name: /show password/i });

    expect(passwordInput).toHaveAttribute("type", "password");

    await userEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "text");
    expect(
      screen.getByRole("button", { name: /hide password/i }),
    ).toBeInTheDocument();

    await userEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("validates empty inputs and displays error messages", async () => {
    render(<Login />);

    const submitButton = screen.getByRole("button", {
      name: /login to system/i,
    });
    await userEvent.click(submitButton);

    expect(await screen.findByText("Email is required")).toBeInTheDocument();
    expect(await screen.findByText("Password is required")).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("validates email format and displays error message", async () => {
    render(<Login />);

    const emailInput = screen.getByLabelText("Corporate Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", {
      name: /login to system/i,
    });

    await userEvent.type(emailInput, "invalid-email");
    await userEvent.type(passwordInput, "password123");
    await userEvent.click(submitButton);

    expect(await screen.findByText("Invalid email format")).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("submits successfully and navigates to dashboard on successful login", async () => {
    mockLogin.mockResolvedValue({ requires2FA: false });
    render(<Login />);

    const emailInput = screen.getByLabelText("Corporate Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", {
      name: /login to system/i,
    });

    await userEvent.type(emailInput, "test@company.com");
    await userEvent.type(passwordInput, "password123");
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "test@company.com",
        password: "password123",
      });
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("displays global error message when login fails", async () => {
    mockLogin.mockRejectedValue({ message: "Invalid credentials" });
    render(<Login />);

    const emailInput = screen.getByLabelText("Corporate Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", {
      name: /login to system/i,
    });

    await userEvent.type(emailInput, "test@company.com");
    await userEvent.type(passwordInput, "wrongpassword");
    await userEvent.click(submitButton);

    const errorMessage = await screen.findByRole("alert");
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent("Invalid credentials");
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
