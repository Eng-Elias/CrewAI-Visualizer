import { getSession } from "@/lib/supabase/client";

// Default API URL for local development
const API_URL = process.env.BACKEND_URL || "http://localhost:8000";

// LLM API Types
export type LLM = {
  id: number;
  name: string;
  provider: string;
  api_key?: string;
  models: string[];
  config: object;
  created_at: string;
  updated_at: string;
};

export type LLMFormData = {
  name: string;
  provider: string;
  api_key?: string;
  models: string[];
  config?: object;
};

// Agent API Types
export type Agent = {
  id: number;
  name: string;
  role: string;
  goal: string;
  backstory?: string;
  memory_enabled: boolean;
  verbose: boolean;
  allow_delegation: boolean;
  max_iterations: number;
  max_rpm?: number;
  llm_config?: object;
  tools?: object;
  is_template: boolean;
  is_builtin: boolean;
  template_id?: number;
  template_version?: number;
  user?: string;
  created_at: string;
  updated_at?: string;
};

export type AgentFormData = {
  name: string;
  role: string;
  goal: string;
  backstory?: string;
  memory_enabled?: boolean;
  verbose?: boolean;
  allow_delegation?: boolean;
  max_iterations?: number;
  max_rpm?: number;
  llm_config?: object;
  tools?: object;
  is_template?: boolean;
  is_builtin?: boolean;
  template_id?: number;
  template_version?: number;
};

// Task API Types
export type Task = {
  id: number;
  name: string;
  description: string;
  expected_output: string;
  agent: number;
  tools?: object;
  async_execution: boolean;
  config?: object;
  output_json?: object;
  context?: number[];
  is_template: boolean;
  is_builtin: boolean;
  template_id?: number;
  template_version?: number;
  user?: string;
  created_at: string;
  updated_at?: string;
};

export type TaskFormData = {
  name: string;
  description: string;
  expected_output: string;
  agent: number;
  tools?: object;
  async_execution?: boolean;
  config?: object;
  output_json?: object;
  context?: number[];
  is_template?: boolean;
  is_builtin?: boolean;
  template_id?: number | null;
  template_version?: number | null;
};

// LLM API functions
export const getLLMs = async (): Promise<LLM[]> => {
  const session = await getSession();
  if (!session) {
    throw new Error("No active session");
  }

  const response = await fetch(`${API_URL}/api/llms`, {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch LLMs: ${response.statusText}`);
  }

  return await response.json();
};

export const getLLM = async (id: number): Promise<LLM> => {
  const session = await getSession();
  if (!session) {
    throw new Error("No active session");
  }

  const response = await fetch(`${API_URL}/api/llms/${id}`, {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch LLM: ${response.statusText}`);
  }

  return await response.json();
};

export const createLLM = async (data: LLMFormData): Promise<LLM> => {
  const session = await getSession();
  if (!session) {
    throw new Error("No active session");
  }

  const response = await fetch(`${API_URL}/api/llms`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to create LLM: ${response.statusText}`);
  }

  return await response.json();
};

export const updateLLM = async (
  id: number,
  data: Partial<LLMFormData>
): Promise<LLM> => {
  const session = await getSession();
  if (!session) {
    throw new Error("No active session");
  }

  const response = await fetch(`${API_URL}/api/llms/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to update LLM: ${response.statusText}`);
  }

  return await response.json();
};

export const deleteLLM = async (id: number): Promise<void> => {
  const session = await getSession();
  if (!session) {
    throw new Error("No active session");
  }

  const response = await fetch(`${API_URL}/api/llms/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete LLM: ${response.statusText}`);
  }
};

export const getLLMProviders = async (): Promise<Record<string, string>> => {
  const session = await getSession();
  if (!session) {
    throw new Error("No active session");
  }

  const response = await fetch(`${API_URL}/api/llms/providers`, {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch LLM providers: ${response.statusText}`);
  }

  return await response.json();
};

// Agent API functions
export const getAgents = async (
  includeTemplates: boolean = true
): Promise<Agent[]> => {
  const session = await getSession();
  if (!session) {
    throw new Error("No active session");
  }

  const response = await fetch(
    `${API_URL}/api/agents?include_templates=${includeTemplates}`,
    {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch agents: ${response.statusText}`);
  }

  return await response.json();
};

export const getAgentTemplates = async (
  includeBuiltin: boolean = true
): Promise<Agent[]> => {
  const session = await getSession();
  if (!session) {
    throw new Error("No active session");
  }

  const response = await fetch(
    `${API_URL}/api/agents/templates?include_builtin=${includeBuiltin}`,
    {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch agent templates: ${response.statusText}`);
  }

  return await response.json();
};

export const getAgent = async (id: number): Promise<Agent> => {
  const session = await getSession();
  if (!session) {
    throw new Error("No active session");
  }

  const response = await fetch(`${API_URL}/api/agents/${id}`, {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch agent: ${response.statusText}`);
  }

  return await response.json();
};

export const createAgent = async (data: AgentFormData): Promise<Agent> => {
  console.log("Creating agent with data:", data);
  const session = await getSession();
  if (!session) {
    throw new Error("No active session");
  }

  const response = await fetch(`${API_URL}/api/agents`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to create agent: ${response.statusText}`);
  }

  return await response.json();
};

export const updateAgent = async (
  id: number,
  data: Partial<AgentFormData>
): Promise<Agent> => {
  const session = await getSession();
  if (!session) {
    throw new Error("No active session");
  }

  const response = await fetch(`${API_URL}/api/agents/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to update agent: ${response.statusText}`);
  }

  return await response.json();
};

export const deleteAgent = async (id: number): Promise<void> => {
  const session = await getSession();
  if (!session) {
    throw new Error("No active session");
  }

  const response = await fetch(`${API_URL}/api/agents/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete agent: ${response.statusText}`);
  }
};

// Task API functions
export const getTasks = async (
  includeTemplates: boolean = true,
  agentId?: number
): Promise<Task[]> => {
  const session = await getSession();
  if (!session) {
    throw new Error("No active session");
  }

  let url = `${API_URL}/api/tasks?include_templates=${includeTemplates}`;
  if (agentId) {
    url += `&agent_id=${agentId}`;
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch tasks: ${response.statusText}`);
  }

  return await response.json();
};

export const getTaskTemplates = async (
  includeBuiltin: boolean = true
): Promise<Task[]> => {
  const session = await getSession();
  if (!session) {
    throw new Error("No active session");
  }

  const response = await fetch(
    `${API_URL}/api/tasks/templates?include_builtin=${includeBuiltin}`,
    {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch task templates: ${response.statusText}`);
  }

  return await response.json();
};

export const getTask = async (id: number): Promise<Task> => {
  const session = await getSession();
  if (!session) {
    throw new Error("No active session");
  }

  const response = await fetch(`${API_URL}/api/tasks/${id}`, {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch task: ${response.statusText}`);
  }

  return await response.json();
};

export const createTask = async (data: TaskFormData): Promise<Task> => {
  const session = await getSession();
  if (!session) {
    throw new Error("No active session");
  }

  const response = await fetch(`${API_URL}/api/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to create task: ${response.statusText}`);
  }

  return await response.json();
};

export const updateTask = async (
  id: number,
  data: Partial<TaskFormData>
): Promise<Task> => {
  const session = await getSession();
  if (!session) {
    throw new Error("No active session");
  }

  const response = await fetch(`${API_URL}/api/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to update task: ${response.statusText}`);
  }

  return await response.json();
};

export const deleteTask = async (id: number): Promise<void> => {
  const session = await getSession();
  if (!session) {
    throw new Error("No active session");
  }

  const response = await fetch(`${API_URL}/api/tasks/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete task: ${response.statusText}`);
  }
};
