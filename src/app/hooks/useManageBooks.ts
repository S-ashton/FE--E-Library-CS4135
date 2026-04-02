import { useState } from "react";
import { Book } from "../types/book";
import { mockBooks } from "../MockData/mockBooks";

export function useManageBooks() {
    const [books, setBooks] = useState<Book[]>(mockBooks);
    const deleteBook = (bookId: number) => {
        setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
    };

    return {
        books,
        deleteBook,
    };
}