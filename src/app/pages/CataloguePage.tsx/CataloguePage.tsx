import { useMemo, useState, useEffect } from "react";
import BookCatalogueSearchPanel from "../../components/ui/BookCatalogueSearchPanel/BookCatalogueSearchPanel";
import BookDetailsCard from "../../components/ui/BookDetailsCard/BookDetailsCard";
import BookTable from "../../components/ui/BookTable/BookTable";
import { useBookCatalogueSearch } from "../../hooks/useBookCatalogueSearch";
import { useManageBooks } from "../../hooks/useManageBooks";
import { useSearchBooks } from "../../hooks/useSearchBooks";
import { Book } from "../../types/book";
import { useLoanHistory } from "../../hooks/useLoanHistory";
import { useRequestLoan } from "../../hooks/useRequestLoan";
import { useToast } from "../../hooks/useToast";
import { getAvailableCopy } from "../../store/bookSlice";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { resolveCatalogueBooksTableState } from "../../utils/bookSearchFilterHelpers";

export default function CataloguePage() {
  const { history, error, refreshHistory } = useLoanHistory();
  const { requestLoan, isBorrowing } = useRequestLoan();
  const { books, refreshBooks, isLoadingBooks, booksError } = useManageBooks();
  const { isSearchingBooks, searchForBooks } = useSearchBooks();
  const catalogueSearch = useBookCatalogueSearch({
    refreshBooks,
    searchForBooks,
  });
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const { showSuccess, showError } = useToast();
  const dispatch = useAppDispatch();

  useEffect(() => {
    refreshHistory();
    refreshBooks();
  }, [refreshHistory, refreshBooks]);

  const booksWithLoanStatus = useMemo<Book[]>(() => {
    return books.map((book) => {
      const hasActiveLoan = history.some(
        (loan) => loan.bookId === book.id.toString() && loan.status === "ACTIVE"
      );

      return {
        ...book,
        status: hasActiveLoan ? "Borrowed" : "Available",
      };
    });
  }, [books, history]);

  const handleBorrowBook = async (book: Book) => {
    try {
      const availableCopy = await dispatch(getAvailableCopy(book.id)).unwrap();
      console.log("availableCopy", availableCopy);

      await requestLoan(availableCopy.id);
      setSelectedBook(null);
      showSuccess("Book borrowed successfully!");
      await refreshHistory();
      await refreshBooks();
    } catch (err) {
      console.error("Failed to borrow book:", err);
      showError("Failed to borrow book. Please try again.");
    }
  };

  const booksTableState = resolveCatalogueBooksTableState({
    isLoadingBooks,
    booksError,
    bookCount: booksWithLoanStatus.length,
    hasActiveSearch: catalogueSearch.hasActiveSearch,
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
          Book Catalogue
        </h1>

        <p
          style={{
            margin: "12px 0 0",
            color: "#475569",
            maxWidth: "720px",
          }}
        >
          Browse and borrow books from the library catalogue.
        </p>
      </section>

      <section>
        <BookTable
          title="Book Catalogue"
          books={booksWithLoanStatus}
          mode="public"
          state={booksTableState}
          search={
            <BookCatalogueSearchPanel
              idPrefix="catalogue"
              searchQuery={catalogueSearch.searchQuery}
              onSearchQueryChange={catalogueSearch.setSearchQuery}
              filterGenre={catalogueSearch.filterGenre}
              onFilterGenreChange={catalogueSearch.setFilterGenre}
              filterYear={catalogueSearch.filterYear}
              onFilterYearChange={catalogueSearch.setFilterYear}
              filterLanguage={catalogueSearch.filterLanguage}
              onFilterLanguageChange={catalogueSearch.setFilterLanguage}
              onSubmitSearch={catalogueSearch.runCatalogueSearch}
              isSearching={isSearchingBooks}
            />
          }
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
