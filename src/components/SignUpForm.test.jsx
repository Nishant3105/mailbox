import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignUpForm from "./SignUpForm";
import axios from "axios";
import '@testing-library/jest-dom/extend-expect';

jest.mock("axios");

describe("SignUpForm", () => {
  beforeEach(() => {
    axios.post.mockClear();
  });

  test("renders the form fields", () => {
    render(<SignUpForm />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign up/i })).toBeDisabled();
  });

  test("shows validation errors on blur", async () => {
    render(<SignUpForm />);

    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.blur(emailInput);

    await waitFor(() =>
      expect(screen.getByText("Email is required")).toBeInTheDocument()
    );
  });

  test("enables submit button when valid", async () => {
    render(<SignUpForm />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: "123456" },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: "123456" },
    });

    await waitFor(() =>
      expect(screen.getByRole("button", { name: /sign up/i })).toBeEnabled()
    );
  });

  test("submits the form successfully", async () => {
    axios.post.mockResolvedValue({ data: { message: "User registered successfully" } });

    render(<SignUpForm />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: "123456" },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() =>
      expect(screen.getByText("Signup successful!")).toBeInTheDocument()
    );
  });

  test("shows error message on API failure", async () => {
    axios.post.mockRejectedValueOnce(new Error("Signup failed"));

    render(<SignUpForm />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "fail@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: "123456" },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() =>
      expect(screen.getByText(/signup failed/i)).toBeInTheDocument()
    );
  });
});
