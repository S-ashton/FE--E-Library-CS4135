import type { BookDTO } from "../types/book";

export function normalizeBookSearchPayload(data: unknown): BookDTO[] {
  if (Array.isArray(data)) {
    return data as BookDTO[];
  }
  if (data && typeof data === "object") {
    return [data as BookDTO];
  }
  return [];
}
