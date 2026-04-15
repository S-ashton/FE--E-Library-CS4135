import type { BookSearchFilters } from "../types/bookSearch";

export function buildBookSearchRequestParams(
  filters: BookSearchFilters
): Record<string, string | number> {
  const params: Record<string, string | number> = {};

  const keyword = filters.keyword?.trim();
  if (keyword) {
    params.keyword = keyword;
  }

  const genre = filters.genre?.trim();
  if (genre) {
    params.genre = genre.toUpperCase();
  }

  if (
    filters.year !== undefined &&
    filters.year !== null &&
    !Number.isNaN(filters.year) &&
    filters.year !== 0 &&
    filters.year >= 1000 &&
    filters.year <= 2026
  ) {
    params.year = filters.year;
  }

  const language = filters.language?.trim();
  if (language) {
    params.language = language.toUpperCase();
  }

  return params;
}
