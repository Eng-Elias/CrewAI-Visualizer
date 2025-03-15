// LLM API Types
export type LLM = {
  id: number;
  name: string;
  provider: string;
  api_key?: string;
  models: string[];
  config: object;
  user_id?: string;
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
  // is_template and is_builtin are handled by the API
  // is_template is always true for templates
  // is_builtin is not used for now
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
  is_template?: boolean; // Still needed for API but set to true by default
  // is_builtin is not used for now
};
