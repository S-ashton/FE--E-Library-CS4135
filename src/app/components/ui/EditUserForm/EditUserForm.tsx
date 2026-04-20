import { useState, type FormEvent } from "react";
import type { UserListItem } from "../../../store/usersSlice";
import type { UserRole } from "../../../store/authSlice";
import styles from "./EditUserForm.module.css";

type EditUserFormProps = {
  user: UserListItem;
  isSubmitting?: boolean;
  error?: string | null;
  onClose: () => void;
  onSubmit: (fields: { email: string; role: UserRole }) => void;
};

export default function EditUserForm({
  user,
  isSubmitting = false,
  error,
  onClose,
  onSubmit,
}: EditUserFormProps) {
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState<UserRole>(user.role);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError(null);

    if (!email.trim()) {
      setValidationError("Email is required.");
      return;
    }

    onSubmit({ email: email.trim(), role });
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <section className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.heading}>Edit User</h2>
            <p className={styles.subheading}>Update email or role for this user.</p>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close edit user form"
          >
            &times;
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {(error || validationError) && (
            <div className={styles.errorBox}>{error ?? validationError}</div>
          )}

          <div className={styles.fieldsGrid}>
            <div className={styles.field}>
              <label htmlFor="editUserEmail" className={styles.label}>
                Email
              </label>
              <input
                id="editUserEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="editUserRole" className={styles.label}>
                Role
              </label>
              <select
                id="editUserRole"
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                disabled={isSubmitting}
                className={styles.input}
              >
                <option value="USER">USER</option>
                <option value="STAFF">STAFF</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
