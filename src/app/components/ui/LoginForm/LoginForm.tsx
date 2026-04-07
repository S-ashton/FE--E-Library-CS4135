import Spinner from "../Spinner";
import type { FormEvent } from "react";
import styles from "./LoginForm.module.css";

type LoginFormProps = {
  email: string;
  password: string;
  error?: string | null;
  emailFieldError?: string;
  passwordFieldErrors?: string[];
  isSubmitting?: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
};

export default function LoginForm({
  email,
  password,
  error,
  emailFieldError = "",
  passwordFieldErrors = [],
  isSubmitting = false,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: LoginFormProps) {
  return (
    <form onSubmit={onSubmit} className={styles.form}>
      {error && <div className={styles.errorBox}>{error}</div>}

      <div className={styles.field}>
        <label htmlFor="email" className={styles.label}>
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="Enter your email"
          autoComplete="email"
          disabled={isSubmitting}
          required
          className={styles.input}
        />
        {emailFieldError && (
          <span className={styles.fieldError}>{emailFieldError}</span>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="password" className={styles.label}>
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          placeholder="Enter your password"
          autoComplete="current-password"
          disabled={isSubmitting}
          required
          className={styles.input}
        />
        {passwordFieldErrors.length > 0 && (
          <ul className={styles.passwordErrorList}>
            {passwordFieldErrors.map((err) => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`${styles.submitButton} ${
          isSubmitting ? styles.submitButtonDisabled : ""
        }`}
      >
        {isSubmitting && <Spinner size={16} />}
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}