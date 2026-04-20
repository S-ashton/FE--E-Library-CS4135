import { useState, type FormEvent } from "react";
import type { Book } from "../../../types/book";
import styles from "./EditBookForm.module.css";

type EditBookFormProps = {
  book: Book;
  isSubmitting?: boolean;
  error?: string | null;
  onClose: () => void;
  onSubmit: (fields: {
    title: string;
    author: string;
    description: string;
    category: string;
    year: string;
    language: string;
    coverImage: File | null;
  }) => void;
};

export default function EditBookForm({
  book,
  isSubmitting = false,
  error,
  onClose,
  onSubmit,
}: EditBookFormProps) {
  const [title, setTitle] = useState(book.title);
  const [author, setAuthor] = useState(book.author);
  const [description, setDescription] = useState(book.description ?? "");
  const [category, setCategory] = useState(book.category);
  const [year, setYear] = useState(String(book.yearPublished));
  const [language, setLanguage] = useState(book.language);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError(null);

    if (!title.trim() || !author.trim() || !category.trim() || !year.trim()) {
      setValidationError("Please fill in all required fields.");
      return;
    }

    if (Number.isNaN(Number(year))) {
      setValidationError("Year must be a valid number.");
      return;
    }

    if (Number(year) < 1000 || Number(year) > 2026) {
      setValidationError("Year must be between 1000 and 2026.");
      return;
    }

    onSubmit({ title, author, description, category, year, language, coverImage });
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <section className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.heading}>Edit Book</h2>
            <p className={styles.subheading}>Update the details for this title.</p>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close edit book form"
          >
            &times;
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {(error || validationError) && (
            <div className={styles.errorBox}>{error ?? validationError}</div>
          )}

          <div className={styles.fieldsGrid}>
            <div className={styles.field}>
              <label htmlFor="editBookTitle" className={styles.label}>
                Book Title
              </label>
              <input
                id="editBookTitle"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isSubmitting}
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="editBookAuthor" className={styles.label}>
                Author
              </label>
              <input
                id="editBookAuthor"
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                disabled={isSubmitting}
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="editBookGenre" className={styles.label}>
                Genre
              </label>
              <select
                id="editBookGenre"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={isSubmitting}
                className={styles.input}
              >
                <option value="">Select genre</option>
                <option value="ROMANCE">Romance</option>
                <option value="FANTASY">Fantasy</option>
                <option value="SCIFI">Science Fiction</option>
                <option value="MEMOIR">Memoir</option>
                <option value="CHILDREN">Children</option>
                <option value="YA">Young Adult</option>
                <option value="TRUECRIME">True Crime</option>
                <option value="THRILLER">Thriller</option>
                <option value="SELFHELP">Self Help</option>
                <option value="HISTORICALFICTION">Historical Fiction</option>
                <option value="HISTORICALNF">Historical Non-Fiction</option>
                <option value="NONFICTION">Non-Fiction</option>
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor="editBookLanguage" className={styles.label}>
                Language
              </label>
              <select
                id="editBookLanguage"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                disabled={isSubmitting}
                className={styles.input}
              >
                <option value="">Select language</option>
                <option value="ENGLISH">English</option>
                <option value="SPANISH">Spanish</option>
                <option value="FRENCH">French</option>
                <option value="GERMAN">German</option>
                <option value="JAPANESE">Japanese</option>
                <option value="ITALIAN">Italian</option>
                <option value="RUSSIAN">Russian</option>
                <option value="PORTUGESE">Portuguese</option>
                <option value="CHINESE">Chinese</option>
                <option value="ARABIC">Arabic</option>
                <option value="HINDI">Hindi</option>
                <option value="BENGALI">Bengali</option>
                <option value="PUNJABI">Punjabi</option>
                <option value="POLISH">Polish</option>
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor="editBookYear" className={styles.label}>
                Year
              </label>
              <input
                id="editBookYear"
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                disabled={isSubmitting}
                min={1000}
                max={2026}
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="editBookCoverImage" className={styles.label}>
                Cover Image
              </label>
              {book.coverImageUrl && !coverImage && (
                <div className={styles.currentCover}>
                  <img
                    src={book.coverImageUrl}
                    alt="Current cover"
                    className={styles.currentCoverImg}
                  />
                  <span className={styles.currentCoverLabel}>Current cover</span>
                </div>
              )}
              <input
                id="editBookCoverImage"
                type="file"
                accept="image/png, image/jpeg"
                onChange={(e) => setCoverImage(e.target.files?.[0] ?? null)}
                disabled={isSubmitting}
              />
            </div>

            <div className={styles.fullWidthField}>
              <label htmlFor="editBookDescription" className={styles.label}>
                Description
              </label>
              <textarea
                id="editBookDescription"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSubmitting}
                rows={4}
                className={styles.textarea}
              />
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
