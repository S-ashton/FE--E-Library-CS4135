import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Book, BookCopyDTO, BookDTO } from "../types/book";
import { toBook } from "../types/book";
import type { RootState } from "./store";
import type { BookSearchFilters } from "../types/bookSearch";
import { buildBookSearchRequestParams } from "../utils/buildBookSearchRequestParams";
import { normalizeBookSearchPayload } from "../utils/normalizeBookSearchPayload";
import apiClient from "../services/apiClient";
import axios from "axios";

export const addBookToLibrary = createAsyncThunk(
  "books/addBookToLibrary",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/books/addTitle", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        return rejectWithValue(err.response.data.message);
      }
      return rejectWithValue("An error occurred while adding the book.");
    }
  }
);

export const getBookDetails = createAsyncThunk(
  "books/getBookDetails",
  async (bookId: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/books/${bookId}`);
      return response.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        return rejectWithValue(err.response.data.message);
      }
      return rejectWithValue("An error occured while fetching the book details.");
    }
  }
);

export const getBookTitlesByIds = createAsyncThunk(
  "books/getBookTitlesByIds",
  async (bookIds: number[], { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/books/titlesByIds/${bookIds}`);
      return response.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        return rejectWithValue(err.response.data.message);
      }
      return rejectWithValue("An error occured while fetching the book titles.");
    }
  }
);

export const fetchBooks = createAsyncThunk(
  "books/fetchBooks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/books/search");
      return normalizeBookSearchPayload(response.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        return rejectWithValue(err.response.data.message);
      }
      return rejectWithValue("An error occurred while fetching books.");
    }
  }
);

export const searchBooks = createAsyncThunk(
  "books/searchBooks",
  async (filters: BookSearchFilters, { rejectWithValue }) => {
    try {
      const params = buildBookSearchRequestParams(filters);
      const response = await apiClient.get("/books/search", { params });
      return normalizeBookSearchPayload(response.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        return rejectWithValue(err.response.data.message);
      }
      return rejectWithValue("An error occured while searching for books.");
    }
  }
);

export const getAvailableCopy = createAsyncThunk<
  BookCopyDTO,
  number,
  { rejectValue: string }
>("books/getAvailableCopy", async (bookId, { rejectWithValue }) => {
  try {
    const response = await apiClient.get<BookCopyDTO>("/books/getAvailableCopy", {
      params: { bookId },
    });
    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response?.data?.message) {
      return rejectWithValue(String(err.response.data.message));
    }
    return rejectWithValue("Failed to get available copy.");
  }
});

export type BookCopyStatus = "AVAILABLE" | "ON_LOAN" | "UNAVAILABLE";

export const changeBookCopyStatus = createAsyncThunk<
  BookCopyDTO,
  { copyId: number; status: BookCopyStatus },
  { rejectValue: string; state: RootState }
>("books/changeBookCopyStatus", async ({ copyId, status }, { getState, rejectWithValue }) => {
  const userId = getState().auth.user?.id;
  if (!userId) {
    return rejectWithValue("Not signed in.");
  }
  try {
    const response = await apiClient.put<BookCopyDTO>(
      "/books/changeStatus",
      copyId,
      {
        params: { status },
        headers: {
          "Content-Type": "application/json",
          "X-Authenticated-User-Id": userId,
        },
        transformRequest: [(data: unknown) => JSON.stringify(data)],
      }
    );
    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response?.data?.message) {
      return rejectWithValue(String(err.response.data.message));
    }
    return rejectWithValue("Could not update book copy status.");
  }
});

export const addBookCopy = createAsyncThunk<
  BookCopyDTO | { status: string; bookId: number },
  number,
  { rejectValue: string; state: RootState }
>("books/addBookCopy", async (titleId, { getState, rejectWithValue }) => {
  const userId = getState().auth.user?.id;
  if (!userId) {
    return rejectWithValue("Not signed in.");
  }
  try {
    const response = await apiClient.post<BookCopyDTO | { status: string; bookId: number }>(
      "/books/addCopy",
      titleId,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Authenticated-User-Id": userId,
        },
      }
    );
    return response.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response?.data?.message) {
      return rejectWithValue(String(err.response.data.message));
    }
    return rejectWithValue("Could not add a copy.");
  }
});

type BooksState = {
  books: Book[];
  isLoadingBooks: boolean;
  isAddingBook: boolean;
  isAddingCopy: boolean;
  isSearchingBooks: boolean;
  booksError: string | null;
};

const initialState: BooksState = {
  books: [],
  isLoadingBooks: false,
  isAddingBook: false,
  isAddingCopy: false,
  isSearchingBooks: false,
  booksError: null,
};

const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.isLoadingBooks = true;
        state.booksError = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.isLoadingBooks = false;
        state.books = action.payload.map(toBook);
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.isLoadingBooks = false;
        state.booksError =
          (action.payload as string) ?? "Failed to fetch books.";
      })

      .addCase(addBookToLibrary.pending, (state) => {
        state.isAddingBook = true;
        state.booksError = null;
      })
      .addCase(addBookToLibrary.fulfilled, (state, action) => {
        state.isAddingBook = false;
        state.books.push(toBook(action.payload as BookDTO));
      })
      .addCase(addBookToLibrary.rejected, (state, action) => {
        state.isAddingBook = false;
        state.booksError =
          (action.payload as string) ?? "Failed to add book.";
      })

      .addCase(searchBooks.pending, (state) => {
        state.isSearchingBooks = true;
        state.booksError = null;
      })
      .addCase(searchBooks.fulfilled, (state, action) => {
        state.isSearchingBooks = false;
        state.books = action.payload.map(toBook);
      })
      .addCase(searchBooks.rejected, (state, action) => {
        state.isSearchingBooks = false;
        state.booksError =
          (action.payload as string) ?? "Failed to search books.";
      })

      .addCase(addBookCopy.pending, (state) => {
        state.isAddingCopy = true;
        state.booksError = null;
      })
      .addCase(addBookCopy.fulfilled, (state) => {
        state.isAddingCopy = false;
      })
      .addCase(addBookCopy.rejected, (state, action) => {
        state.isAddingCopy = false;
        state.booksError =
          (action.payload as string) ?? "Failed to add copy.";
      });
  },
});

export default booksSlice.reducer;
