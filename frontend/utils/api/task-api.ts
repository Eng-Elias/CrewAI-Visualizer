import { createApiClient, handleApiError } from "@/utils/api/api-client";
import { Task, TaskFormData } from "@/utils/api/types";

/**
 * Get all tasks
 */
export const getTasks = async (
  includeTemplates: boolean = true,
  agentId?: number
): Promise<Task[]> => {
  try {
    const apiClient = await createApiClient();
    const params: Record<string, string | number | boolean> = {
      include_templates: includeTemplates,
    };

    if (agentId !== undefined) {
      params.agent_id = agentId;
    }

    const response = await apiClient.get(`/api/tasks`, { params });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get task templates
 */
export const getTaskTemplates = async (
  includeBuiltin: boolean = true
): Promise<Task[]> => {
  try {
    const apiClient = await createApiClient();
    const params = { include_builtin: includeBuiltin };
    const response = await apiClient.get(`/api/tasks/templates`, { params });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get a specific task by ID
 */
export const getTask = async (id: number): Promise<Task> => {
  try {
    const apiClient = await createApiClient();
    const response = await apiClient.get(`/api/tasks/${id}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Create a new task
 */
export const createTask = async (data: TaskFormData): Promise<Task> => {
  try {
    const apiClient = await createApiClient();
    const response = await apiClient.post("/api/tasks", data);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Update an existing task
 */
export const updateTask = async (
  id: number,
  data: Partial<TaskFormData>
): Promise<Task> => {
  try {
    const apiClient = await createApiClient();
    const response = await apiClient.put(`/api/tasks/${id}`, data);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Delete a task
 */
export const deleteTask = async (id: number): Promise<void> => {
  try {
    const apiClient = await createApiClient();
    await apiClient.delete(`/api/tasks/${id}`);
  } catch (error) {
    return handleApiError(error);
  }
};
