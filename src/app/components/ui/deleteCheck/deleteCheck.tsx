import styles from "./DeleteCheck.module.css";

type DeleteCheckProps = {
  bookTitle?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function DeleteCheck({
  bookTitle,
  message,
  onConfirm,
  onCancel,
}: DeleteCheckProps) {
  const displayMessage =
    message ??
    (bookTitle
      ? `Do you want to delete "${bookTitle}" from the library?`
      : "Do you want to delete this item?");

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h2 className={styles.title}>Are you sure?</h2>

          <p className={styles.message}>{displayMessage}</p>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            onClick={onCancel}
            className={styles.cancelButton}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className={styles.confirmButton}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}