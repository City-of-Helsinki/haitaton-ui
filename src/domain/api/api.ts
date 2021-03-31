import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig, AxiosError } from 'axios';
import { LOCALSTORAGE_OIDC_KEY } from '../auth/constants';

const api: AxiosInstance = axios.create({
  baseURL: '/api',
});

export function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

api.defaults.headers.post['Content-Type'] = 'application/json';

api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const oidcStorage = localStorage.getItem(LOCALSTORAGE_OIDC_KEY);
    if (oidcStorage) {
      const token = JSON.parse(oidcStorage).access_token;
      // eslint-disable-next-line no-param-reassign
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

api.interceptors.response.use(
  // eslint-disable-next-line
  async (response: AxiosResponse): Promise<any> => {
    // await timeout(500);
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
      if (response.status >= 400 && response.status < 500) {
        // eslint-disable-next-line
        console.error(response.data?.data?.message);
        return Promise.reject(error);
      }
    } else if (request) {
      // eslint-disable-next-line
      // console.error('Request failed. Please try again.');
      return Promise.reject(new Error('Request failed. Please try again.'));
    }
    return Promise.reject(error);
  }
);

export default api;
