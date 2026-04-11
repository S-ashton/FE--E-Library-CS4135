import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../services/apiClient";
import axios from "axios";
import type { UserRole } from "./authSlice";

export type UserListItem = {
  id: number;
  email: string;
  role: UserRole;
  createdAt: string;
};

type UsersState = {
  users: UserListItem[];
  isLoading: boolean;
  isAddingUser: boolean;
  error: string | null;
};

const initialState: UsersState = {
  users: [],
  isLoading: false,
  isAddingUser: false,
  error: null,
};

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<UserListItem[]>("/users");
      return response.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        return rejectWithValue(err.response.data.message);
      }
      return rejectWithValue(
        "An error occurred while fetching users. Please try again."
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  "users/registerUser",
  async (
    userData: { email: string; password: string; role: UserRole },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.post("/auth/register", userData);
      return response.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const validationErrors = err.response?.data?.errors;

        if (
          Array.isArray(validationErrors) &&
          validationErrors.length > 0 &&
          validationErrors[0]?.message
        ) {
          return rejectWithValue(validationErrors[0].message);
        }

        if (err.response?.data?.message) {
          return rejectWithValue(err.response.data.message);
        }
      }

      return rejectWithValue("Registration failed. Please try again.");
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) ?? "Failed to fetch users.";
      })
      .addCase(registerUser.pending, (state) => {
        state.isAddingUser = true;
        state.error = null;
        })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isAddingUser = false;
        state.users.push(action.payload);
        })
      .addCase(registerUser.rejected, (state, action) => {
        state.isAddingUser = false;
        state.error = (action.payload as string) ?? "Failed to add user.";
        });
  },
});

export default usersSlice.reducer;