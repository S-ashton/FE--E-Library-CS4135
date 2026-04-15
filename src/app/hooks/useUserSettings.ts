import { useState, useCallback } from "react";
import { useAppDispatch } from "./reduxHooks";
import { updateUserEmail, updateUserPassword } from "../store/authSlice";

export function useUserSettings() {
  const dispatch = useAppDispatch();
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const changeEmail = useCallback(
    async (newEmail: string) => {
      setEmailError(null);
      setEmailSuccess(false);
      setIsUpdatingEmail(true);
      try {
        await dispatch(updateUserEmail({ email: newEmail })).unwrap();
        setEmailSuccess(true);
      } catch (err: unknown) {
        if (typeof err === "string") {
          setEmailError(err);
        } else {
          setEmailError("Failed to update email. Please try again.");
        }
      } finally {
        setIsUpdatingEmail(false);
      }
    },
    [dispatch]
  );

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      setPasswordError(null);
      setPasswordSuccess(false);
      setIsUpdatingPassword(true);
      try {
        await dispatch(
          updateUserPassword({ currentPassword, newPassword })
        ).unwrap();
        setPasswordSuccess(true);
      } catch (err: unknown) {
        if (typeof err === "string") {
          setPasswordError(err);
        } else {
          setPasswordError("Failed to update password. Please try again.");
        }
      } finally {
        setIsUpdatingPassword(false);
      }
    },
    [dispatch]
  );

  return {
    changeEmail,
    isUpdatingEmail,
    emailError,
    emailSuccess,
    changePassword,
    isUpdatingPassword,
    passwordError,
    passwordSuccess,
  };
}
