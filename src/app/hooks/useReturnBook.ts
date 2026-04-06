import { returnBook } from "../store/loanSlice";
import { useAppDispatch, useAppSelector } from "./reduxHooks";

export function useReturnBook() {
    const dispatch = useAppDispatch();
    const { isReturning, error } = useAppSelector((state) => state.loans);

    const returnBookLoan = async (loanId: string) => {
        return await dispatch(returnBook(loanId)).unwrap()
    }

    return { isReturning, error, returnBookLoan };
}