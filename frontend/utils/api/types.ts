// Base API Types
export interface BaseResponse {
  data: unknown;
  error?: string;
}

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
  description?: string;
  llm_id?: number;
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
  template_id?: string;
  template_version?: number;
  user_id?: string;
  created_at: string;
  updated_at?: string;
  config?: object;
};

export type AgentFormData = {
  name: string;
  description?: string;
  llm_id?: number;
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
  config?: object;
  is_template?: boolean;
  is_builtin?: boolean;
  template_id?: string;
  template_version?: number;
};

// Task API Types
export type Task = {
  id: number;
  name: string;
  description: string;
  expected_output: string;
  agent: string;
  tools?: object;
  async_execution: boolean;
  config?: object;
  output_json?: object;
  context?: string[];
  is_template: boolean;
  is_builtin: boolean;
  template_id?: string;
  template_version?: number;
  user?: string;
  created_at: string;
  updated_at?: string;
};

export type TaskFormData = {
  name: string;
  description: string;
  expected_output: string;
  agent: string;
  tools?: object;
  async_execution: boolean;
  config?: object;
  output_json?: object;
  context?: string[];
};

export enum ProcessType {
  Sequential = "sequential",
  Hierarchical = "hierarchical",
}

export enum AgentRole {
  Manager = "manager",
  Worker = "worker",
}

export type CrewAgent = {
  crew_id?: number;
  agent_id: number;
  role: AgentRole;
  agent_order?: number;
  data?: Agent;
};

export type CrewTask = {
  crew_id?: number;
  task_id: number;
  task_order?: number;
  assigned_agent_id?: number;
  data?: Task;
};

export type Crew = {
  id: number;
  name: string;
  description?: string;
  process: ProcessType;
  verbose: boolean;
  manager_llm_id?: number;
  function_calling_llm_id?: number;
  config?: object;
  max_rpm?: number;
  language?: string;
  memory?: boolean;
  memory_config?: object;
  embedder?: object;
  full_output?: boolean;
  manager_agent?: number;
  planning?: boolean;
  planning_llm_id?: number;
  crew_agents: CrewAgent[];
  crew_tasks: CrewTask[];
  created_at: string;
  updated_at: string;
  is_template: boolean;
  is_builtin: boolean;
  user_id: string;
};

export type CreateCrewRequest = {
  name: string;
  description?: string;
  process: ProcessType;
  verbose: boolean;
  manager_llm_id?: number;
  function_calling_llm_id?: number;
  planning_llm_id?: number;
  config?: object;
  max_rpm?: number;
  language?: string;
  memory?: boolean;
  memory_config?: object;
  embedder?: object;
  full_output?: boolean;
  manager_agent?: number;
  planning?: boolean;
  crew_agents: CrewAgent[];
  crew_tasks: CrewTask[];
};

export type UpdateCrewRequest = {
  name?: string;
  description?: string;
  process?: ProcessType;
  verbose?: boolean;
  manager_llm_id?: number;
  function_calling_llm_id?: number;
  planning_llm_id?: number;
  config?: object;
  max_rpm?: number;
  language?: string;
  memory?: boolean;
  memory_config?: object;
  embedder?: object;
  full_output?: boolean;
  manager_agent?: number;
  planning?: boolean;
  crew_agents?: CrewAgent[];
  crew_tasks?: CrewTask[];
};

export type CrewFormData = {
  name: string;
  description: string;
  process?: string;
  verbose?: boolean;
  manager_llm_id?: number;
  function_calling_llm_id?: number;
  config?: object;
  max_rpm?: number;
  language?: string;
  memory?: boolean;
  memory_config?: object;
  embedder?: object;
  full_output?: boolean;
  manager_agent?: number;
  planning?: boolean;
  planning_llm_id?: number;
  is_template?: boolean;
  is_builtin?: boolean;
  template_id?: number | null;
  template_version?: number | null;
  crew_agents?: CrewAgent[];
  crew_tasks?: CrewTask[];
};
