import { Json } from "@/core/database.types";
import { Database } from "@/core/database.types";

// Re-export process and agent role types from database
export type ProcessType = Database["public"]["Enums"]["process_type"];
export type AgentRoleType = Database["public"]["Enums"]["agent_role_type"];

// Base interfaces
export interface BaseEntity {
  id: number;
  created_at: string;
  updated_at: string | null;
  user_id: string | null;
}

// Template entity interface
export interface TemplateEntity extends BaseEntity {
  is_template: boolean;
  is_builtin: boolean;
  template_id?: number | null;
  template_version?: number | null;
}

// Common query parameters
export interface BaseQueryParams {
  include_templates?: boolean;
}

export interface TemplateQueryParams extends BaseQueryParams {
  include_builtin?: boolean;
}

// Template creation params
export interface CreateFromTemplateParams {
  template_id: number;
}

// LLM entity interfaces
export interface LLM extends BaseEntity {
  name: string;
  provider: string;
  models: string[];
  api_key?: string;
  temperature?: number;
  max_tokens?: number;
  config?: Record<string, string | number>;
}

export interface LLMCreateDto {
  name: string;
  provider: string;
  models: string[];
  api_key?: string;
  temperature?: number;
  max_tokens?: number;
  config?: Record<string, string | number>;
}

export interface LLMUpdateDto {
  name?: string;
  provider?: string;
  models?: string[];
  api_key?: string;
  temperature?: number;
  max_tokens?: number;
  config?: Record<string, string | number>;
}

// Agent types
export interface Agent extends TemplateEntity {
  name: string;
  role: string;
  goal: string;
  backstory?: string | null;
  // memory_enabled: boolean | null;
  // verbose: boolean | null;
  // allow_delegation: boolean | null;
  // max_iterations: number | null;
  // max_rpm: number | null;
  // tools: Json | null;
  // llm_config: Json | null;
}

export interface AgentCreateDto {
  name: string;
  role: string;
  goal: string;
  backstory?: string | null;
  // memory_enabled?: boolean | null;
  // verbose?: boolean | null;
  // allow_delegation?: boolean | null;
  // max_iterations?: number | null;
  // max_rpm?: number | null;
  // tools?: Json | null;
  // llm_config?: Json | null;
  // is_template?: boolean | null;
  // is_builtin?: boolean | null;
}

export type AgentUpdateDto = Partial<
  Omit<AgentCreateDto, "is_template" | "is_builtin">
>;

// Task types
export interface Task extends TemplateEntity {
  name: string;
  description: string;
  expected_output: string;
  agent: number | null;
  // tools: Record<string, unknown> | null;
  // async_execution: boolean;
  // config: Record<string, unknown> | null;
  // context: number[] | null;
  // output_json: Record<string, unknown> | null;
  user_id: string | null;
}

export interface TaskCreateDto {
  name: string;
  description: string;
  expected_output: string;
  agent?: number | null;
  // tools?: Record<string, unknown>;
  // async_execution?: boolean;
  // config?: Record<string, unknown>;
  // context?: number[];
  // output_json?: Record<string, unknown>;
}

export type TaskUpdateDto = Partial<
  Omit<TaskCreateDto, "is_template" | "is_builtin">
>;

// Crew types
export interface Crew extends TemplateEntity {
  name: string;
  description: string;
  process: ProcessType | null;
  verbose: boolean | null;
  config: Json | null;
  max_rpm: number | null;
  language: string | null;
  memory: boolean | null;
  memory_config: Json | null;
  embedder: Json | null;
  full_output: boolean | null;
  manager_agent: number | null;
  planning: boolean | null;
}

export interface CrewCreateDto {
  name: string;
  description: string;
  process?: ProcessType;
  verbose?: boolean;
  config?: Json;
  max_rpm?: number;
  language?: string;
  memory?: boolean;
  memory_config?: Json;
  embedder?: Json;
  full_output?: boolean;
  manager_agent?: number;
  planning?: boolean;
  is_template?: boolean;
  is_builtin?: boolean;
}

export type CrewUpdateDto = Partial<
  Omit<CrewCreateDto, "is_template" | "is_builtin">
>;

// Crew relations types
export interface CrewAgent {
  id: string;
  crew_id: number;
  agent_id: number;
  role: AgentRoleType | null;
  agent_order: number;
  created_at: string;
  updated_at: string;
}

export interface CrewTask {
  id: string;
  crew_id: number;
  task_id: number;
  task_order: number;
  assigned_agent_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface AddAgentToCrewParams {
  agent_template_id?: number;
  agent_data?: AgentCreateDto;
  role: AgentRoleType;
  agent_order: number;
}

export interface AddTaskToCrewParams {
  task_template_id?: number;
  task_data?: TaskCreateDto;
  task_order: number;
  assigned_agent_id?: number;
}

// Mission types
export interface Mission extends BaseEntity {
  crew_id: number;
  name: string;
  description: string | null;
  default_llm_id: number | null;
  default_llm_model: string | null;
  manager_llm_id: number | null;
  manager_llm_model: string | null;
  function_calling_llm_id: number | null;
  function_calling_llm_model: string | null;
  planning_llm_id: number | null;
  planning_llm_model: string | null;
  input_data: Json;
  result_data: Json | null;
  status: string;
  error: string | null;
  is_deleted: boolean;
}

export interface MissionCreateDto {
  crew_id: number;
  name: string;
  description?: string;
  default_llm_id?: number;
  default_llm_model?: string;
  manager_llm_id?: number;
  manager_llm_model?: string;
  function_calling_llm_id?: number;
  function_calling_llm_model?: string;
  planning_llm_id?: number;
  planning_llm_model?: string;
  input_data: Json;
}

export type MissionUpdateDto = Partial<Omit<MissionCreateDto, "crew_id">> & {
  result_data?: Json;
  status?: string;
  error?: string;
};

export interface MissionExecuteResponse {
  status: string;
  result?: Json;
  error?: string;
}
