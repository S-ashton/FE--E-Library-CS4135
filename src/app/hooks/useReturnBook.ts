import { returnBook } from "../store/loanSlice";
import { getLoanCopyId, removeLoanCopyId } from "../utils/loanCopyIdStorage";
import { useAppDispatch, useAppSelector } from "./reduxHooks";

export function useReturnBook() {
  const dispatch = useAppDispatch();
  const { isReturning, error } = useAppSelector((state) => state.loans);

  const returnBookLoan = async (loanId: string) => {
    const copyId = getLoanCopyId(loanId);
    const loan = await dispatch(returnBook(loanId)).unwrap();
    if (copyId != null) {
      removeLoanCopyId(loanId);
    }
    return loan;
  };

  return { isReturning, error, returnBookLoan };
}
