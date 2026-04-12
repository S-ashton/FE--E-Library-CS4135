import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import apiClient from '../services/apiClient'
import type { LoanDTO } from '../types/loan'

export const borrowBook = createAsyncThunk(
    'loans/borrowBook',
    async (bookId: string, { rejectWithValue }) => {
        try {
            const response = await apiClient.post<LoanDTO>('/loans', { bookId })
            return response.data
        } catch (err: unknown) {
            if (axios.isAxiosError(err) && err.response?.data?.message) {
                return rejectWithValue(err.response.data.message)
            }
            return rejectWithValue('An error occurred while borrowing the book. Please try again.')
        }
    }
)

export const fetchLoanHistory = createAsyncThunk(
    'loans/fetchLoanHistory',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get<LoanDTO[]>('/loans/history')
            return response.data
        } catch (err: unknown) {
            if (axios.isAxiosError(err) && err.response?.data?.message) {
                return rejectWithValue(err.response.data.message)
            }
            return rejectWithValue('An error occurred while fetching loan history. Please try again.')
        }
    }
)

export const returnBook = createAsyncThunk(
    'loans/returnBook',
    async (loanId: string, { rejectWithValue }) => {
        try {
            const response = await apiClient.post<LoanDTO>(`/loans/${loanId}/return`)
            return response.data
        } catch (err: unknown) {
            if (axios.isAxiosError(err) && err.response?.data?.message) {
                return rejectWithValue(err.response.data.message)
            }
            return rejectWithValue('An error occurred while returning the loan. Please try again.')
        }
    }

)

type LoanState = {
    history: LoanDTO[]
    isBorrowing: boolean
    isLoadingHistory: boolean
    isReturning: boolean
    error: string | null
}

const initialState: LoanState = {
    history: [],
    isBorrowing: false,
    error: null,
    isLoadingHistory: false,
    isReturning: false
}

const loanSlice = createSlice({
    name: 'loans',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(borrowBook.pending, (state) => {
                state.isBorrowing = true
                state.error = null
            })
            .addCase(borrowBook.fulfilled, (state, action) => {
                state.isBorrowing = false
                state.history.unshift(action.payload)
            })
            .addCase(borrowBook.rejected, (state, action) => {
                state.isBorrowing = false
                state.error = (action.payload as string) ?? 'Failed to borrow the book.'
            })
            .addCase(fetchLoanHistory.pending, (state) => {
                state.isLoadingHistory = true
                state.error = null
            })
            .addCase(fetchLoanHistory.fulfilled, (state, action) => {
                state.isLoadingHistory = false
                state.history = action.payload
            })
            .addCase(fetchLoanHistory.rejected, (state, action) => {
                state.isLoadingHistory = false
                state.error = (action.payload as string) ?? 'Failed to fetch loan history.'
            })
            .addCase(returnBook.pending, (state) => {
                state.isReturning = true
                state.error = null
            })
            .addCase(returnBook.fulfilled, (state, action) => {
                state.isReturning = false
                state.error = null

                const index = state.history.findIndex(
                    (loan) => loan.id === action.payload.id
                )

                if (index !== -1) {
                    state.history[index] = action.payload
                } else {
                    state.history.unshift(action.payload)
                }

        })
            .addCase(returnBook.rejected, (state, action) => {
                state.isReturning = false
                state.error = (action.payload as string) ?? 'Failed to return the loan.'
            })  
    }
})

export default loanSlice.reducer