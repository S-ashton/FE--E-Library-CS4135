import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import EditBookForm from "./EditBookForm";
import type { Book } from "../../../types/book";

const mockBook: Book = {
  id: 1,
  title: "Test Book",
  author: "Test Author",
  category: "FANTASY",
  yearPublished: 2020,
  language: "ENGLISH",
  description: "A test description",
  status: "Available",
};

describe("EditBookForm", () => {
  it("renders with pre-filled values from the book", () => {
    render(
      <EditBookForm book={mockBook} onClose={vi.fn()} onSubmit={vi.fn()} />
    );

    expect(screen.getByRole("heading", { name: /edit book/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/book title/i)).toHaveValue("Test Book");
    expect(screen.getByLabelText(/author/i)).toHaveValue("Test Author");
    expect(screen.getByLabelText(/genre/i)).toHaveValue("FANTASY");
    expect(screen.getByLabelText(/year/i)).toHaveValue(2020);
    expect(screen.getByLabelText(/language/i)).toHaveValue("ENGLISH");
    expect(screen.getByLabelText(/description/i)).toHaveValue("A test description");
  });

  it("shows validation error when required fields are cleared", async () => {
    const user = userEvent.setup();
    render(
      <EditBookForm book={mockBook} onClose={vi.fn()} onSubmit={vi.fn()} />
    );

    const titleInput = screen.getByLabelText(/book title/i);
    await user.clear(titleInput);
    await user.click(screen.getByRole("button", { name: /save changes/i }));

    expect(screen.getByText(/please fill in all required fields/i)).toBeInTheDocument();
  });

  it("shows validation error for year out of range", async () => {
    const outOfRangeBook: Book = { ...mockBook, yearPublished: 3000 };
    render(
      <EditBookForm book={outOfRangeBook} onClose={vi.fn()} onSubmit={vi.fn()} />
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /save changes/i }));

    expect(screen.getByText(/year must be between 1000 and 2026/i)).toBeInTheDocument();
  });

  it("calls onSubmit with the form values", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <EditBookForm book={mockBook} onClose={vi.fn()} onSubmit={onSubmit} />
    );

    await user.click(screen.getByRole("button", { name: /save changes/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      title: "Test Book",
      author: "Test Author",
      description: "A test description",
      category: "FANTASY",
      year: "2020",
      language: "ENGLISH",
      coverImage: null,
    });
  });

  it("calls onClose when cancel is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <EditBookForm book={mockBook} onClose={onClose} onSubmit={vi.fn()} />
    );

    await user.click(screen.getByRole("button", { name: /cancel/i }));

    expect(onClose).toHaveBeenCalled();
  });

  it("displays external error prop", () => {
    render(
      <EditBookForm
        book={mockBook}
        error="Something went wrong"
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("disables buttons when isSubmitting is true", () => {
    render(
      <EditBookForm
        book={mockBook}
        isSubmitting
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />
    );

    expect(screen.getByRole("button", { name: /saving/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeDisabled();
  });
});
