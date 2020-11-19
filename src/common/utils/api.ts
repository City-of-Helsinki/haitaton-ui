import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: '/backend',
});

api.defaults.headers.post['Content-Type'] = 'application/json';

api.interceptors.response.use(
  // eslint-disable-next-line
  async (response: AxiosResponse): Promise<any> => {
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    }
    return null;
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
        return null;
      }
    } else if (request) {
      // eslint-disable-next-line
      console.error('Request failed. Please try again.');
      return null;
    }
    return Promise.reject(error);
  }
);

export default api;
