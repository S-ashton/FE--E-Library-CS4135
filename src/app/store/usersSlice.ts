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

export const deleteUserAdminAction = createAsyncThunk(
  "users/deleteUserAdminAction",
  async (userId: number, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/users/${userId}`);
      // Return the ID so the fulfilled case can remove the user from state.
      return userId;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        return rejectWithValue(err.response.data.message);
      }
      return rejectWithValue("Failed to delete user. Please try again.");
    }
  }
);

export const updateUserRoleAdminAction = createAsyncThunk(
  "users/updateUserRoleAdminAction",
  async (
    payload: { userId: number; role: UserRole },
    { rejectWithValue }
  ) => {
    try {
      await apiClient.put(`/users/${payload.userId}/role`, {
        role: payload.role,
      });
      // Return the payload so the fulfilled case can update the user in state.
      return payload;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        return rejectWithValue(err.response.data.message);
      }
      return rejectWithValue("Failed to update user role. Please try again.");
    }
  }
);

export const updateUserEmailAdminAction = createAsyncThunk(
  "users/updateUserEmailAdminAction",
  async (
    payload: { userId: number; email: string },
    { rejectWithValue }
  ) => {
    try {
      await apiClient.put(`/users/${payload.userId}/email`, {
        email: payload.email,
      });
      // Return the payload so the fulfilled case can update the user in state.
      return payload;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        return rejectWithValue(err.response.data.message);
      }
      return rejectWithValue("Failed to update user email. Please try again.");
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
        })

      // Remove the deleted user from the array so the table updates immediately.
      .addCase(deleteUserAdminAction.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u.id !== action.payload);
      })

      // Update the user's role in the array so the table reflects the change.
      .addCase(updateUserRoleAdminAction.fulfilled, (state, action) => {
        const user = state.users.find((u) => u.id === action.payload.userId);
        if (user) {
          user.role = action.payload.role;
        }
      })

      // Update the user's email in the array so the table reflects the change.
      .addCase(updateUserEmailAdminAction.fulfilled, (state, action) => {
        const user = state.users.find((u) => u.id === action.payload.userId);
        if (user) {
          user.email = action.payload.email;
        }
      });
  },
});

export default usersSlice.reducer;