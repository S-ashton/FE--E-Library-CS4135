import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "./reduxHooks";
import type { BookSearchFilters } from "../types/bookSearch";
import { searchBooks } from "../store/bookSlice";

export function useSearchBooks() {
  const dispatch = useAppDispatch();
  const { isSearchingBooks } = useAppSelector((state) => state.books);

  const searchForBooks = useCallback(
    async (filters: BookSearchFilters) => {
      return await dispatch(searchBooks(filters)).unwrap();
    },
    [dispatch]
  );

  return {
    isSearchingBooks,
    searchForBooks,
  };
}