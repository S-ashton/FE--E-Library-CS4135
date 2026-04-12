import { startTransition, useEffect, useMemo, useRef, useState } from "react";
import RecDashboard from "../../components/ui/recDashboard";
import { useManageBooks } from "../../hooks/useManageBooks";
import { Book, type BookDTO, toBook } from "../../types/book";
import BookDetailsCard from "../../components/ui/BookDetailsCard/BookDetailsCard";
import ActiveLoansCard from "../../components/ui/ActiveLoansCard/ActiveLoansCard";
import { useLoanHistory } from "../../hooks/useLoanHistory";
import { useReturnBook } from "../../hooks/useReturnBook";
import { useRequestLoan } from "../../hooks/useRequestLoan";
import { useToast } from "../../hooks/useToast";
import { useRecommendations } from "../../hooks/useRecommendations";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { getBookDetails } from "../../store/bookSlice";
import { useBookCopyAvailability } from "../../hooks/useBookCopyAvailability";
import { resolveCatalogueTitleId } from "../../utils/loanCopyIdStorage";

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { history, isLoadingHistory, error, refreshHistory } = useLoanHistory();
  const { requestLoan, isBorrowing } = useRequestLoan();
  const { returnBookLoan, isReturning } = useReturnBook();
  const { books, refreshBooks } = useManageBooks();
  const [probeRefresh, setProbeRefresh] = useState(0);

  const availabilityMap = useBookCopyAvailability(
    books.map((b) => b.id),
    probeRefresh
  );
  const user = useAppSelector((state) => state.auth.user);
  const hasBorrowingHistory = history.length > 0;
  const recommendationsEnabled =
    Boolean(user) && !isLoadingHistory && hasBorrowingHistory;

  const {
    items: recommendationItems,
    isLoading: recommendationsLoading,
    error: recommendationsError,
    lastFetchedAt,
    refresh: refreshRecommendations,
  } = useRecommendations(5, recommendationsEnabled);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const { showSuccess, showError } = useToast();

  const [bookDetailsById, setBookDetailsById] = useState<
    Record<
      number,
      { title: string; author: string; coverImageUrl?: string }
    >
  >({});
  const recommendationFetchStarted = useRef(new Set<number>());

  const recommendationItemsKey = useMemo(
    () =>
      recommendationItems
        .map((r) => `${r.bookId}:${r.score}`)
        .sort()
        .join("|"),
    [recommendationItems]
  );

  useEffect(() => {
    if (!user || !recommendationsEnabled) {
      startTransition(() => {
        setBookDetailsById((prev) =>
          Object.keys(prev).length === 0 ? prev : {}
        );
      });
      recommendationFetchStarted.current.clear();
      return;
    }

    recommendationItems.forEach((r) => {
      const id = r.bookId;
      if (books.some((b) => b.id === id)) return;
      if (recommendationFetchStarted.current.has(id)) return;

      recommendationFetchStarted.current.add(id);
      dispatch(getBookDetails(String(id)))
        .unwrap()
        .then((dto) => {
          const b = toBook(dto as BookDTO);
          recommendationFetchStarted.current.delete(id);
          setBookDetailsById((prev) => ({
            ...prev,
            [id]: {
              title: b.title,
              author: b.author,
              coverImageUrl: b.coverImageUrl,
            },
          }));
        })
        .catch(() => {
          recommendationFetchStarted.current.delete(id);
          setBookDetailsById((prev) => ({
            ...prev,
            [id]: {
              title: "Could not load book details",
              author: "",
            },
          }));
        });
    });
  }, [user, recommendationsEnabled, recommendationItemsKey, books, dispatch, recommendationItems]);

  const resolvedRecommendations = useMemo(() => {
    if (!recommendationsEnabled) return [];
    return recommendationItems.map((r) => {
      const fromCatalogue = books.find((b) => b.id === r.bookId);
      if (fromCatalogue) {
        return {
          bookId: r.bookId,
          score: r.score,
          title: fromCatalogue.title,
          author: fromCatalogue.author,
          coverImageUrl: fromCatalogue.coverImageUrl,
          metaLoading: false,
        };
      }
      const fetched = bookDetailsById[r.bookId];
      if (fetched) {
        return {
          bookId: r.bookId,
          score: r.score,
          title: fetched.title,
          author: fetched.author,
          coverImageUrl: fetched.coverImageUrl,
          metaLoading: false,
        };
      }
      return {
        bookId: r.bookId,
        score: r.score,
        title: "",
        author: undefined,
        coverImageUrl: undefined,
        metaLoading: true,
      };
    });
  }, [recommendationItems, books, bookDetailsById, recommendationsEnabled]);

  const lastUpdatedLabel =
    !recommendationsEnabled
      ? "—"
      : lastFetchedAt != null
        ? new Date(lastFetchedAt).toLocaleString()
        : "Not yet loaded";

  useEffect(() => {
    void Promise.all([refreshHistory(), refreshBooks()]).catch(() => {});
  }, [refreshHistory, refreshBooks]);

  const borrowedBooks = useMemo(() => {
    return history
      .filter((loan) => loan.status === "ACTIVE")
      .map((loan) => {
        const titleId = resolveCatalogueTitleId(loan.bookId);
        const book = books.find(
          (b) => b.id === titleId || String(b.id) === String(titleId)
        );

        return {
          loanId: loan.id,
          bookId: loan.bookId,
          title: book?.title ?? "Unknown book",
          author: book?.author ?? "Unknown author",
          dueDate: loan.dueDate,
          status: loan.status,
          fineAmount: loan.fineAmount ?? null,
          coverImageUrl: book?.coverImageUrl,
        };
      });
    }, [history, books]);

  const handleReturnBook = async (loanId: string): Promise<void> => {
    try {
      await returnBookLoan(loanId);
      setProbeRefresh((k) => k + 1);
      await Promise.all([refreshHistory(), refreshBooks()]);
      showSuccess("Book returned successfully!");
    } catch (err) {
      console.error("Error returning book:", err);
      showError("Failed to return book. Please try again.");
    }
  };

  const handleBorrowBook = async (book: Book) => {
    try {
      await requestLoan(book.id.toString());
      setSelectedBook(null);
      setProbeRefresh((k) => k + 1);
      await Promise.all([refreshHistory(), refreshBooks()]);
      showSuccess("Book borrowed successfully!");
    } catch (err) {
      console.error("Failed to borrow book:", err);
      showError("Failed to borrow book. Please try again.");
    }
  };

  const activeLoansState =
    isLoadingHistory
      ? "loading"
      : error
        ? "error"
        : borrowedBooks.length === 0
          ? "empty"
          : "populated";

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

        <RecDashboard
          onRefresh={refreshRecommendations}
          isLoading={Boolean(user) && recommendationsLoading}
          isAuthenticated={Boolean(user)}
          isHistoryLoading={Boolean(user) && isLoadingHistory}
          showBorrowFirstEmpty={
            Boolean(user) && !isLoadingHistory && !hasBorrowingHistory
          }
          error={recommendationsError}
          recommendations={
            user && recommendationsEnabled ? resolvedRecommendations : []
          }
          lastUpdatedLabel={user ? lastUpdatedLabel : "Not yet loaded"}
        />
        <ActiveLoansCard
          borrowedBooks={borrowedBooks}
          state={activeLoansState}
          isReturning={isReturning}
          onReturnBook={handleReturnBook}
        />

        {selectedBook && (
          <BookDetailsCard
            book={selectedBook}
            onClose={() => setSelectedBook(null)}
            onBorrow={handleBorrowBook}
            isSubmitting={isBorrowing}
            error={error}
            copyAvailability={
              selectedBook ? availabilityMap[selectedBook.id] : undefined
            }
          />
        )}
      </div>
    );
}
