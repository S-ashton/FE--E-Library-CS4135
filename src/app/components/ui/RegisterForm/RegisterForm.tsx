import Spinner from "../Spinner";
import type { FormEvent } from "react";
import styles from "./RegisterForm.module.css";

type RegisterFormProps = {
  email: string;
  password: string;
  error?: string | null;
  emailFieldError?: string;
  passwordFieldErrors?: string[];
  isSubmitting?: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onBackToSignIn?: () => void;
};

export default function RegisterForm({
  email,
  password,
  error,
  emailFieldError = "",
  passwordFieldErrors = [],
  isSubmitting = false,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onBackToSignIn,
}: RegisterFormProps) {
  return (
    <form onSubmit={onSubmit} className={styles.form}>
      {error && <div className={styles.errorBox}>{error}</div>}

      <div className={styles.field}>
        <label htmlFor="register-email" className={styles.label}>
          Email
        </label>
        <input
          id="register-email"
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="Enter your email"
          autoComplete="email"
          disabled={isSubmitting}
          className={styles.input}
        />
        {emailFieldError && (
          <span className={styles.fieldError}>{emailFieldError}</span>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="register-password" className={styles.label}>
          Password
        </label>
        <input
          id="register-password"
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          placeholder="Choose a password"
          autoComplete="new-password"
          disabled={isSubmitting}
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
        {isSubmitting ? "Registering..." : "Create account"}
      </button>

      {onBackToSignIn && (
        <p className={styles.footerHint}>
          Already have an account?{" "}
          <button
            type="button"
            className={styles.linkButton}
            onClick={onBackToSignIn}
          >
            Sign in
          </button>
        </p>
      )}
    </form>
  );
}
