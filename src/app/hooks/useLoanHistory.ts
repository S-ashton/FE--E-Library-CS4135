import { useCallback } from 'react'
import { fetchLoanHistory } from '../store/loanSlice'
import { useAppDispatch, useAppSelector } from './reduxHooks'

export function useLoanHistory() {
  const dispatch = useAppDispatch()
  const { history, isLoadingHistory, error } = useAppSelector((state) => state.loans)

  const refreshHistory = useCallback(() => {
    return dispatch(fetchLoanHistory())
  }, [dispatch])

  return { history, isLoadingHistory, error, refreshHistory }
}