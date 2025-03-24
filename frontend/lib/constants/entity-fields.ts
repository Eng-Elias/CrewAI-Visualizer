export const AGENT_FIELDS = {
  BASIC: ['name', 'role', 'goal', 'backstory'] as const,
  CONFIG: ['memory_enabled', 'verbose', 'allow_delegation', 'max_iterations', 'max_rpm'] as const,
  ADVANCED: ['tools', 'llm_config'] as const,
  ALL: ['name', 'role', 'goal', 'backstory', 'memory_enabled', 'verbose', 'allow_delegation', 
        'max_iterations', 'max_rpm', 'tools', 'llm_config'] as const,
} as const;

export const CREW_FIELDS = {
  BASIC: ['name', 'description', 'process'] as const,
  AGENTS: ['crew_agents', 'manager_agent'] as const,
  TASKS: ['crew_tasks'] as const,
  CONFIG: ['verbose', 'memory', 'planning', 'full_output', 'manager_llm_id', 
          'function_calling_llm_id', 'planning_llm_id', 'language', 'max_rpm'] as const,
  ALL: ['name', 'description', 'process', 'crew_agents', 'manager_agent', 'crew_tasks',
        'verbose', 'memory', 'planning', 'full_output', 'manager_llm_id', 
        'function_calling_llm_id', 'planning_llm_id', 'language', 'max_rpm'] as const,
} as const;

export const TASK_FIELDS = {
  BASIC: ['name', 'description', 'expected_output'] as const,
  CONFIG: ['agent', 'async_execution'] as const,
  ADVANCED: ['tools', 'config', 'output_json', 'context'] as const,
  ALL: ['name', 'description', 'expected_output', 'agent', 'async_execution',
        'tools', 'config', 'output_json', 'context'] as const,
} as const;

export const LLM_FIELDS = {
  BASIC: ['name', 'provider', 'api_key'] as const,
  CONFIG: ['models', 'config'] as const,
  ALL: ['name', 'provider', 'api_key', 'models', 'config'] as const,
} as const;

export const MISSION_FIELDS = {
  BASIC: ['name', 'description', 'crew_id'] as const,
  CONFIG: ['default_llm_id', 'default_llm_model', 'manager_llm_id', 'manager_llm_model',
           'function_calling_llm_id', 'function_calling_llm_model', 'planning_llm_id', 
           'planning_llm_model'] as const,
  DATA: ['input_data', 'result_data'] as const,
  STATUS: ['status', 'error'] as const,
  ALL: ['name', 'description', 'crew_id', 'default_llm_id', 'default_llm_model', 
        'manager_llm_id', 'manager_llm_model', 'function_calling_llm_id', 
        'function_calling_llm_model', 'planning_llm_id', 'planning_llm_model',
        'input_data', 'result_data', 'status', 'error'] as const,
} as const; 