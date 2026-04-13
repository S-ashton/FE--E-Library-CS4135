import { useCallback, useEffect, useMemo, useState } from "react";
import AddBookForm from "../../components/ui/AddBookForm/AddBookForm";
import BookCatalogueSearchPanel from "../../components/ui/BookCatalogueSearchPanel/BookCatalogueSearchPanel";
import BookTable from "../../components/ui/BookTable/BookTable";
import { useAddBook } from "../../hooks/useAddBook";
import { useBookCatalogueSearch } from "../../hooks/useBookCatalogueSearch";
import { useManageBooks } from "../../hooks/useManageBooks";
import { useSearchBooks } from "../../hooks/useSearchBooks";
import { Book } from "../../types/book";
import { useToast } from "../../hooks/useToast";
import { resolveCatalogueBooksTableState } from "../../utils/bookSearchFilterHelpers";
import { bookInventoryStatusFromProbe } from "../../utils/bookInventoryStatusFromProbe";
import { useBookCopyAvailability } from "../../hooks/useBookCopyAvailability";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { addBookCopy } from "../../store/bookSlice";

export default function ManagePage() {
  const dispatch = useAppDispatch();
  const {
    books,
    addBook,
    refreshBooks,
    isLoadingBooks,
    booksError,
  } = useManageBooks();
  const { showSuccess, showError } = useToast();

  const { isSearchingBooks, searchForBooks } = useSearchBooks();
  const catalogueSearch = useBookCatalogueSearch({
    refreshBooks,
    searchForBooks,
  });

  const [addingCopyBookId, setAddingCopyBookId] = useState<number | null>(null);
  const [copyAvailBump, setCopyAvailBump] = useState(0);

  const availabilityMap = useBookCopyAvailability(
    books.map((b) => b.id),
    copyAvailBump
  );

  useEffect(() => {
    void refreshBooks().catch(() => {});
  }, [refreshBooks]);

  const booksWithInventory = useMemo<Book[]>(() => {
    return books.map((book) => {
      const probe = availabilityMap[book.id] ?? "loading";
      const status = bookInventoryStatusFromProbe(probe);
      return { ...book, status };
    });
  }, [books, availabilityMap]);

  const booksTableState = resolveCatalogueBooksTableState({
    isLoadingBooks,
    booksError,
    bookCount: booksWithInventory.length,
    hasActiveSearch: catalogueSearch.hasActiveSearch,
  });

  const handleAddCopy = useCallback(
    async (book: Book) => {
      setAddingCopyBookId(book.id);
      try {
        await dispatch(addBookCopy(book.id)).unwrap();
        await refreshBooks();
        setCopyAvailBump((k) => k + 1);
        showSuccess("Copy added to the catalogue.");
      } catch (err) {
        console.error("Failed to add copy:", err);
        showError("Could not add a copy. Please try again.");
      } finally {
        setAddingCopyBookId(null);
      }
    },
    [dispatch, refreshBooks, showError, showSuccess]
  );

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
        setCopyAvailBump((k) => k + 1);
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
          books={booksWithInventory}
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
          onAddCopy={handleAddCopy}
          addingCopyBookId={addingCopyBookId}
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
