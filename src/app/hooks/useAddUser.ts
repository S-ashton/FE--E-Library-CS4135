import { useState } from "react";
import type { FormEvent } from "react";

type AddUserInput = {
  email: string;
  password: string;
};

type UseAddUserParams = {
  onAddUser: (user: AddUserInput) => Promise<void> | void;
};

export function useAddUser({ onAddUser }: UseAddUserParams) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      await onAddUser({
        email: email.trim(),
        password: password.trim(),
      });

      setEmail("");
      setPassword("");
    } catch (err: unknown) {
      if (typeof err === "string") {
        setError(err);
      } else {
        setError("Failed to add user.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    email,
    password,
    error,
    isSubmitting,
    setEmail,
    setPassword,
    handleSubmit,
  };
}