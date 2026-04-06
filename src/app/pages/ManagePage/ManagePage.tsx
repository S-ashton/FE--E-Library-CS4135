import { useMemo } from "react";
import AddBookForm from "../../components/ui/AddBookForm/AddBookForm";
import BookTable from "../../components/ui/BookTable/BookTable"; 
import DeleteCheck from "../../components/ui/deleteCheck/deleteCheck";
import { useAddBook } from "../../hooks/useAddBook";
import { useDeleteBook } from "../../hooks/useDeleteBooks"; 
import { useManageBooks } from "../../hooks/useManageBooks";
import { Book } from "../../types/book";
import { useLoanHistory } from "../../hooks/useLoanHistory";

export default function ManagePage() {
  const { books, deleteBook, addBook } = useManageBooks();
  const { history } = useLoanHistory();

  const booksWithLoanStatus = useMemo<Book[]>(() => {
    return books.map((book) => {
        const hasActiveLoan = history.some(
        (loan) => loan.bookId === book.id && loan.status === "ACTIVE"
        );

        return {
        ...book,
        status: hasActiveLoan ? "Borrowed" : "Available",
        };
    });
  }, [books, history]);

  const {
    title,
    author,
    description,
    category,
    year,
    error,
    isSubmitting,
    setTitle,
    setAuthor,
    setDescription,
    setCategory,
    setYear,
    handleSubmit,
  } = useAddBook({
    onAddBook: addBook,
  });

  const {
    bookToDelete,
    requestDelete,
    cancelDelete,
    confirmDelete,
  } = useDeleteBook({
    onDelete: deleteBook,
  });

  return (
    <div
      style={{
        display: "grid",
        gap: "24px",
      }}
    >
      <section
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
          padding: "24px",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "2rem",
            color: "#0f172a",
          }}
        >
          Manage Library
        </h1>

        <p
          style={{
            margin: "12px 0 0",
            color: "#475569",
            maxWidth: "720px",
          }}
        >
          Manage Library Catalogue.
        </p>
      </section>

      <section>
        <BookTable
          title="Library Catalogue"
          books={booksWithLoanStatus}
          mode="admin"
          state="populated"
          onDeleteBook={requestDelete}
        />
      </section>

      <section>
        <AddBookForm
        bookTitle={title}
        bookAuthor={author}
        bookDescription={description}
        bookGenre={category}
        bookYear={year}
        error={error}
        isSubmitting={isSubmitting}
        onTitleChange={setTitle}
        onAuthorChange={setAuthor}
        onDescriptionChange={setDescription}
        onGenreChange={setCategory}
        onYearChange={setYear}
        onSubmit={handleSubmit}
      />
      </section>

      {bookToDelete && (
        <DeleteCheck
          bookTitle={bookToDelete.title}
          onCancel={cancelDelete}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}