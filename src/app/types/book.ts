export type Book = {
  id: number
  title: string
  author: string
  category: string
  yearPublished: number
  status: "Available" | "Borrowed"
  description?: string
  language: string
  coverImageUrl?: string
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
    status: "Available",
  }
}