// Importing necessary libraries for HTTP requests and error handling.
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { ROUTES } from './routes';

// Custom hooks and utility functions

// import { logger } from './logger';

// Base URL for all HTTP requests, sourced from environment variables for flexibility.
const BASE_URL = import.meta.env.VITE_APP_BASE_URL;

/**
 * Axios instance for making public (non-authenticated) requests.
 * It includes a base URL and default headers.
 */
export const publicRequest = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Axios instance for making requests on behalf of an authenticated user.
 * It includes a base URL and default headers.
 */
export const userRequest = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor for user requests to add authentication token and device information to the request headers.
 */
userRequest.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
/**
 * Interceptor for handling responses and specific HTTP error statuses for user requests.
 * Redirects to login on 401 errors and logs various errors for debugging.
 */
userRequest.interceptors.response.use(
  (response) => response,
  (error) => {
    // Logging errors for debugging and operational insights.
    console.log(JSON.stringify(error), 'Handling response error scenarios');
    console.log(error);
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data.message === 'jwt expired'
    ) {
      // Clearing local storage and redirecting to login on token expiration for security.
      localStorage.clear();
      window.location.href = ROUTES.login;
    }
    if (error.response && error.response.status === 500) {
      // Logging server errors for further investigation.
      console.log('Encountered a server error');
    }
    if (error.response && error.response.status === 403) {
      // Notifying about forbidden requests, possibly due to insufficient permissions.
      console.log('Received a forbidden request response');
    }
    return Promise.reject(error); // Re-throwing error for custom handling by calling code.
  }
);

/**
 * Axios instance for user file upload requests, setting the content type to handle multipart form data.
 */
export const userFileRequest = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-type': 'multipart/form-data',
  },
});
userFileRequest.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
/**
 * Applying axios-retry to automatically retry requests on encountering 500 server errors.
 * Separate retry configurations for userRequest, publicRequest, and userFileRequest.
 */
axiosRetry(userRequest, { retries: 3, retryDelay: () => 3000 });
axiosRetry(publicRequest, { retries: 3, retryDelay: () => 3000 });
axiosRetry(userFileRequest, { retries: 3, retryDelay: () => 1000 });
