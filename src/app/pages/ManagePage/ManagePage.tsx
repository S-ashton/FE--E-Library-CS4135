import { useCallback, useEffect, useMemo, useState } from "react";
import AddBookForm from "../../components/ui/AddBookForm/AddBookForm";
import BookCatalogueSearchPanel from "../../components/ui/BookCatalogueSearchPanel/BookCatalogueSearchPanel";
import BookTable from "../../components/ui/BookTable/BookTable";
import DeleteCheck from "../../components/ui/deleteCheck/deleteCheck";
import EditBookForm from "../../components/ui/EditBookForm/EditBookForm";
import { useAddBook } from "../../hooks/useAddBook";
import { useBookCatalogueSearch } from "../../hooks/useBookCatalogueSearch";
import { useDeleteBook } from "../../hooks/useDeleteBooks";
import { useManageBooks } from "../../hooks/useManageBooks";
import { useSearchBooks } from "../../hooks/useSearchBooks";
import { Book } from "../../types/book";
import { useToast } from "../../hooks/useToast";
import { resolveCatalogueBooksTableState } from "../../utils/bookSearchFilterHelpers";
import { bookInventoryStatusFromProbe } from "../../utils/bookInventoryStatusFromProbe";
import type { CopyAvailability } from "../../types/copyAvailability";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { addBookCopy } from "../../store/bookSlice";

export default function ManagePage() {
  const dispatch = useAppDispatch();
  const {
    books,
    addBook,
    editBook,
    removeBook,
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

  const { bookToDelete, requestDelete, cancelDelete, confirmDelete } = useDeleteBook({
    onDelete: async (bookId) => {
      try {
        await removeBook(Number(bookId));
        showSuccess("Book deleted successfully!");
      } catch (err) {
        console.error("Failed to delete book:", err);
        const message = typeof err === "string" ? err : "Failed to delete book. Please try again.";
        showError(message);
      }
    },
  });

  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [addingCopyBookId, setAddingCopyBookId] = useState<number | null>(null);
  const availabilityMap = useMemo<Record<number, CopyAvailability>>(
    () => Object.fromEntries(books.map((b) => [b.id, (b.copiesAvailable ?? 0) > 0 ? "available" : "all_borrowed"] as const)),
    [books]
  );

  useEffect(() => {
    void refreshBooks().catch(() => {});
  }, [refreshBooks]);

  const booksWithInventory = useMemo<Book[]>(() => {
    const mapped = books.map((book) => {
      const probe = availabilityMap[book.id] ?? "loading";
      const status = bookInventoryStatusFromProbe(probe);
      return { ...book, status };
    });
    if (!catalogueSearch.hasActiveSearch) {
      mapped.sort((a, b) => a.title.localeCompare(b.title));
    }
    return mapped;
  }, [books, availabilityMap, catalogueSearch.hasActiveSearch]);

  const booksTableState = resolveCatalogueBooksTableState({
    isLoadingBooks,
    booksError,
    bookCount: booksWithInventory.length,
    hasActiveSearch: catalogueSearch.hasActiveSearch,
  });

  const refreshCatalogueAfterError = useCallback(async () => {
    try {
      await refreshBooks();
    } catch {
    }
  }, [refreshBooks]);

  const handleEditBook = useCallback(
    async (fields: {
      title: string;
      author: string;
      description: string;
      category: string;
      year: string;
      language: string;
      coverImage: File | null;
    }) => {
      if (!selectedBook) return;
      setEditError(null);
      setIsEditSubmitting(true);
      try {
        await editBook(selectedBook.id, {
          title: fields.title.trim(),
          author: fields.author.trim(),
          description: fields.description.trim(),
          category: fields.category.trim().toUpperCase(),
          yearPublished: Number(fields.year),
          language: fields.language.trim().toUpperCase(),
          coverImage: fields.coverImage,
        });
        setSelectedBook(null);
        await refreshBooks();
        showSuccess("Book updated successfully!");
      } catch (err) {
        console.error("Failed to update book:", err);
        setEditError("Failed to update book. Please try again.");
      } finally {
        setIsEditSubmitting(false);
      }
    },
    [selectedBook, editBook, refreshBooks, showSuccess]
  );

  const handleAddCopy = useCallback(
    async (book: Book) => {
      setAddingCopyBookId(book.id);
      try {
        await dispatch(addBookCopy(book.id)).unwrap();
        await refreshBooks();
        showSuccess("Copy added to the catalogue.");
      } catch (err) {
        console.error("Failed to add copy:", err);
        showError("Could not add a copy. Please try again.");
        await refreshCatalogueAfterError();
      } finally {
        setAddingCopyBookId(null);
      }
    },
    [dispatch, refreshBooks, refreshCatalogueAfterError, showError, showSuccess]
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
        showSuccess("Book added successfully!");
      } catch (err) {
        console.error("Failed to add book:", err);
        showError("Failed to add book. Please try again.");
        await refreshCatalogueAfterError();
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
          onSelectBook={setSelectedBook}
          onAddCopy={handleAddCopy}
          addingCopyBookId={addingCopyBookId}
          onDeleteBook={requestDelete}
        />

        {selectedBook && (
          <EditBookForm
            book={selectedBook}
            isSubmitting={isEditSubmitting}
            error={editError}
            onClose={() => { setSelectedBook(null); setEditError(null); }}
            onSubmit={handleEditBook}
          />
        )}

        {bookToDelete && (
          <DeleteCheck
            bookTitle={bookToDelete.title}
            onConfirm={confirmDelete}
            onCancel={cancelDelete}
          />
        )}
      </section>
    </div>
  );
}
