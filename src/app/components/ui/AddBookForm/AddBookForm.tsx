import type { FormEvent } from "react";

type AddBookFormProps = {
  bookTitle: string;
  bookAuthor: string;
  bookDescription: string;
  bookGenre: string;
  bookYear: string;
  error?: string | null;
  isSubmitting?: boolean;
  onTitleChange: (value: string) => void;
  onAuthorChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onGenreChange: (value: string) => void;
  onYearChange: (value: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
};

export default function AddBookForm({
  bookTitle,
  bookAuthor,
  bookDescription,
  bookGenre,
  bookYear,
  error,
  isSubmitting = false,
  onTitleChange,
  onAuthorChange,
  onDescriptionChange,
  onGenreChange,
  onYearChange,
  onSubmit,
}: AddBookFormProps) {
  return (
    <section
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "16px",
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
        padding: "24px",
      }}
    >
      <div style={{ marginBottom: "20px" }}>
        <h2
          style={{
            margin: 0,
            fontSize: "1.4rem",
            color: "#0f172a",
          }}
        >
          Add New Book
        </h2>

        <p
          style={{
            margin: "8px 0 0",
            color: "#475569",
          }}
        >
          Add a new title to the library catalogue.
        </p>
      </div>

        <form onSubmit={onSubmit} style={{ display: "grid", gap: "20px" }}>
            {error && (
                <div
                    style={{
                        color: "#dc2626",
                        background: "#fef2f2",
                        border: "1px solid #fecaca",
                        borderRadius: "10px",
                        padding: "10px 12px",
                        fontSize: "0.95rem",
                    }}
                    >
                    {error}
                </div>
            )}

        <div
            style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "20px",
            }}>
            <div style={{ display: "grid", gap: "6px" }}>
                <label htmlFor="bookTitle" style={{ fontWeight: 600 }}>
                    Book Title
                </label>
                <input
                    id="bookTitle"
                    type="text"
                    value={bookTitle}
                    onChange={(e) => onTitleChange(e.target.value)}
                    disabled={isSubmitting}
                    style={{
                    width: "100%",
                    maxWidth: "400px", 
                    padding: "12px 14px",
                    border: "1px solid #cbd5e1",
                    borderRadius: "10px",
                    background: "#ffffff",
                    color: "#0f172a",
                    }}/>
            </div>

            <div style={{ display: "grid", gap: "6px" }}>
                <label htmlFor="bookAuthor" style={{ fontWeight: 600 }}>
                    Author
                </label>
                <input
                    id="bookAuthor"
                    type="text"
                    value={bookAuthor}
                    onChange={(e) => onAuthorChange(e.target.value)}
                    disabled={isSubmitting}
                    style={{
                    width: "100%",
                    maxWidth: "400px",
                    padding: "12px 14px",
                    border: "1px solid #cbd5e1",
                    borderRadius: "10px",
                    background: "#ffffff",
                    color: "#0f172a",
                    }}/>
            </div>

            <div style={{ display: "grid", gap: "6px" }}>
                <label htmlFor="bookGenre" style={{ fontWeight: 600 }}>
                    Genre
                </label>
                <input
                    id="bookGenre"
                    type="text"
                    value={bookGenre}
                    onChange={(e) => onGenreChange(e.target.value)}
                    disabled={isSubmitting}
                    style={{
                    width: "100%",
                    maxWidth: "400px",
                    padding: "12px 14px",
                    border: "1px solid #cbd5e1",
                    borderRadius: "10px",
                    background: "#ffffff",
                    color: "#0f172a",
                    }}/>
            </div>

            <div style={{ display: "grid", gap: "6px" }}>
                <label htmlFor="bookYear" style={{ fontWeight: 600 }}>
                    Year
                </label>
                <input
                    id="bookYear"
                    type="number"
                    value={bookYear}
                    onChange={(e) => onYearChange(e.target.value)}
                    disabled={isSubmitting}
                    style={{
                    width: "100%",
                    maxWidth: "400px",
                    padding: "12px 14px",
                    border: "1px solid #cbd5e1",
                    borderRadius: "10px",
                    background: "#ffffff",
                    color: "#0f172a",
                    }}/>
            </div>

            <div
                style={{
                    display: "grid",
                    gap: "6px",
                    gridColumn: "1 / -1",
                }}>
                <label htmlFor="bookDescription" style={{ fontWeight: 600 }}>
                    Description
                </label>
                <textarea
                    id="bookDescription"
                    value={bookDescription}
                    onChange={(e) => onDescriptionChange(e.target.value)}
                    disabled={isSubmitting}
                    rows={5}
                    style={{
                    width: "100%",
                    maxWidth: "600px",
                    padding: "12px 14px",
                    border: "1px solid #cbd5e1",
                    borderRadius: "10px",
                    background: "#ffffff",
                    color: "#0f172a",
                    resize: "vertical",
                    }}/>
            </div>
        </div>

            <button
                type="submit"
                disabled={isSubmitting}
                style={{
                border: "none",
                borderRadius: "10px",
                padding: "12px 16px",
                width: "100%",
                maxWidth: "150px",
                background: isSubmitting ? "#93c5fd" : "#2563eb",
                color: "#ffffff",
                fontWeight: 600,
                cursor: isSubmitting ? "not-allowed" : "pointer",
                }}>
                {isSubmitting ? "Adding..." : "Add Book"}
            </button>
        </form>
    </section>
  );
}