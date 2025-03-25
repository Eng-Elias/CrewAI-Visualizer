"use client";

import { TemplateApi } from "./base-api";
import { handleApiError } from "./api-client";
import {
  Crew,
  CrewCreateDto,
  CrewUpdateDto,
  CrewAgent,
  CrewTask,
  AddAgentToCrewParams,
  AddTaskToCrewParams,
} from "./types";

export class CrewApi extends TemplateApi<Crew, CrewCreateDto, CrewUpdateDto> {
  protected endpoint = "/crews";

  /**
   * Add an agent to a crew
   */
  async addAgent(crewId: number, params: AddAgentToCrewParams): Promise<CrewAgent> {
    try {
      const client = await this.getClient();
      const response = await client.post<CrewAgent>(
        `${this.endpoint}/${crewId}/agents`,
        params
      );
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Add a task to a crew
   */
  async addTask(crewId: number, params: AddTaskToCrewParams): Promise<CrewTask> {
    try {
      const client = await this.getClient();
      const response = await client.post<CrewTask>(
        `${this.endpoint}/${crewId}/tasks`,
        params
      );
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Remove an agent from a crew
   */
  async removeAgent(crewId: number, agentId: number): Promise<void> {
    try {
      const client = await this.getClient();
      await client.delete(`${this.endpoint}/${crewId}/agents/${agentId}`);
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Remove a task from a crew
   */
  async removeTask(crewId: number, taskId: number): Promise<void> {
    try {
      const client = await this.getClient();
      await client.delete(`${this.endpoint}/${crewId}/tasks/${taskId}`);
    } catch (error) {
      return handleApiError(error);
    }
  }
}

// Export singleton instance
export const crewApi = new CrewApi();
