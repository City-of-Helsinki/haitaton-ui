import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getApiTokenFromStorage } from 'hds-react';
import { publicEndpoints } from './publicEndpoints';

// Session termination error codes that should trigger logout
const SESSION_TERMINATION_ERROR_CODES = new Set(['HAI0006', 'HAI4008']);

// Global logout handler that can be set by the app
let logoutHandler: (() => void) | null = null;

// Function to set the logout handler
export function setLogoutHandler(handler: (() => void) | null) {
  logoutHandler = handler;
}

// Function to handle session termination
function handleSessionTermination() {
  if (logoutHandler) {
    logoutHandler();
  } else if (globalThis.window !== undefined) {
    // Fallback: redirect to log out path
    globalThis.window.location.href = '/logout';
  }
}

const api: AxiosInstance = axios.create({
  baseURL: '/api',
});

api.defaults.headers.post['Content-Type'] = 'application/json';

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (
      (config.url && publicEndpoints.includes(config.url)) ||
      config.url?.startsWith('/public-hankkeet/')
    ) {
      return config;
    }
    const token = getApiTokenFromStorage(window._env_.REACT_APP_OIDC_AUDIENCE_BACKEND);
    if (config.headers && token) {
      // eslint-disable-next-line no-param-reassign
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    }
    return Promise.reject(new Error('No token'));
  },
  (error: AxiosError) => Promise.reject(error),
);

api.interceptors.response.use(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async (response: AxiosResponse): Promise<any> => {
    if (response.status >= 200 && response.status < 300) {
      return response;
    }
    return Promise.reject(new Error('Status error'));
  },
  (error: AxiosError) => {
    const {
      response,
      request,
    }: {
      response?: AxiosResponse;
      request?: XMLHttpRequest;
    } = error;
    if (response) {
      // Check for session termination error codes
      if (response.status === 401 && response.data?.errorCode) {
        const errorCode = response.data.errorCode;
        if (SESSION_TERMINATION_ERROR_CODES.has(errorCode)) {
          console.warn(`Session terminated with error code: ${errorCode}. Logging out...`);
          handleSessionTermination();
          return Promise.reject(error);
        }
      }

      if (response.status >= 400 && response.status < 500) {
        console.error(response.data?.data?.message);
        return Promise.reject(error);
      }
    } else if (request) {
      return Promise.reject(new Error('Request failed. Please try again.'));
    }
    return Promise.reject(error);
  },
);

export default api;
