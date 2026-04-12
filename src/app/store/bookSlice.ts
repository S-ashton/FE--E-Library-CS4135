import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Book } from "../types/book";
import type { BookDTO } from "../types/book";
import { toBook } from "../types/book";
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

export const getAvailableCopy = createAsyncThunk(
  "books/getAvailableCopy",
  async (bookId: number, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/books/getAvailableCopy", {
        params: { bookId },
      });
      return response.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        return rejectWithValue(err.response.data.message);
      }
      return rejectWithValue("Failed to get available copy.");
    }
  }
);

type BooksState = {
  books: Book[];
  isLoadingBooks: boolean;
  isAddingBook: boolean;
  isSearchingBooks: boolean;
  booksError: string | null;
};

const initialState: BooksState = {
  books: [],
  isLoadingBooks: false,
  isAddingBook: false,
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
      });
  },
});

export default booksSlice.reducer;
