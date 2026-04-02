import BookTable from "../../components/ui/BookTable/BookTable"; 
import DeleteCheck from "../../components/ui/deleteCheck/deleteCheck";
import { useDeleteBook } from "../../hooks/useDeleteBooks"; 
import { useManageBooks } from "../../hooks/useManageBooks";

export default function ManagePage() {
  const { books, deleteBook } = useManageBooks();

  const {
    bookToDelete,
    requestDelete,
    cancelDelete,
    confirmDelete,
  } = useDeleteBook({
    onDelete: deleteBook,
  });

  return (
    <div
      style={{
        display: "grid",
        gap: "24px",
      }}
    >
      <section
        style={{
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
          padding: "24px",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "2rem",
            color: "#0f172a",
          }}
        >
          Manage Library
        </h1>

        <p
          style={{
            margin: "12px 0 0",
            color: "#475569",
            maxWidth: "720px",
          }}
        >
          Manage Library Catalogue.
        </p>
      </section>

      <section>
        <BookTable
          title="Library Catalogue"
          books={books}
          mode="admin"
          onDeleteBook={requestDelete}
        />
      </section>

      {bookToDelete && (
        <DeleteCheck
          bookTitle={bookToDelete.title}
          onCancel={cancelDelete}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}