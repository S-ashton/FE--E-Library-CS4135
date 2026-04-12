import type { BookDTO } from "../types/book";

function coerceNum(v: unknown): number | undefined {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    if (!Number.isNaN(n)) return n;
  }
  return undefined;
}

function enrichBookDto(item: unknown): BookDTO {
  const dto = item as BookDTO & Record<string, unknown>;
  const o = item as Record<string, unknown>;
  return {
    ...dto,
    copiesAvailable:
      dto.copiesAvailable ??
      coerceNum(o.copies_available) ??
      coerceNum(o.availableCopies),
    totalCopies:
      dto.totalCopies ??
      coerceNum(o.total_copies) ??
      coerceNum(o.copyCount) ??
      coerceNum(o.numberOfCopies),
  };
}

export function normalizeBookSearchPayload(data: unknown): BookDTO[] {
  if (Array.isArray(data)) {
    return data.map(enrichBookDto);
  }
  if (data && typeof data === "object") {
    return [enrichBookDto(data)];
  }
  return [];
}
