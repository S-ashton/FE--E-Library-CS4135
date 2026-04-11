import { useCallback } from "react";
import { fetchUsers } from "../store/usersSlice";
import { useAppDispatch, useAppSelector } from "./reduxHooks";

export function useGetUsers() {
  const dispatch = useAppDispatch();
  const { users, isLoading, error } = useAppSelector((state) => state.users);

  const refreshUsers = useCallback(() => {
    return dispatch(fetchUsers());
  }, [dispatch]);

  return {
    users,
    isLoading,
    error,
    refreshUsers,
  };
}