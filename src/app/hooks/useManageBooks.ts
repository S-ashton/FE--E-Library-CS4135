import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "./reduxHooks";
import { fetchBooks, addBookToLibrary, updateBook, deleteBook } from "../store/bookSlice";
import type { BookInventoryStatus } from "../types/book";
export type AddBookInput = {
  title: string;
  author: string;
  description: string;
  yearPublished: number;
  category: string;
  coverImage?: File | null;
  language?: string;
  status?: BookInventoryStatus | "Borrowed";
};
export function useManageBooks() {
  const dispatch = useAppDispatch();
  const { books, isLoadingBooks, isAddingBook, booksError } = useAppSelector(
    (state) => state.books
  );
  const refreshBooks = useCallback(async () => {
    return await dispatch(fetchBooks()).unwrap();
  }, [dispatch]);
  const addBook = useCallback(
    async (book: AddBookInput) => {
      const formData = new FormData();
      formData.append("title", book.title);
      formData.append("author", book.author);
      formData.append("description", book.description);
      formData.append("yearPublished", String(book.yearPublished));
      formData.append("genre", book.category);
      formData.append("language", book.language ?? "ENGLISH");
      if (book.coverImage) {
        formData.append("coverImage", book.coverImage);
      }
      return await dispatch(addBookToLibrary(formData)).unwrap();
    },
    [dispatch]
  );
  const editBook = useCallback(
    async (bookId: number, book: AddBookInput) => {
      const formData = new FormData();
      formData.append("title", book.title);
      formData.append("author", book.author);
      formData.append("description", book.description);
      formData.append("yearPublished", String(book.yearPublished));
      formData.append("genre", book.category);
      formData.append("language", book.language ?? "ENGLISH");
      if (book.coverImage) {
        formData.append("coverImage", book.coverImage);
      }
      return await dispatch(updateBook({ bookId, formData })).unwrap();
    },
    [dispatch]
  );
  const removeBook = useCallback(
    async (bookId: number) => {
      return await dispatch(deleteBook(bookId)).unwrap();
    },
    [dispatch]
  );
  return {
    books,
    isLoadingBooks,
    isAddingBook,
    booksError,
    refreshBooks,
    addBook,
    editBook,
    removeBook,
  };
}