import { Task } from "./task";

export type Mission = {
  name: string;
  crew: Array<string>;
  tasks: Array<Task>;
  verbose: boolean;
  process: string;
  result: string;
};
