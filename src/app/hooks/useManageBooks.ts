// src/app/hooks/useManageBooks.ts
import { useState } from "react";
import { mockBooks } from "../MockData/mockBooks";
import type { Book } from "../types/book";

export function useManageBooks() {
  const [books, setBooks] = useState<Book[]>(mockBooks);

  const addBook = (newBook: Omit<Book, "id">) => {
    const bookToAdd: Book = {
      ...newBook,
      id: Date.now().toString(),
    };

    setBooks((currentBooks) => [bookToAdd, ...currentBooks]);
  };

  const deleteBook = (bookId: string) => {
    setBooks((currentBooks) =>
      currentBooks.filter((book) => book.id !== bookId)
    );
  };

  return {
    books,
    addBook,
    deleteBook,
  };
}