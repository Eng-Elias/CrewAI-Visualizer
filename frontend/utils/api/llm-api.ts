import { createApiClient, handleApiError } from './api-client';
import { LLM, LLMFormData } from './types';

/**
 * Get all LLMs
 */
export const getLLMs = async (): Promise<LLM[]> => {
  try {
    const apiClient = await createApiClient();
    const response = await apiClient.get('/api/llms');
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get a specific LLM by ID
 */
export const getLLM = async (id: number): Promise<LLM> => {
  try {
    const apiClient = await createApiClient();
    const response = await apiClient.get(`/api/llms/${id}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Create a new LLM
 */
export const createLLM = async (data: LLMFormData): Promise<LLM> => {
  try {
    const apiClient = await createApiClient();
    const response = await apiClient.post('/api/llms', data);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Update an existing LLM
 */
export const updateLLM = async (
  id: number,
  data: Partial<LLMFormData>
): Promise<LLM> => {
  try {
    const apiClient = await createApiClient();
    const response = await apiClient.put(`/api/llms/${id}`, data);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Delete an LLM
 */
export const deleteLLM = async (id: number): Promise<void> => {
  try {
    const apiClient = await createApiClient();
    await apiClient.delete(`/api/llms/${id}`);
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * Get available LLM providers
 */
export const getLLMProviders = async (): Promise<Record<string, string>> => {
  try {
    const apiClient = await createApiClient();
    const response = await apiClient.get('/api/llms/providers');
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};
