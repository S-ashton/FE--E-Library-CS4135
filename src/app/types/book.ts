export type Book = {
  id: string
  title: string
  author: string
  category: string
  year: number
  status: 'Available' | 'Borrowed'
  description?: string
}