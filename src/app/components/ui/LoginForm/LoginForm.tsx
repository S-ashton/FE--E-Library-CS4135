import Spinner from "../Spinner";
import type { FormEvent } from "react";
import styles from "./LoginForm.module.css";

type LoginFormProps = {
  email: string;
  password: string;
  error?: string | null;
  isSubmitting?: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onTrySignInAgain?: () => void;
  onChooseRegister?: () => void;
};

export default function LoginForm({
  email,
  password,
  error,
  isSubmitting = false,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onTrySignInAgain,
  onChooseRegister,
}: LoginFormProps) {
  const showRecovery =
    Boolean(error) && (onTrySignInAgain || onChooseRegister);

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      {error && <div className={styles.errorBox}>{error}</div>}

      {showRecovery && (
        <p className={styles.recoveryHint}>
          If you already have an account, check your email and password.{" "}
          {onTrySignInAgain && (
            <button
              type="button"
              className={styles.linkButton}
              onClick={onTrySignInAgain}
            >
              Try signing in again
            </button>
          )}
          {onTrySignInAgain && onChooseRegister && (
            <span className={styles.recoverySep}> · </span>
          )}
          {onChooseRegister && (
            <button
              type="button"
              className={styles.linkButton}
              onClick={onChooseRegister}
            >
              Create an account
            </button>
          )}
        </p>
      )}

      <div className={styles.field}>
        <label htmlFor="login-email" className={styles.label}>
          Email
        </label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="Enter your email"
          autoComplete="email"
          disabled={isSubmitting}
          className={styles.input}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="login-password" className={styles.label}>
          Password
        </label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          placeholder="Enter your password"
          autoComplete="current-password"
          disabled={isSubmitting}
          className={styles.input}
        />
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

      {!error && onChooseRegister && (
        <p className={styles.footerHint}>
          New here?{" "}
          <button
            type="button"
            className={styles.linkButton}
            onClick={onChooseRegister}
          >
            Create an account
          </button>
        </p>
      )}
    </form>
  );
}
