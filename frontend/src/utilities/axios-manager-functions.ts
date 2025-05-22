import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import axios, { AxiosError } from 'axios';

const axiosClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

const httpClient = axiosClient;

export const generateFinalUrl = async (path: string, apiUrl?: string): Promise<string> => {
  return Promise.resolve(apiUrl ? apiUrl + path : '');
};

const axiosResponseErrorHandler = async (error: AxiosError) => {
  return Promise.reject(error);
};

const getConnectionData = async (path: string, apiUrl?: string, obj?: AxiosRequestConfig) => {
  const url: string = await generateFinalUrl(path, apiUrl);
  const config: AxiosRequestConfig<any> = obj ?? {};
  return { url, config };
};

axiosClient?.interceptors.request.use(async (config) => {
  // Simulate an async operation
  await Promise.resolve();
  return config;
});

axiosClient?.interceptors.response.use(
  async (response: AxiosResponse) => {
    await Promise.resolve();
    return response;
  },
  async (error: AxiosError) => {
    await axiosResponseErrorHandler(error);
  },
);

export async function customGet<R = unknown>(
  path: string,
  config?: AxiosRequestConfig,
  apiUrl?: string,
): Promise<AxiosResponse<R>> {
  const setup = await getConnectionData(path, apiUrl, config);
  return httpClient.get(setup.url, {
    ...setup.config,
  });
}

export async function customPut<D = unknown, R = D>(
  path: string,
  data?: D,
  config?: AxiosRequestConfig,
  apiUrl?: string,
): Promise<AxiosResponse<R>> {
  const setup = await getConnectionData(path, apiUrl, config);
  return httpClient.put(setup.url, data, {
    ...setup.config,
  });
}

export async function customPost<D = unknown, R = D>(
  path: string,
  data?: D,
  config?: AxiosRequestConfig,
  apiUrl?: string,
): Promise<AxiosResponse<R>> {
  const setup = await getConnectionData(path, apiUrl, config);
  return httpClient.post(setup.url, data, {
    ...setup.config,
  });
}

export async function customDelete<R = unknown>(
  path: string,
  config?: AxiosRequestConfig,
  apiUrl?: string,
): Promise<AxiosResponse<R>> {
  const setup = await getConnectionData(path, apiUrl, config);
  return httpClient.delete(setup.url, {
    ...setup.config,
  });
}
