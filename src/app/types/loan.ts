export type LoanDTO = {
    id: string
    userId: number
    bookId: string
    borrowDate: string
    dueDate: string
    returnDate: string | null
    status: string
    fineAmount: number
}

export type BorrowRequestDTO = {
    bookId: string
}

export type LoanStatus = 'ACTIVE' | 'RETURNED' | 'OVERDUE' | string