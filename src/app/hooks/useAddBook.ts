import { useState } from "react";
import type { FormEvent } from "react";
import { AddBookInput } from "./useManageBooks";

type UseAddBookParams = {
  onAddBook: (book: AddBookInput) => Promise<void> | void;
};

export function useAddBook({ onAddBook }: UseAddBookParams) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [year, setYear] = useState("");
  const [language, setLanguage] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (
      !title.trim() ||
      !author.trim() ||
      !category.trim() ||
      !year.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    const parsedYear = Number(year);

    if (Number.isNaN(parsedYear)) {
      setError("Year must be a valid number.");
      return;
    }

    if (parsedYear < 1000 || parsedYear > 2026) {
      setError("Year must be between 1000 and 2026.");
      return;
    }

    setIsSubmitting(true);

    try {
      await onAddBook({
        title: title.trim(),
        author: author.trim(),
        description: description.trim(),
        category: category.trim().toUpperCase(),
        yearPublished: parsedYear,
        language: language.trim().toUpperCase(),
        coverImage: coverImage,
        status: "Available",
      });

      setTitle("");
      setAuthor("");
      setDescription("");
      setCategory("");
      setYear("");
      setLanguage("");
      setCoverImage(null);
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
    language,
    coverImage,
    error,
    isSubmitting,
    setTitle,
    setAuthor,
    setDescription,
    setCategory,
    setYear,
    setLanguage,
    setCoverImage,
    handleSubmit,
  };
}