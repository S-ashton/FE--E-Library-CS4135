import { useCallback, useEffect } from 'react'
import {
  clearRecommendations,
  fetchRecommendations,
} from '../store/recommendationSlice'
import { useAppDispatch, useAppSelector } from './reduxHooks'

export function useRecommendations(limit = 5, enabled = true) {
  const dispatch = useAppDispatch()
  const { items, status, error, lastFetchedAt } = useAppSelector(
    (state) => state.recommendations
  )
  const userId = useAppSelector((state) => state.auth.user?.id)
  const loanHistoryRevision = useAppSelector((state) =>
    [...state.loans.history]
      .sort((a, b) => a.id.localeCompare(b.id))
      .map((l) => `${l.id}:${l.status}`)
      .join('|')
  )

  const refresh = useCallback(() => {
    if (!enabled) return
    dispatch(fetchRecommendations({ limit }))
  }, [dispatch, limit, enabled])

  useEffect(() => {
    if (!userId) {
      dispatch(clearRecommendations())
      return
    }
    if (!enabled) {
      dispatch(clearRecommendations())
      return
    }
    refresh()
  }, [userId, enabled, loanHistoryRevision, refresh, dispatch])

  return {
    items,
    isLoading: enabled && status === 'loading',
    error: enabled ? error : null,
    lastFetchedAt: enabled ? lastFetchedAt : null,
    refresh,
  }
}
