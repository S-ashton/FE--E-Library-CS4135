import { Book } from "../../../types/book";

type BookDetailsCardProps = {
    book: Book
    onClose: () => void
    onBorrow: (book: Book) => void
    error?: string | null 
    isSubmitting?: boolean
};

export default function BookDetailsCard({
    book,
    onClose,
    onBorrow,
    error,
    isSubmitting = false,
}: BookDetailsCardProps) {
    return (
        <div style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.45)",
        display: "grid",
        placeItems: "center",
        padding: "24px",
        zIndex: 1000,
      }}>
        <section
            style={{
                background: "#ffffff",  
                border: "1px solid #e5e7eb",
                borderRadius: "16px",
                boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
                padding: "24px",
                maxWidth: "500px",
                width: "100%",
            }}
        >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ margin: 0, fontSize: "1.4rem", color: "#0f172a" }}>{book.title}</h2>
                <button
                    type="button"
                    onClick={onClose}   
                    style={{
                        border: "none",
                        background: "transparent",
                        fontSize: "1.2rem",
                        cursor: "pointer",  
                    }}
                >
                    &times;
                </button>
            </div>
            <p style={{ margin: "12px 0", color: "#475569" }}>
                <strong>Author:</strong> {book.author}
            </p>        
            <p style={{ margin: "12px 0", color: "#475569" }}>
                <strong>Genre:</strong> {book.category}
            </p>
            <p style={{ margin: "12px 0", color: "#475569" }}>
                <strong>Year:</strong> {book.year}
            </p>
            <p style={{ margin: "12px 0", color: "#475569" }}>
                {book.description ?? "No description available."}
            </p>

            {error && (
                <p style={{ margin: "12px 0", color: "#dc2626" }}>
                    {error}
                </p>
            )}  
            <button
                type="button"
                onClick={() => onBorrow(book)}  
                disabled={isSubmitting} 
                style={{
                    border: "none",
                    borderRadius: "10px",
                    padding: "10px 14px",   
                    background: "#2563eb",
                    color: "#ffffff",
                    fontWeight: 600,
                    cursor: "pointer",
                    marginTop: "16px",
                }}
            >
                {isSubmitting ? "Borrowing..." : "Borrow Book"}
            </button>
        </section>
        </div>
    );
}