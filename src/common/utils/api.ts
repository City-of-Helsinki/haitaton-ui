import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8080/backend/api',
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
        alert(response.data?.data?.message);
        return null;
      }
    } else if (request) {
      // eslint-disable-next-line
      alert('Request failed. Please try again.');
      return null;
    }
    return Promise.reject(error);
  }
);

export default api;

/*
import axios, { AxiosResponse } from 'axios';
import { AuthTokens } from '../../../auth/auth-context';

const apiBaseUrl: string = window.ENV?.API_URL || 'http://localhost:8000';

const resourceBasePath = '/resource';
const authRequiredTest = '/auth_required_test';

interface RequestParameters {
  [key: string]:
    | string
    | number
    | boolean
    | ReadonlyArray<string>
    | ReadonlyArray<number>
    | ReadonlyArray<boolean>
    | undefined
    | null;
}

interface GetParameters {
  path: string;
  headers?: { [key: string]: string };
  parameters?: RequestParameters;
}

enum ApiResponseFormat {
  json = 'json',
}

interface ApiParameters extends RequestParameters {
  format: ApiResponseFormat;
}

async function apiGet<T>({
  path,
  headers = {},
  parameters = {},
}: GetParameters): Promise<T> {
  const apiParameters: ApiParameters = {
    ...parameters,
    format: ApiResponseFormat.json,
  };

  try {
    const response: AxiosResponse<T> = await axios.request<T, AxiosResponse<T>>(
      {
        url: `${apiBaseUrl}/v1${path}`,
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        method: 'get',
        params: apiParameters,
      }
    );
    return response.data;
  } catch (error) {
    const errorMessage: string | undefined = error.response?.data?.detail;
    if (errorMessage) {
      throw new Error(errorMessage);
    } else {
      throw new Error(error);
    }
  }
}

export interface Resource {
  id: string;
  name: {
    fi: string;
    sv: string;
    en: string;
  };
  description: {
    fi: string;
    sv: string;
    en: string;
  };
  address: {
    fi: string;
    sv: string;
    en: string;
  };
  extra_data: {
    citizen_url: string;
    admin_url: string;
  };
}

interface AuthTestResponse {
  message: string;
  username: string;
}

export default {
  getResource: (id: string): Promise<Resource> =>
    apiGet<Resource>({ path: `${resourceBasePath}/${id}` }),

  testAuthCredentials: (authTokens: AuthTokens): Promise<AuthTestResponse> => {
    const { signature, ...restOfTokens } = authTokens;

    return apiGet<AuthTestResponse>({
      path: `${authRequiredTest}`,
      headers: {
        Authorization: `haukisigned signature=${signature}`,
      },
      parameters: { ...restOfTokens },
    });
  },
};
*/
