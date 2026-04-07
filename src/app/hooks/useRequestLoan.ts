import { borrowBook } from "../store/loanSlice";
import { useAppDispatch, useAppSelector } from "./reduxHooks";

export function useRequestLoan() {
    const dispatch = useAppDispatch();
    const { isBorrowing, error } = useAppSelector((state) => state.loans);

    const requestLoan = async (bookId: string) => {
        return await dispatch(borrowBook(bookId)).unwrap()
    }

    return { isBorrowing, error, requestLoan };
}