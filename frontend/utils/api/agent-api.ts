import { createApiClient, handleApiError } from "./api-client";
import { Agent, AgentFormData } from "./types";

/**
 * Get all agents
 */
export const getAgents = async (
  includeTemplates: boolean = true
): Promise<Agent[]> => {
  try {
    const apiClient = await createApiClient();
    const response = await apiClient.get(`/api/agents`, {
      params: { include_templates: includeTemplates },
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get agent templates
 */
export const getAgentTemplates = async (
  includeBuiltin: boolean = true
): Promise<Agent[]> => {
  try {
    const apiClient = await createApiClient();
    const response = await apiClient.get(`/api/agents/templates`, {
      params: { include_builtin: includeBuiltin },
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get a specific agent by ID
 */
export const getAgent = async (id: number): Promise<Agent> => {
  try {
    const apiClient = await createApiClient();
    const response = await apiClient.get(`/api/agents/${id}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Create a new agent
 */
export const createAgent = async (data: AgentFormData): Promise<Agent> => {
  try {
    // Set is_template to true by default for agent templates
    const agentData = {
      ...data,
      is_template: true,
      tools: data.tools || {},
      llm_config: data.llm_config || {},
    };

    // No need to delete is_builtin as it's not in the AgentFormData type anymore

    console.log("Creating agent with data:", agentData);

    const apiClient = await createApiClient();
    const response = await apiClient.post("/api/agents", agentData);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Update an existing agent
 */
export const updateAgent = async (
  id: number,
  data: Partial<AgentFormData>
): Promise<Agent> => {
  try {
    // Set is_template to true by default for agent templates
    const agentData = {
      ...data,
      is_template: true,
      tools: data.tools || (data.tools === undefined ? undefined : {}),
      llm_config:
        data.llm_config || (data.llm_config === undefined ? undefined : {}),
    };

    // No need to check for is_builtin as it's not in the AgentFormData type anymore

    console.log("Updating agent with data:", agentData);

    const apiClient = await createApiClient();
    console.log(agentData);
    const response = await apiClient.put(`/api/agents/${id}`, agentData);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Delete an agent
 */
export const deleteAgent = async (id: number): Promise<void> => {
  try {
    const apiClient = await createApiClient();
    await apiClient.delete(`/api/agents/${id}`);
  } catch (error) {
    handleApiError(error);
  }
};
