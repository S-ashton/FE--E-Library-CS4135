import type { FormEvent } from "react";
import styles from "./AddUserForm.module.css";

type AddUserFormProps = {
  userEmail: string;
  userPassword: string;
  error?: string | null;
  isSubmitting?: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
};

export default function AddUserForm({
  userEmail,
  userPassword,
  error,
  isSubmitting = false,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: AddUserFormProps) {
  return (
    <section className={styles.formCard}>
      <div className={styles.header}>
        <h2 className={styles.heading}>Add New User</h2>

        <p className={styles.subheading}>
          Create a new user account. The account will be created with the USER role — you can change it from the users table.
        </p>
      </div>

      <form onSubmit={onSubmit} className={styles.form}>
        {error && <div className={styles.errorBox}>{error}</div>}

        <div className={styles.fieldsGrid}>
          <div className={styles.field}>
            <label htmlFor="userEmail" className={styles.label}>
              User Email
            </label>
            <input
              id="userEmail"
              type="email"
              value={userEmail}
              onChange={(e) => onEmailChange(e.target.value)}
              disabled={isSubmitting}
              className={styles.input}
              placeholder="Enter user email"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="userPassword" className={styles.label}>
              User Password
            </label>
            <input
              id="userPassword"
              type="password"
              value={userPassword}
              onChange={(e) => onPasswordChange(e.target.value)}
              disabled={isSubmitting}
              className={styles.input}
              placeholder="Enter user password"
            />
          </div>

        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`${styles.submitButton} ${
            isSubmitting ? styles.submitButtonDisabled : ""
          }`}
        >
          {isSubmitting ? "Adding..." : "Add User"}
        </button>
      </form>
    </section>
  );
}