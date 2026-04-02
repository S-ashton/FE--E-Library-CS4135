import type { Book } from '../types/book'

export const mockBooks: Book[] = [
  {
    id: 1,
    title: 'The Silent Echo',
    author: 'Elena Rostova',
    category: 'Fiction',
    year: 2021,
    status: 'Available',
    description: 'A mystery novel about memory, loss, and hidden truths.',
  },
  {
    id: 2,
    title: 'Beyond the Stars',
    author: 'Julian Vance',
    category: 'Sci-Fi',
    year: 2023,
    status: 'Borrowed',
    description: 'A science-fiction journey through deep space.',
  },
  {
    id: 3,
    title: 'Whispers in the Wind',
    author: 'Sarah Jenkins',
    category: 'Fantasy',
    year: 2019,
    status: 'Available',
  },
]