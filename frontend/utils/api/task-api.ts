"use client";

import { BaseApi } from "./base-api";
import { Task, TaskCreateDto, TaskUpdateDto } from "./types";

export class TaskApi extends BaseApi<Task, TaskCreateDto, TaskUpdateDto> {
  protected endpoint = "/tasks";
}

// Export singleton instance
export const taskApi = new TaskApi();
