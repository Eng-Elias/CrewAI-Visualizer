"use client";

import { BaseApi } from "./base-api";
import { handleApiError } from "./api-client";
import {
  Mission,
  MissionCreateDto,
  MissionUpdateDto,
  MissionExecuteResponse,
} from "./types";

export class MissionApi extends BaseApi<Mission, MissionCreateDto, MissionUpdateDto> {
  protected endpoint = "/missions";

  /**
   * Get missions by crew ID
   */
  async getByCrewId(crewId: number): Promise<Mission[]> {
    try {
      const client = await this.getClient();
      const response = await client.get<Mission[]>(`${this.endpoint}/crew/${crewId}`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Execute a mission
   */
  async execute(missionId: number): Promise<MissionExecuteResponse> {
    try {
      const client = await this.getClient();
      const response = await client.post<MissionExecuteResponse>(
        `${this.endpoint}/${missionId}/execute`
      );
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }
}

// Export singleton instance
export const missionApi = new MissionApi(); 