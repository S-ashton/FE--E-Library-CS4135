import type { BookSearchFilters } from "../types/bookSearch";

export type BookSearchFieldValues = {
  searchQuery: string;
  filterGenre: string;
  filterYear: string;
  filterLanguage: string;
};

export function buildBookSearchFilters(
  fields: BookSearchFieldValues
): BookSearchFilters {
  const keyword = fields.searchQuery.trim() || undefined;
  const genre = fields.filterGenre.trim() || undefined;
  let year: number | undefined;
  const ys = fields.filterYear.trim();
  if (ys) {
    const n = Number(ys);
    if (!Number.isNaN(n) && n !== 0) {
      year = n;
    }
  }
  const language = fields.filterLanguage.trim() || undefined;
  return { keyword, genre, year, language };
}

export function hasActiveBookSearch(filters: BookSearchFilters): boolean {
  return !!(
    filters.keyword ||
    filters.genre ||
    filters.year !== undefined ||
    filters.language
  );
}

export type CatalogueBooksTableViewState =
  | "loading"
  | "empty"
  | "error"
  | "populated"
  | "noSearchResults";

export function resolveCatalogueBooksTableState(args: {
  isLoadingBooks: boolean;
  booksError: string | null;
  bookCount: number;
  hasActiveSearch: boolean;
}): CatalogueBooksTableViewState {
  if (args.isLoadingBooks) {
    return "loading";
  }
  if (args.booksError) {
    return "error";
  }
  if (args.bookCount === 0) {
    return args.hasActiveSearch ? "noSearchResults" : "empty";
  }
  return "populated";
}
