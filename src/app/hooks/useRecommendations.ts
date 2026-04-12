import { useCallback, useEffect } from 'react'
import {
  clearRecommendations,
  fetchRecommendations,
} from '../store/recommendationSlice'
import { useAppDispatch, useAppSelector } from './reduxHooks'

/**
 * @param enabled When false (e.g. user has no loan history), the API is not called
 *                and recommendation state is cleared.
 */
export function useRecommendations(limit = 5, enabled = true) {
  const dispatch = useAppDispatch()
  const { items, status, error, lastFetchedAt } = useAppSelector(
    (state) => state.recommendations
  )
  const userId = useAppSelector((state) => state.auth.user?.id)

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
  }, [userId, enabled, refresh, dispatch])

  return {
    items,
    isLoading: enabled && status === 'loading',
    error: enabled ? error : null,
    lastFetchedAt: enabled ? lastFetchedAt : null,
    refresh,
  }
}
