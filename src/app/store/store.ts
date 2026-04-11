import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import loanReducer from './loanSlice';
import usersReducer from './usersSlice';
import bookReducer from './bookSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    loans: loanReducer,
    users: usersReducer,
    books: bookReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
