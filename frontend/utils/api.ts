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
