import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import apiClient from '../services/apiClient';

// UserRole is a union type — it can only ever be one of these three strings.
// Using a union type instead of plain string means TypeScript will catch typos
// like 'Admin' or 'admin' at compile time rather than silently passing wrong values.
export type UserRole = 'USER' | 'STAFF' | 'ADMIN';

// AuthUser describes the shape of the logged-in user object.
// This is what the backend returns from GET /users/me.
interface AuthUser {
    id: string;
    email: string;
    role: UserRole;
}

// AuthState describes the shape of the auth section of the Redux store.
// Every component that reads auth state will see exactly these fields.
interface AuthState {
    user: AuthUser | null;        // null when not logged in, populated after login or session restore
    token: string | null;         // the JWT access token used to authenticate API requests
    expiresAt: string | null;     // when the access token expires — returned by /auth/login and /auth/refresh
    restoringSession: boolean;    // true while restoreSession is in flight — used to block the router in App.tsx
}

// initialState is the starting value of auth state when the app first loads.
// Nothing is read from storage — the access token lives only in Redux state.
// restoringSession starts as true unconditionally because restoreSession always
// runs on startup now. It calls /auth/refresh to get a fresh token from the
// HttpOnly cookie rather than reading anything from localStorage.
const initialState: AuthState = {
    user: null,
    token: null,
    expiresAt: null,
    restoringSession: true,
};

// restoreSession is an async thunk that runs on every app startup (dispatched in App.tsx).
// Its job is to get a fresh access token using the HttpOnly refresh cookie, then
// load the user's profile.
//
// The first argument to createAsyncThunk is the action type prefix — Redux uses this
// to generate the three action types: 'auth/restoreSession/pending',
// 'auth/restoreSession/fulfilled', and 'auth/restoreSession/rejected'.
//
// The second argument is the async function that does the actual work.
// _ means we don't need any input argument for this thunk.
// { rejectWithValue } is a utility provided by Redux Toolkit that lets us return
// a controlled error payload from the rejected case instead of throwing.
export const restoreSession = createAsyncThunk(
    'auth/restoreSession',
    async (_, {rejectWithValue}) => {
        try {
            // Step 1 — call POST /auth/refresh. The browser automatically sends the
            // HttpOnly refresh token cookie with this request because apiClient has
            // withCredentials: true. The backend validates the cookie and returns a
            // new access token.
            const refreshResponse = await apiClient.post<{ token: string; expiresAt: string }>('/auth/refresh');

            // Step 2 — fetch the user's profile. The request interceptor in apiClient.ts
            // reads the token from Redux state, but the token is not in Redux yet at this
            // point. So we pass it manually in the Authorization header for this one call.
            const userResponse = await apiClient.get<AuthUser>('/users/me', {
                headers: { Authorization: `Bearer ${refreshResponse.data.token}` },
            });

            // Returning this object makes all three values available as action.payload
            // in the fulfilled case below.
            return {
                token: refreshResponse.data.token,
                expiresAt: refreshResponse.data.expiresAt,
                user: userResponse.data,
            };
        } catch {
            // If the refresh fails (no cookie, expired cookie, network error),
            // rejectWithValue sends this string as action.payload to the rejected case.
            return rejectWithValue('Session expired or invalid.');
        }
    }
);

// login is an async thunk that handles the login form submission.
// It takes the user's credentials as input, posts them to /auth/login,
// and on success returns the token and user data.
export const login = createAsyncThunk(
    'auth/login',
    async (credentials: { email: string; password: string }, {rejectWithValue}) => {
        try {
            // Post credentials to /auth/login. The backend returns { token, expiresAt }
            // in the body and sets the HttpOnly refresh token cookie automatically.
            // We never see or touch the refresh token.
            const response = await apiClient.post<{ token: string; expiresAt: string }>('/auth/login', credentials);

            // Fetch the user's profile now that we have a valid token.
            // Same manual header approach as in restoreSession — the Redux store
            // does not have the token yet at this point in the thunk.
            const userResponse = await apiClient.get<AuthUser>('/users/me', {
                headers: { Authorization: `Bearer ${response.data.token}` },
            });

            // Returning the token, expiry, and user makes all three available
            // as action.payload in the fulfilled case below.
            return {
                token: response.data.token,
                expiresAt: response.data.expiresAt,
                user: userResponse.data,
            };
        } catch (err: unknown) {
            // axios.isAxiosError is a built-in type guard that checks if the error
            // is an AxiosError. After this check TypeScript knows the full shape of
            // err, so we can access err.response?.data?.message directly without
            // manual type narrowing.
            if (axios.isAxiosError(err) && err.response?.data?.message) { // err.response can be undefined for Network Errors
                return rejectWithValue(err.response.data.message);
            }

            // If the backend didn't return a message (e.g. network failure), fall back
            // to a generic error message.
            return rejectWithValue('Login failed. Please try again.');
        }
    }
);

// logout is an async thunk because it needs to call POST /auth/logout first.
// This tells the backend to invalidate the refresh token cookie. Without this call,
// the cookie would remain valid until it naturally expires and anyone holding it
// could still get new access tokens.
// After the backend responds, Redux state is cleared regardless of success or failure —
// the user should always be logged out on the frontend even if the backend call fails.
export const logout = createAsyncThunk(
    'auth/logout',
    async () => {
        try {
            await apiClient.post('/auth/logout');
        } catch {
            // Ignore errors — we clear state regardless so the user is always logged out.
        }
    }
);

export const updateUserEmail = createAsyncThunk(
    'auth/updateUserEmail',
    async (payload: { email: string }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put<{ id: string; email: string; role: UserRole }>(
                '/users/me/email',
                payload
            );
            return response.data;
        } catch (err: unknown) {
            if (axios.isAxiosError(err) && err.response?.data?.message) {
                return rejectWithValue(err.response.data.message);
            }
            return rejectWithValue('Failed to update email. Please try again.');
        }
    }
);

export const updateUserPassword = createAsyncThunk(
    'auth/updateUserPassword',
    async (payload: { currentPassword: string; newPassword: string }, { rejectWithValue }) => {
        try {
            await apiClient.put('/users/me/password', payload);
        } catch (err: unknown) {
            if (axios.isAxiosError(err) && err.response?.data?.message) {
                return rejectWithValue(err.response.data.message);
            }
            return rejectWithValue('Failed to update password. Please try again.');
        }
    }
);

const authSlice = createSlice({
    name: 'auth', // this prefix is used in action type strings, e.g. 'auth/logout'
    initialState,

    // reducers handles synchronous actions — no API calls, just direct state updates.
    reducers: {
        // Dispatched by the Axios response interceptor in apiClient.ts when a 401
        // is handled mid-session and /auth/refresh returns a new token successfully.
        // Updates the token and expiresAt in the store so all future requests
        // from the interceptor use the latest token.
        tokenRefreshed(state, action: { payload: { token: string; expiresAt: string } }) {
            state.token = action.payload.token;
            state.expiresAt = action.payload.expiresAt;
        },

        // Dispatched by the Axios response interceptor when /auth/refresh fails
        // mid-session (cookie expired or revoked). Clears all auth state so the
        // router redirects the user to /login via ProtectedRoute.
        sessionExpired(state) {
            state.user = null;
            state.token = null;
            state.expiresAt = null;
        },
    },

    // extraReducers handles the outcomes of async thunks.
    // It is separate from reducers because the thunks (restoreSession, login, logout) are
    // defined outside the slice. builder.addCase wires each thunk phase to a
    // state update function.
    extraReducers: (builder) => {
        builder

            // --- restoreSession lifecycle ---

            // Fired the moment restoreSession is dispatched, before the API call completes.
            // Sets restoringSession: true so App.tsx shows a loading screen instead of rendering
            // routes while the session is being verified.
            .addCase(restoreSession.pending, (state) => {
                state.restoringSession = true;
            })

            // Fired when both /auth/refresh and /users/me respond successfully.
            // action.payload contains the token, expiresAt, and user returned by the thunk.
            // Populating state.user here means all components (Navbar, RoleRoute, etc.)
            // can now read the user's role and email from the store.
            .addCase(restoreSession.fulfilled, (state, action) => {
                state.restoringSession = false;
                state.token = action.payload.token;
                state.expiresAt = action.payload.expiresAt;
                state.user = action.payload.user;
            })

            // Fired when the refresh fails (no cookie, expired cookie, or network error).
            // restoringSession is set to false so the router renders — token stays null
            // so ProtectedRoute redirects the user to /login.
            .addCase(restoreSession.rejected, (state) => {
                state.restoringSession = false;
            })

            // --- login lifecycle ---

            // Fired when /auth/login and /users/me both respond successfully.
            // action.payload contains the token, expiresAt, and user returned by the thunk.
            .addCase(login.fulfilled, (state, action) => {
                state.token = action.payload.token;
                state.expiresAt = action.payload.expiresAt;
                state.user = action.payload.user;
            })

            // When email is updated successfully, reflect the new email in the store
            // so the navbar and any other consumers show the updated value immediately.
            .addCase(updateUserEmail.fulfilled, (state, action) => {
                if (state.user) {
                    state.user.email = action.payload.email;
                }
            })

            // --- logout lifecycle ---

            // addMatcher lets us handle both fulfilled and rejected with one handler.
            // We clear state regardless of whether the backend call succeeded —
            // the user is always logged out on the frontend.
            .addMatcher(
                (action) => action.type === logout.fulfilled.type || action.type === logout.rejected.type,
                (state) => {
                    state.user = null;
                    state.token = null;
                    state.expiresAt = null;
                }
            );
    },
});

// Export actions so they can be dispatched from components and apiClient.ts.
export const {tokenRefreshed, sessionExpired} = authSlice.actions;

// Export the reducer to be registered in store.ts under the 'auth' key.
export default authSlice.reducer;
