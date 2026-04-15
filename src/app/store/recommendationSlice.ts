import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import apiClient from '../services/apiClient'
import type { RecommendationResponse } from '../types/recommendation'
import type { RootState } from './store'

type FetchRecommendationsArg = {
  limit?: number
}

export const fetchRecommendations = createAsyncThunk<
  RecommendationResponse[],
  FetchRecommendationsArg | void,
  { rejectValue: string; state: RootState }
>(
  'recommendations/fetchRecommendations',
  async (arg, { getState, rejectWithValue }) => {
    const userId = getState().auth.user?.id
    if (!userId) {
      return rejectWithValue('Sign in to see recommendations.')
    }

    const limit = arg && typeof arg === 'object' ? arg.limit : undefined

    try {
      const response = await apiClient.get<RecommendationResponse[]>(
        '/recommendations',
        {
          params: limit != null ? { limit } : undefined,
        }
      )
      return response.data
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        return rejectWithValue(String(err.response.data.message))
      }
      return rejectWithValue(
        'Could not load recommendations. Please try again.'
      )
    }
  }
)

type RecommendationState = {
  items: RecommendationResponse[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
  lastFetchedAt: string | null
}

const initialState: RecommendationState = {
  items: [],
  status: 'idle',
  error: null,
  lastFetchedAt: null,
}

const recommendationSlice = createSlice({
  name: 'recommendations',
  initialState,
  reducers: {
    clearRecommendations(state) {
      state.items = []
      state.status = 'idle'
      state.error = null
      state.lastFetchedAt = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecommendations.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
        state.lastFetchedAt = new Date().toISOString()
      })
      .addCase(fetchRecommendations.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? 'Failed to load recommendations.'
      })
  },
})

export const { clearRecommendations } = recommendationSlice.actions
export default recommendationSlice.reducer
