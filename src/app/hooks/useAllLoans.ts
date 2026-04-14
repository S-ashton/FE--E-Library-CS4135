import { useCallback } from 'react'
import { fetchAllLoans } from '../store/loanSlice'
import { useAppDispatch, useAppSelector } from './reduxHooks'

export function useAllLoans() {
  const dispatch = useAppDispatch()
  const { allLoans, isLoadingAllLoans, error } = useAppSelector((state) => state.loans)

  const refreshAllLoans = useCallback(() => {
    return dispatch(fetchAllLoans())
  }, [dispatch])

  return { allLoans, isLoadingAllLoans, error, refreshAllLoans }
}
