import { useEffect, useMemo, useState } from "react";
import BookTable from "../../components/ui/BookTable/BookTable";
import RecommendationDashboardCard from "../../components/ui/recDashboard";
import { useManageBooks } from "../../hooks/useManageBooks";
import { Book } from "../../types/book";
import BookDetailsCard from "../../components/ui/BookDetailsCard/BookDetailsCard";
import ActiveLoansCard from "../../components/ui/ActiveLoansCard/ActiveLoansCard";
import { useLoanHistory } from "../../hooks/useLoanHistory";
import { useReturnBook } from "../../hooks/useReturnBook";
import { useRequestLoan } from "../../hooks/useRequestLoan";

export default function HomePage() {

  const { history, isLoadingHistory, error, refreshHistory } = useLoanHistory();
  const { requestLoan, isBorrowing } = useRequestLoan();
  const { returnBookLoan, isReturning } = useReturnBook();
  const {books} = useManageBooks();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  const borrowedBooks = useMemo(() => {
    return history
      .filter((loan) => loan.status === "ACTIVE")
      .map((loan) => {
        const book = books.find((b) => b.id === loan.bookId);

        return {
          loanId: loan.id,
          bookId: loan.bookId,
          title: book?.title ?? "Unknown book",
          author: book?.author ?? "Unknown author",
          dueDate: loan.dueDate,
          status: loan.status,
          fineAmount: loan.fineAmount ?? null,
        };
      });
    }, [history, books]);

    const handleReturnBook = async (loanId: string): Promise<void> => {
      try {
        await returnBookLoan(loanId);
      } catch (err) {
        console.error("Error returning book:", err);
      }
    };

      const handleBorrowBook = async (book: Book) => {
        try {
          await requestLoan(book.id);
          setSelectedBook(null);
        } catch (err) {
          console.error("Failed to borrow book:", err);
        }
      };

      const activeLoansState =
        isLoadingHistory
          ? 'loading'
          : error
          ? 'error'
          : borrowedBooks.length === 0
          ? 'empty'
          : 'populated'
        

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
            Welcome to E-Library
          </h1>

          <p
            style={{
              margin: "12px 0 0",
              color: "#475569",
              maxWidth: "720px",
            }}
          >
            Explore books, manage your library activity, and discover personalised
            recommendations.
          </p>
        </section>

        <RecommendationDashboardCard
          onRefresh={() => {
            console.log("Refresh recommendations placeholder");
          }}
        />
        <ActiveLoansCard
          borrowedBooks={borrowedBooks}
          state={activeLoansState}
          isReturning={isReturning}
          onReturnBook={handleReturnBook}
        />
        <BookTable
          title="Book Catalogue"
          books={books}
          mode="public"
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
      </div>


      
      
    );
  }
