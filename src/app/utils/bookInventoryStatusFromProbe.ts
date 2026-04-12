import type { Book, BookInventoryStatus } from "../types/book";
import type { CopyAvailability } from "../types/copyAvailability";

export function bookInventoryStatusFromProbe(
  raw: CopyAvailability | undefined
): BookInventoryStatus {
  const a = raw ?? "loading";
  switch (a) {
    case "loading":
      return "Checking…";
    case "available":
      return "Available";
    case "all_borrowed":
      return "All copies borrowed";
    case "error":
      return "Unavailable";
  }
}

export function catalogueRowInventoryStatus(
  book: Pick<Book, "copiesAvailable">,
  probe: CopyAvailability | undefined
): BookInventoryStatus {
  if (
    typeof book.copiesAvailable === "number" &&
    book.copiesAvailable <= 0
  ) {
    return "All copies borrowed";
  }
  return bookInventoryStatusFromProbe(probe);
}
