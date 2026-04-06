import { useMemo, useState, useEffect } from "react";
import BookDetailsCard from "../../components/ui/BookDetailsCard/BookDetailsCard";
import BookTable from "../../components/ui/BookTable/BookTable"; 
import { useManageBooks } from "../../hooks/useManageBooks";
import { Book } from "../../types/book";
import { useLoanHistory } from "../../hooks/useLoanHistory";
import { useRequestLoan } from "../../hooks/useRequestLoan";
import { useToast } from "../../hooks/useToast";

export default function CataloguePage() {
    const { history, error, refreshHistory } = useLoanHistory();
      const { requestLoan, isBorrowing } = useRequestLoan();
      const { books } = useManageBooks();
      const [selectedBook, setSelectedBook] = useState<Book | null>(null);
      const { showSuccess, showError } = useToast();
    
      useEffect(() => {
        refreshHistory();
      }, [refreshHistory]);
    
      

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
    
          const handleBorrowBook = async (book: Book) => {
            try {
              await requestLoan(book.id);
              setSelectedBook(null);
              showSuccess("Book borrowed successfully!");
            } catch (err) {
              console.error("Failed to borrow book:", err);
              showError("Failed to borrow book. Please try again.");
            }
          };

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
          Library Catalogue.
        </p>
      </section>

      <section>
        <BookTable
          title="Book Catalogue"
          books={booksWithLoanStatus}
          mode="public"
          state='populated'
          onSelectBook={setSelectedBook}
        />

        {selectedBook && (
          <BookDetailsCard
            book={selectedBook}
            onClose={() => setSelectedBook(null)}
            onBorrow={handleBorrowBook}
            isSubmitting={isBorrowing}
            error={error}
          />
        )}
      </section>
    </div>
  );
}