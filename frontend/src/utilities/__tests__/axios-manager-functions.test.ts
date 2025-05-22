import axios, { AxiosRequestConfig } from 'axios';
import { apiURL, GET_MOVIES } from 'services/movie';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { customDelete, customGet, customPost, customPut, generateFinalUrl } from '../';

vi.mock('utilities', () => ({
  customGet: vi.fn(),
}));

vi.mock('axios', () => {
  return {
    default: {
      post: vi.fn(),
      get: vi.fn(),
      delete: vi.fn(),
      put: vi.fn(),
      create: vi.fn().mockReturnThis(),
      interceptors: {
        request: {
          use: vi.fn(),
          eject: vi.fn(),
        },
        response: {
          use: vi.fn(),
          eject: vi.fn(),
        },
      },
    },
  };
});

describe('axiosManager', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const path = GET_MOVIES;
  const apiUrl = apiURL;
  const config: AxiosRequestConfig = { headers: { 'Content-Type': 'application/json' } };
  const responseMock = { data: { message: 'Success' } };

  it('should make a GET request using customGet', async () => {
    axios.get = vi.fn().mockResolvedValue(responseMock);
    const result = await customGet(path, config, apiUrl);
    expect(result).toEqual(responseMock);
  });

  it('should make a PUT request using customPut', async () => {
    axios.put = vi.fn().mockResolvedValue(responseMock);
    const data = { name: 'Put request' };
    const result = await customPut(path, data, config, apiUrl);
    expect(result).toEqual(responseMock);
  });

  it('should make a POST request using customPost', async () => {
    axios.post = vi.fn().mockResolvedValue(responseMock);
    const data = { name: 'Post request' };
    const result = await customPost(path, data, config, apiUrl);
    expect(result).toEqual(responseMock);
  });

  it('should make a DELETE request using customDelete', async () => {
    axios.delete = vi.fn().mockResolvedValue(responseMock);
    const result = await customDelete(path, config, apiUrl);
    expect(result).toEqual(responseMock);
  });

  it('should generate the final URL', async () => {
    const result = await generateFinalUrl(path, apiUrl);
    expect(result).toEqual(`${apiUrl}${path}`);
  });
});
