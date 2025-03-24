import { AGENT_FIELDS, CREW_FIELDS, TASK_FIELDS, LLM_FIELDS, MISSION_FIELDS } from '../constants/entity-fields';

type FieldVisibility = 'show' | 'hide' | 'readonly';

export type FieldControl<T extends Record<string, readonly string[]>> = {
  [K in keyof T]?: {
    [Field in T[K][number]]?: FieldVisibility;
  };
};

export type AgentFieldControl = FieldControl<typeof AGENT_FIELDS>;
export type CrewFieldControl = FieldControl<typeof CREW_FIELDS>;
export type TaskFieldControl = FieldControl<typeof TASK_FIELDS>;
export type LLMFieldControl = FieldControl<typeof LLM_FIELDS>;
export type MissionFieldControl = FieldControl<typeof MISSION_FIELDS>;

export type EntityFieldControl = 
  | AgentFieldControl 
  | CrewFieldControl 
  | TaskFieldControl 
  | LLMFieldControl 
  | MissionFieldControl; 