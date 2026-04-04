import { useState } from 'react'
import type { Book } from '../types/book'

type UseDeleteBookParams = {
  onDelete: (bookId: number) => void
}

export function useDeleteBook({ onDelete }: UseDeleteBookParams) {
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null)

  const requestDelete = (book: Book) => {
    setBookToDelete(book)
  }

  const cancelDelete = () => {
    setBookToDelete(null)
  }

  const confirmDelete = () => {
    if (!bookToDelete) return

    onDelete(bookToDelete.id)
    setBookToDelete(null)
  }

  return {
    bookToDelete,
    requestDelete,
    cancelDelete,
    confirmDelete,
  }
}