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
  withCredentials: true,
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
  withCredentials: true,
});

/**
 * Interceptor for handling responses and specific HTTP error statuses for user requests.
 * Redirects to login on 401 errors and logs various errors for debugging.
 */
userRequest.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(JSON.stringify(error), 'Handling response error scenarios');
    console.log(error);

    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data.message === 'jwt expired'
    ) {
      // Token has expired, redirect to login
      window.location.href = ROUTES.login;
    }
    if (error.response && error.response.status === 500) {
      console.log('Encountered a server error');
    }
    if (error.response && error.response.status === 403) {
      console.log('Received a forbidden request response');
    }
    return Promise.reject(error);
  }
);

/**
 * Applying axios-retry to automatically retry requests on encountering 500 server errors.
 * Separate retry configurations for userRequest, publicRequest, and userFileRequest.
 */
axiosRetry(userRequest, { retries: 3, retryDelay: () => 3000 });
axiosRetry(publicRequest, { retries: 3, retryDelay: () => 3000 });
