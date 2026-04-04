import { useState } from "react";
import type { FormEvent } from "react";
import type { Book } from "../types/book";

type UseAddBookParams = {
  onAddBook: (book: Omit<Book, "id">) => void;
};

export function useAddBook({ onAddBook }: UseAddBookParams) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [year, setYear] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !author.trim() || !category.trim() || !year.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    const parsedYear = Number(year);

    if (Number.isNaN(parsedYear)) {
      setError("Year must be a valid number.");
      return;
    }

    setIsSubmitting(true);

    try {
      onAddBook({
        title: title.trim(),
        author: author.trim(),
        description: description.trim(),
        category: category.trim(),
        year: parsedYear,
        status: "Available",
      });

      setTitle("");
      setAuthor("");
      setDescription("");
      setCategory("");
      setYear("");
    } catch {
      setError("Failed to add book.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    title,
    author,
    description,
    category,
    year,
    error,
    isSubmitting,
    setTitle,
    setAuthor,
    setDescription,
    setCategory,
    setYear,
    handleSubmit,
  };
}