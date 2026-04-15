import type { FormEvent } from "react";
import styles from "./AddUserForm.module.css";

export type UserRole = "USER" | "STAFF" | "ADMIN";

type AddUserFormProps = {
  userEmail: string;
  userPassword: string;
  userRole: UserRole | "";
  error?: string | null;
  isSubmitting?: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onRoleChange: (value: UserRole | "") => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
};

export default function AddUserForm({
  userEmail,
  userPassword,
  userRole,
  error,
  isSubmitting = false,
  onEmailChange,
  onPasswordChange,
  onRoleChange,
  onSubmit,
}: AddUserFormProps) {
  return (
    <section className={styles.formCard}>
      <div className={styles.header}>
        <h2 className={styles.heading}>Add New User</h2>

        <p className={styles.subheading}>
          Create a new user account and assign a role.
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

          <div className={styles.field}>
            <label htmlFor="userRole" className={styles.label}>
              Role
            </label>
            <select
              id="userRole"
              value={userRole}
              onChange={(e) => onRoleChange(e.target.value as UserRole | "")}
              disabled={isSubmitting}
              className={styles.select}
            >
              <option value="">Select a role</option>
              <option value="USER">USER</option>
              <option value="STAFF">STAFF</option>
              <option value="ADMIN">ADMIN</option>
            </select>
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