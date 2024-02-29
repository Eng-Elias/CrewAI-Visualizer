import { Agent } from "./agent";
import { Task, TaskInput } from "./task";

type ProcessType = "SEQUENTIAL" | "HIERARCHICAL";

export type Mission = {
  id?: number | string;
  name: string;
  crew: Array<Agent>;
  tasks: Array<Task>;
  verbose: boolean;
  process: ProcessType;
  result?: string;
};

export type CreateMissionInput = {
  id?: number;
  name: string;
  crew: Array<number>;
  tasks: Array<TaskInput>;
  verbose: boolean;
  process: ProcessType;
};
