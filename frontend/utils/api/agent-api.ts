"use client";

import { TemplateApi } from "./base-api";
import { Agent, AgentCreateDto, AgentUpdateDto } from "./types";

export class AgentApi extends TemplateApi<
  Agent,
  AgentCreateDto,
  AgentUpdateDto
> {
  protected endpoint = "/agents";
}

// Export singleton instance
export const agentApi = new AgentApi();
