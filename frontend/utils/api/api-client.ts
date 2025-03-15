import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { getSession } from "@/lib/supabase/client";

// Default API URL for local development
const API_URL = process.env.BACKEND_URL || "http://localhost:8000";

/**
 * Creates an axios instance with authentication headers
 */
export const createApiClient = async (): Promise<AxiosInstance> => {
  const session = await getSession();
  
  if (!session) {
    throw new Error("No active session");
  }

  const config: AxiosRequestConfig = {
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
  };

  return axios.create(config);
};

/**
 * Base API error class
 */
export class ApiError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/**
 * Handle API errors consistently
 */
export const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    const status = axiosError.response?.status || 500;
    const message = 
      axiosError.response?.data && typeof axiosError.response.data === 'object' && 'detail' in axiosError.response.data
        ? String(axiosError.response.data.detail)
        : axiosError.message || 'An unknown error occurred';
    throw new ApiError(message, status);
  }
  throw error;
};
