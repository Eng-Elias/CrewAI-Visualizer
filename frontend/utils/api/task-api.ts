"use client";

import { TemplateApi } from "./base-api";
import { Task, TaskCreateDto, TaskUpdateDto } from "./types";

export class TaskApi extends TemplateApi<Task, TaskCreateDto, TaskUpdateDto> {
  protected endpoint = "/tasks";
}

// Export singleton instance
export const taskApi = new TaskApi();
