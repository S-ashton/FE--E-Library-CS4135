import { type FormEvent, useState } from "react";
import { useAppSelector } from "../../hooks/reduxHooks";
import { useUserSettings } from "../../hooks/useUserSettings";
import { validateEmail, validatePassword, validatePasswordMatch } from "../../utils/validation";
import Spinner from "../../components/ui/Spinner";
import styles from "./SettingsPage.module.css";

export default function SettingsPage() {
  const currentEmail = useAppSelector((state) => state.auth.user?.email ?? "");

  const {
    changeEmail,
    isUpdatingEmail,
    emailError,
    emailSuccess,
    changePassword,
    isUpdatingPassword,
    passwordError,
    passwordSuccess,
  } = useUserSettings();

  const [newEmail, setNewEmail] = useState("");
  const [emailFieldError, setEmailFieldError] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordFieldErrors, setPasswordFieldErrors] = useState<string[]>([]);
  const [confirmFieldError, setConfirmFieldError] = useState("");

  const handleEmailSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailFieldError("");
    const emailResult = validateEmail(newEmail);
    if (!emailResult.valid) {
      setEmailFieldError(emailResult.message);
      return;
    }
    if (newEmail === currentEmail) {
      setEmailFieldError("New email must be different from your current email.");
      return;
    }
    await changeEmail(newEmail);
    if (!emailError) setNewEmail("");
  };

  const handlePasswordSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordFieldErrors([]);
    setConfirmFieldError("");

    const passwordResult = validatePassword(newPassword);
    const matchResult = validatePasswordMatch(newPassword, confirmPassword);

    if (!passwordResult.valid || !matchResult.valid) {
      setPasswordFieldErrors(passwordResult.messages);
      setConfirmFieldError(matchResult.valid ? "" : matchResult.message);
      return;
    }

    await changePassword(currentPassword, newPassword);
    if (!passwordError) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className={styles.page}>
      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Change Email</h2>
        <p className={styles.cardSubtitle}>
          Current email: <strong>{currentEmail}</strong>
        </p>

        <form onSubmit={handleEmailSubmit} className={styles.form} noValidate>
          {emailError && <div className={styles.errorBox}>{emailError}</div>}
          {emailSuccess && (
            <div className={styles.successBox}>Email updated successfully.</div>
          )}

          <div className={styles.field}>
            <label htmlFor="settings-new-email" className={styles.label}>
              New Email Address
            </label>
            <input
              id="settings-new-email"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              disabled={isUpdatingEmail}
              placeholder="Enter new email"
              autoComplete="email"
              className={`${styles.input} ${emailFieldError ? styles.inputError : ""}`}
            />
            {emailFieldError && (
              <p className={styles.fieldError}>{emailFieldError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isUpdatingEmail}
            className={styles.submitButton}
          >
            {isUpdatingEmail && <Spinner size={16} />}
            {isUpdatingEmail ? "Saving…" : "Update Email"}
          </button>
        </form>
      </section>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>Change Password</h2>
        <p className={styles.cardSubtitle}>
          Choose a strong password with at least 8 characters.
        </p>

        <form onSubmit={handlePasswordSubmit} className={styles.form} noValidate>
          {passwordError && (
            <div className={styles.errorBox}>{passwordError}</div>
          )}
          {passwordSuccess && (
            <div className={styles.successBox}>
              Password updated successfully.
            </div>
          )}

          <div className={styles.field}>
            <label htmlFor="settings-current-password" className={styles.label}>
              Current Password
            </label>
            <input
              id="settings-current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={isUpdatingPassword}
              placeholder="Enter current password"
              autoComplete="current-password"
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="settings-new-password" className={styles.label}>
              New Password
            </label>
            <input
              id="settings-new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={isUpdatingPassword}
              placeholder="Enter new password"
              autoComplete="new-password"
              className={`${styles.input} ${passwordFieldErrors.length > 0 ? styles.inputError : ""}`}
            />
            {passwordFieldErrors.length > 0 && (
              <ul className={styles.fieldError} style={{ margin: "4px 0 0", paddingLeft: "18px" }}>
                {passwordFieldErrors.map((msg) => (
                  <li key={msg}>{msg}</li>
                ))}
              </ul>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="settings-confirm-password" className={styles.label}>
              Confirm New Password
            </label>
            <input
              id="settings-confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isUpdatingPassword}
              placeholder="Confirm new password"
              autoComplete="new-password"
              className={`${styles.input} ${confirmFieldError ? styles.inputError : ""}`}
            />
            {confirmFieldError && (
              <p className={styles.fieldError}>{confirmFieldError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isUpdatingPassword}
            className={styles.submitButton}
          >
            {isUpdatingPassword && <Spinner size={16} />}
            {isUpdatingPassword ? "Saving…" : "Update Password"}
          </button>
        </form>
      </section>
    </div>
  );
}
