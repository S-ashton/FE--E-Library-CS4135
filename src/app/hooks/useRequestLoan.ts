import { borrowBook } from "../store/loanSlice";
import {
  registerCopyTitleId,
  setLoanCopyId,
} from "../utils/loanCopyIdStorage";
import { useAppDispatch, useAppSelector } from "./reduxHooks";

export function useRequestLoan() {
  const dispatch = useAppDispatch();
  const { isBorrowing, error } = useAppSelector((state) => state.loans);

  const requestLoan = async (bookTitleId: string) => {
    const titleId = Number(bookTitleId);
    const loan = await dispatch(borrowBook(String(titleId))).unwrap();
    const copyId = Number(loan.bookId);
    if (!Number.isNaN(copyId)) {
      setLoanCopyId(loan.id, copyId);
      registerCopyTitleId(copyId, titleId);
    }
    return loan;
  };

  return { isBorrowing, error, requestLoan };
}
