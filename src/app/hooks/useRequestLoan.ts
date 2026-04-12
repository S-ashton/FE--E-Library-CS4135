import { borrowBook } from "../store/loanSlice";
import {
  changeBookCopyStatus,
  getAvailableCopy,
} from "../store/bookSlice";
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
    const availableCopy = await dispatch(getAvailableCopy(titleId)).unwrap();
    await dispatch(
      changeBookCopyStatus({
        copyId: availableCopy.id,
        status: "ON_LOAN",
      })
    ).unwrap();
    const loan = await dispatch(borrowBook(String(availableCopy.id))).unwrap();
    setLoanCopyId(loan.id, availableCopy.id);
    registerCopyTitleId(availableCopy.id, availableCopy.bookId);
    return loan;
  };

  return { isBorrowing, error, requestLoan };
}
