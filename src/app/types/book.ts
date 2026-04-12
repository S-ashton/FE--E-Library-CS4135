export type BookInventoryStatus =
  | "Available"
  | "All copies borrowed"
  | "Checking…"
  | "Unavailable";

export type Book = {
  id: number
  title: string
  author: string
  category: string
  yearPublished: number
  status: BookInventoryStatus | "Borrowed"
  copiesAvailable?: number
  totalCopies?: number
  statusLabel?: string
  description?: string
  language: string
  coverImageUrl?: string
}

export type BookCopyDTO = {
  id: number
  bookId: number
  status: string
}

export type BookDTO = {
  id: number
  title: string
  author: string
  description?: string
  yearPublished: number
  genre: string
  coverImageUrl: string | null
  language: string
  copiesAvailable?: number
  totalCopies?: number
}

export function toBook(dto: BookDTO): Book {
  return {
    id: dto.id,
    title: dto.title,
    author: dto.author,
    description: dto.description,
    yearPublished: dto.yearPublished,
    category: dto.genre,
    language: dto.language,
    coverImageUrl: dto.coverImageUrl ?? undefined,
    copiesAvailable: dto.copiesAvailable,
    totalCopies: dto.totalCopies,
    status: "Checking…",
  }
}