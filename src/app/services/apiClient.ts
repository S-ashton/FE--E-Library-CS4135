import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';
import config from '../config/config';
import type { AppStore } from '../store/store';

const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  //headers: {
  //  'Content-Type': 'application/json',
  //},
  // withCredentials: true tells the browser to include cookies on every request.
  // This is required for the HttpOnly refresh token cookie to be sent automatically
  // when calling /auth/refresh. Without this, the browser silently strips the cookie.
  withCredentials: true,
});

// store is set once via injectStore, which is called in main.tsx after the store
// is created. It is not imported at the top level because that would create a
// circular dependency:
//   store.ts → authSlice.ts → apiClient.ts → store.ts
// By receiving the store as an argument instead, apiClient.ts never imports store.ts
// as a value — only as a type, which is erased at compile time.
let store: AppStore;

export const injectStore = (_store: AppStore) => {
  store = _store;
};

// --- Request interceptor ---
// Reads the access token from Redux state and attaches it to every outgoing request.
apiClient.interceptors.request.use((requestConfig) => {
  const token = store.getState().auth.token;

  if (token) {
    requestConfig.headers.Authorization = `Bearer ${token}`;
  }

  return requestConfig;
});

// --- Response interceptor ---
// Handles 401 Unauthorized responses by attempting to refresh the access token.
// If the refresh succeeds, the original failed request is retried automatically.
// If the refresh fails, all pending requests are rejected and auth state is cleared
// so ProtectedRoute redirects the user to /login.
//
// isRefreshing prevents multiple simultaneous refresh calls.
// If several requests fail with 401 at the same time, only one refresh call is made.
// The rest are held in pendingQueue and retried once the refresh completes.
let isRefreshing = false;
let pendingQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

const resolveQueue = (token: string) => {
  pendingQueue.forEach(({ resolve }) => resolve(token));
  pendingQueue = [];
};

const rejectQueue = (err: unknown) => {
  pendingQueue.forEach(({ reject }) => reject(err));
  pendingQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest: AxiosRequestConfig & { _retry?: boolean } = error.config;
    const isRefreshRequest = originalRequest?.url?.includes('/auth/refresh');
    const isLoginRequest = originalRequest?.url?.includes('/auth/login');

    // Only attempt a token refresh for 401s that are:
    // - not from the refresh endpoint itself (that means the cookie is gone/expired)
    // - not from the login endpoint (wrong credentials, not an expired token)
    // - not already a retry (prevents an infinite loop if the retried request also 401s)
    if (error.response?.status === 401 && !isRefreshRequest && !isLoginRequest && !originalRequest._retry) {

      if (isRefreshing) {
        // A refresh is already in flight — queue this request and wait.
        // When the refresh completes, resolveQueue will retry it with the new token.
        return new Promise((resolve, reject) => {
          pendingQueue.push({
            resolve: (token: string) => {
              originalRequest.headers = {
                ...originalRequest.headers,
                Authorization: `Bearer ${token}`,
              };
              resolve(apiClient(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call /auth/refresh — the browser sends the HttpOnly cookie automatically.
        const refreshResponse = await apiClient.post<{ token: string; expiresAt: string }>('/auth/refresh');
        const newToken = refreshResponse.data.token;

        // Update the token in Redux so the request interceptor uses it going forward.
        // We dispatch raw action objects here instead of importing action creators
        // from authSlice.ts, which would create a circular dependency.
        store.dispatch({
          type: 'auth/tokenRefreshed',
          payload: { token: newToken, expiresAt: refreshResponse.data.expiresAt },
        });

        // Retry all requests that were queued while the refresh was in flight.
        resolveQueue(newToken);

        // Retry the original request that triggered the 401.
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newToken}`,
        };
        return apiClient(originalRequest);

      } catch (refreshError) {
        // Refresh failed — the cookie is gone or expired.
        // Reject all queued requests and clear auth state.
        // ProtectedRoute will redirect to /login once token is null in Redux.
        rejectQueue(refreshError);
        store.dispatch({ type: 'auth/sessionExpired' });
        return Promise.reject(refreshError);

      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
