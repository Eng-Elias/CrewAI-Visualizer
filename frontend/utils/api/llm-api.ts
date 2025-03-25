"use client";

import { BaseApi } from "./base-api";
import { LLM, LLMCreateDto, LLMUpdateDto } from "./types";
import { handleApiError } from "./api-client";

export class LLMApi extends BaseApi<LLM, LLMCreateDto, LLMUpdateDto> {
  protected endpoint = "/llms";

  /**
   * Get all available LLM providers
   */
  async getProviders(): Promise<string[]> {
    try {
      const client = await this.getClient();
      const response = await client.get<string[]>(`${this.endpoint}/providers`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }
}

// Export singleton instance
export const llmApi = new LLMApi();
