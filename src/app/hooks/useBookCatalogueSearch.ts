import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { BookSearchFilters } from "../types/bookSearch";
import {
  buildBookSearchFilters,
  hasActiveBookSearch,
} from "../utils/bookSearchFilterHelpers";

type UseBookCatalogueSearchParams = {
  refreshBooks: () => Promise<unknown>;
  searchForBooks: (filters: BookSearchFilters) => Promise<unknown>;
};

export function useBookCatalogueSearch({
  refreshBooks,
  searchForBooks,
}: UseBookCatalogueSearchParams) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterGenre, setFilterGenre] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterLanguage, setFilterLanguage] = useState("");
  const skipInitialDebouncedSearch = useRef(true);

  const buildSearchFilters = useCallback((): BookSearchFilters => {
    return buildBookSearchFilters({
      searchQuery,
      filterGenre,
      filterYear,
      filterLanguage,
    });
  }, [searchQuery, filterGenre, filterYear, filterLanguage]);

  const runCatalogueSearch = useCallback(() => {
    void searchForBooks(buildSearchFilters());
  }, [buildSearchFilters, searchForBooks]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      const f = buildSearchFilters();
      const has = hasActiveBookSearch(f);
      if (skipInitialDebouncedSearch.current) {
        skipInitialDebouncedSearch.current = false;
        if (!has) return;
      }
      if (!has) {
        void refreshBooks();
      } else {
        void searchForBooks(f);
      }
    }, 350);
    return () => clearTimeout(id);
  }, [buildSearchFilters, refreshBooks, searchForBooks]);

  const hasActiveSearch = useMemo(() => {
    return hasActiveBookSearch(buildSearchFilters());
  }, [buildSearchFilters]);

  return {
    searchQuery,
    setSearchQuery,
    filterGenre,
    setFilterGenre,
    filterYear,
    setFilterYear,
    filterLanguage,
    setFilterLanguage,
    buildSearchFilters,
    hasActiveSearch,
    runCatalogueSearch,
  };
}
