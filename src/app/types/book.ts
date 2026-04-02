export type Book = {
  id: number
  title: string
  author: string
  category: string
  year: number
  status: 'Available' | 'Borrowed'
  description?: string
}