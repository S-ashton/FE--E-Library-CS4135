import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import EditUserForm from "./EditUserForm";
import type { UserListItem } from "../../../store/usersSlice";

const mockUser: UserListItem = {
  id: 1,
  email: "user@test.com",
  role: "USER",
  createdAt: "2026-01-01T00:00:00Z",
};

describe("EditUserForm", () => {
  it("renders with pre-filled values from the user", () => {
    render(
      <EditUserForm user={mockUser} onClose={vi.fn()} onSubmit={vi.fn()} />
    );

    expect(screen.getByRole("heading", { name: /edit user/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toHaveValue("user@test.com");
    expect(screen.getByLabelText(/role/i)).toHaveValue("USER");
  });

  it("shows validation error when email is cleared", async () => {
    const user = userEvent.setup();
    render(
      <EditUserForm user={mockUser} onClose={vi.fn()} onSubmit={vi.fn()} />
    );

    const emailInput = screen.getByLabelText(/email/i);
    await user.clear(emailInput);
    await user.click(screen.getByRole("button", { name: /save changes/i }));

    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
  });

  it("calls onSubmit with the form values", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <EditUserForm user={mockUser} onClose={vi.fn()} onSubmit={onSubmit} />
    );

    await user.click(screen.getByRole("button", { name: /save changes/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      email: "user@test.com",
      role: "USER",
    });
  });

  it("calls onSubmit with updated values after editing", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <EditUserForm user={mockUser} onClose={vi.fn()} onSubmit={onSubmit} />
    );

    const emailInput = screen.getByLabelText(/email/i);
    await user.clear(emailInput);
    await user.type(emailInput, "new@test.com");

    const roleSelect = screen.getByLabelText(/role/i);
    await user.selectOptions(roleSelect, "STAFF");

    await user.click(screen.getByRole("button", { name: /save changes/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      email: "new@test.com",
      role: "STAFF",
    });
  });

  it("calls onClose when cancel is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <EditUserForm user={mockUser} onClose={onClose} onSubmit={vi.fn()} />
    );

    await user.click(screen.getByRole("button", { name: /cancel/i }));

    expect(onClose).toHaveBeenCalled();
  });

  it("displays external error prop", () => {
    render(
      <EditUserForm
        user={mockUser}
        error="Something went wrong"
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("disables buttons when isSubmitting is true", () => {
    render(
      <EditUserForm
        user={mockUser}
        isSubmitting
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />
    );

    expect(screen.getByRole("button", { name: /saving/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeDisabled();
  });
});
