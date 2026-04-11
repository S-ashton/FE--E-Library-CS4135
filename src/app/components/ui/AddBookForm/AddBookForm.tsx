import type { FormEvent } from "react";
import styles from "./AddBookForm.module.css";

type AddBookFormProps = {
  bookTitle: string;
  bookAuthor: string;
  bookDescription: string;
  bookGenre: string;
  bookYear: string;
  bookLanguage: string;
  bookCoverImage?: File | null;
  error?: string | null;
  isSubmitting?: boolean;
  onTitleChange: (value: string) => void;
  onAuthorChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onGenreChange: (value: string) => void;
  onYearChange: (value: string) => void;
  onLanguageChange: (value: string) => void;
  onCoverImageChange: (value: File | null) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
};

export default function AddBookForm({
  bookTitle,
  bookAuthor,
  bookDescription,
  bookGenre,
  bookYear,
  bookLanguage,
  error,
  isSubmitting = false,
  onTitleChange,
  onAuthorChange,
  onDescriptionChange,
  onGenreChange,
  onYearChange,
  onLanguageChange,
  onCoverImageChange,
  onSubmit,
}: AddBookFormProps) {
  return (
    <section className={styles.formCard}>
      <div className={styles.header}>
        <h2 className={styles.heading}>Add New Book</h2>

        <p className={styles.subheading}>
          Add a new title to the library catalogue.
        </p>
      </div>

      <form onSubmit={onSubmit} className={styles.form}>
        {error && <div className={styles.errorBox}>{error}</div>}

        <div className={styles.fieldsGrid}>
          <div className={styles.field}>
            <label htmlFor="bookTitle" className={styles.label}>
              Book Title
            </label>
            <input
              id="bookTitle"
              type="text"
              value={bookTitle}
              onChange={(e) => onTitleChange(e.target.value)}
              disabled={isSubmitting}
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="bookAuthor" className={styles.label}>
              Author
            </label>
            <input
              id="bookAuthor"
              type="text"
              value={bookAuthor}
              onChange={(e) => onAuthorChange(e.target.value)}
              disabled={isSubmitting}
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="bookGenre" className={styles.label}>
              Genre
            </label>
            <select 
              id="bookGenre"
              value={bookGenre}
              onChange={(e) => onGenreChange(e.target.value)}
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
            <label htmlFor="bookLanguage" className={styles.label}>
              Language
            </label>
            <select 
              id="bookLanguage"
              value={bookLanguage}
              onChange={(e) => onLanguageChange(e.target.value)}
              disabled={isSubmitting}
              className={styles.input}
            >
              <option value="">Select language</option>
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
              <option value="Japanese">Japanese</option>
              <option value="Italian">Italian</option>
              <option value="Russian">Russian</option>
              <option value="Portuguese">Portuguese</option>
              <option value="Chinese">Chinese</option>
              <option value="Arabic">Arabic</option>
              <option value="Hindi">Hindi</option>
              <option value="Bengali">Bengali</option>
              <option value="Punjabi">Punjabi</option>
            </select>
            
          </div>

          <div className={styles.field}>
            <label htmlFor="bookYear" className={styles.label}>
              Year
            </label>
            <input
              id="bookYear"
              type="number"
              value={bookYear}
              onChange={(e) => onYearChange(e.target.value)}
              disabled={isSubmitting}
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="bookCoverImg" className={styles.label}>
              Cover Image URL
            </label>
            <input
              id="bookCoverImage"
              type="file"
              accept="image/png, image/jpeg"
              onChange={(e) => onCoverImageChange(e.target.files?.[0] ?? null)}
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.fullWidthField}>
            <label htmlFor="bookDescription" className={styles.label}>
              Description
            </label>
            <textarea
              id="bookDescription"
              value={bookDescription}
              onChange={(e) => onDescriptionChange(e.target.value)}
              disabled={isSubmitting}
              rows={5}
              className={styles.textarea}
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
          {isSubmitting ? "Adding..." : "Add Book"}
        </button>
      </form>
    </section>
  );
}