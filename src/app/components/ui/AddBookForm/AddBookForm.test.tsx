import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AddBookForm from "./AddBookForm";

describe("AddBookForm", () => {
  it("renders the add book section", () => {
    render(
      <AddBookForm
        bookTitle=""
        bookAuthor=""
        bookDescription=""
        bookGenre=""
        bookYear=""
        error={null}
        isSubmitting={false}
        onTitleChange={vi.fn()}
        onAuthorChange={vi.fn()}
        onDescriptionChange={vi.fn()}
        onGenreChange={vi.fn()}
        onYearChange={vi.fn()}
        onSubmit={(e) => e.preventDefault()}
      />
    );

    expect(screen.getByText(/add new book/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add book/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/book title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/author/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/genre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/year/i)).toBeInTheDocument();
  });
});
 
   