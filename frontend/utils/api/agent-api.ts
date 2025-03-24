"use client";

import { BaseApi } from "./base-api";
import { Agent, AgentCreateDto, AgentUpdateDto } from "./types";

export class AgentApi extends BaseApi<Agent, AgentCreateDto, AgentUpdateDto> {
  protected endpoint = "/agents";
}

// Export singleton instance
export const agentApi = new AgentApi();
