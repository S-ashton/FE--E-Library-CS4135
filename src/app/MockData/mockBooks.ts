import type { Book } from '../types/book'

export const mockBooks: Book[] = [
  {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    title: 'The Silent Echo',
    author: 'Elena Rostova',
    category: 'Fiction',
    year: 2021,
    status: 'Available',
    description: 'A mystery novel about memory, loss, and hidden truths.',
  },
  {
    id: '1e1a6183-7aa7-4d48-a868-9a39e613370d',
    title: 'Beyond the Stars',
    author: 'Julian Vance',
    category: 'Sci-Fi',
    year: 2023,
    status: 'Borrowed',
    description: 'A science-fiction journey through deep space.',
  },
  {
    id: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
    title: 'Whispers in the Wind',
    author: 'Sarah Jenkins',
    category: 'Fantasy',
    year: 2019,
    status: 'Available',
  },
]