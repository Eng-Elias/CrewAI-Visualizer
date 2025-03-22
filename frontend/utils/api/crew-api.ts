import { Crew, CreateCrewRequest, UpdateCrewRequest } from "@/utils/api/types";
import { createApiClient } from "./api-client";

/**
 * Get all crews
 */
export const getCrews = async (): Promise<Crew[]> => {
  try {
    const apiClient = await createApiClient();
    const response = await apiClient.get<Crew[]>("/api/crews");
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get crew templates
 */
export const getCrewTemplates = async (): Promise<Crew[]> => {
  try {
    const apiClient = await createApiClient();
    const response = await apiClient.get<Crew[]>(`/api/crews/templates`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get a specific crew by ID
 */
export const getCrew = async (id: number): Promise<Crew> => {
  try {
    const apiClient = await createApiClient();
    const response = await apiClient.get<Crew>(`/api/crews/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Create a new crew
 */
export const createCrew = async (data: CreateCrewRequest): Promise<Crew> => {
  try {
    const apiClient = await createApiClient();
    const response = await apiClient.post<Crew>("/api/crews", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update an existing crew
 */
export const updateCrew = async (
  id: number,
  data: UpdateCrewRequest
): Promise<Crew> => {
  try {
    const apiClient = await createApiClient();
    const response = await apiClient.put<Crew>(`/api/crews/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a crew
 */
export const deleteCrew = async (id: number): Promise<void> => {
  try {
    const apiClient = await createApiClient();
    await apiClient.delete(`/api/crews/${id}`);
  } catch (error) {
    throw error;
  }
};

/**
 * Create a crew from a template
 */
export const createCrewFromTemplate = async (templateId: number): Promise<Crew> => {
  try {
    const apiClient = await createApiClient();
    const response = await apiClient.post<Crew>(`/api/crews/from-template/${templateId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
