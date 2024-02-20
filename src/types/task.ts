import { Agent } from "./agent";

export type TaskInput = {
  name: string;
  description: string;
  agent?: number;
};

export type Task = {
  name: string;
  description: string;
  agent?: Agent | null;
};
