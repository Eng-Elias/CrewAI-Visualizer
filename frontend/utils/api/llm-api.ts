"use client";

import { BaseApi } from "./base-api";
import { LLM, LLMCreateDto, LLMUpdateDto } from "./types";

export class LLMApi extends BaseApi<LLM, LLMCreateDto, LLMUpdateDto> {
  protected endpoint = "/llms";
}

// Export singleton instance
export const llmApi = new LLMApi();
