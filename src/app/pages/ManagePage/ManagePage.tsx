import { useEffect, useMemo } from "react";
import AddBookForm from "../../components/ui/AddBookForm/AddBookForm";
import BookCatalogueSearchPanel from "../../components/ui/BookCatalogueSearchPanel/BookCatalogueSearchPanel";
import BookTable from "../../components/ui/BookTable/BookTable";
import { useAddBook } from "../../hooks/useAddBook";
import { useBookCatalogueSearch } from "../../hooks/useBookCatalogueSearch";
import { useManageBooks } from "../../hooks/useManageBooks";
import { useSearchBooks } from "../../hooks/useSearchBooks";
import { Book } from "../../types/book";
import { useLoanHistory } from "../../hooks/useLoanHistory";
import { useToast } from "../../hooks/useToast";
import { resolveCatalogueBooksTableState } from "../../utils/bookSearchFilterHelpers";

export default function ManagePage() {
  const {
    books,
    addBook,
    refreshBooks,
    isLoadingBooks,
    booksError,
  } = useManageBooks();
  const { history, refreshHistory } = useLoanHistory();
  const { showSuccess, showError } = useToast();

  const { isSearchingBooks, searchForBooks } = useSearchBooks();
  const catalogueSearch = useBookCatalogueSearch({
    refreshBooks,
    searchForBooks,
  });

  useEffect(() => {
    refreshBooks();
    refreshHistory();
  }, [refreshBooks, refreshHistory]);

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

  const booksTableState = resolveCatalogueBooksTableState({
    isLoadingBooks,
    booksError,
    bookCount: booksWithLoanStatus.length,
    hasActiveSearch: catalogueSearch.hasActiveSearch,
  });

  const {
    title,
    author,
    description,
    category,
    year,
    language,
    coverImage,
    error,
    isSubmitting,
    setTitle,
    setAuthor,
    setDescription,
    setCategory,
    setYear,
    setLanguage,
    setCoverImage,
    handleSubmit,
  } = useAddBook({
    onAddBook: async (book) => {
      try {
        await addBook(book);
        await refreshBooks();
        showSuccess("Book added successfully!");
      } catch (err) {
        console.error("Failed to add book:", err);
        showError("Failed to add book. Please try again.");
        throw err;
      }
    },
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
          state={booksTableState}
          search={
            <BookCatalogueSearchPanel
              idPrefix="manage"
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
        />
      </section>

      <section>
        <AddBookForm
          bookTitle={title}
          bookAuthor={author}
          bookDescription={description}
          bookGenre={category}
          bookYear={year}
          bookLanguage={language}
          bookCoverImage={coverImage}
          error={error}
          isSubmitting={isSubmitting}
          onTitleChange={setTitle}
          onAuthorChange={setAuthor}
          onDescriptionChange={setDescription}
          onGenreChange={setCategory}
          onYearChange={setYear}
          onLanguageChange={setLanguage}
          onCoverImageChange={setCoverImage}
          onSubmit={handleSubmit}
        />
      </section>
    </div>
  );
}
