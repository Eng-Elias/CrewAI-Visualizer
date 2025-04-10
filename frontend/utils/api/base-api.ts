"use client";

import { AxiosInstance } from "axios";
import { createApiClient, handleApiError } from "./api-client";
import {
  BaseEntity,
  BaseQueryParams,
  TemplateEntity,
  CreateFromTemplateParams,
} from "./types";

export abstract class BaseApi<T extends BaseEntity, CreateDto, UpdateDto> {
  protected abstract endpoint: string;
  protected client: AxiosInstance | null = null;

  protected async getClient(): Promise<AxiosInstance> {
    if (!this.client) {
      this.client = await createApiClient();
    }
    return this.client;
  }

  /**
   * Get all items
   */
  async getAll(params?: BaseQueryParams): Promise<T[]> {
    try {
      const client = await this.getClient();
      const response = await client.get<T[]>(this.endpoint, { params });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Get item by ID
   */
  async getById(id: number): Promise<T> {
    try {
      const client = await this.getClient();
      const response = await client.get<T>(`${this.endpoint}/${id}`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Create new item
   */
  async create(data: CreateDto): Promise<T> {
    try {
      const client = await this.getClient();
      const response = await client.post<T>(this.endpoint, data);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Update existing item
   */
  async update(id: number, data: UpdateDto): Promise<T> {
    try {
      const client = await this.getClient();
      const response = await client.put<T>(`${this.endpoint}/${id}`, data);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Delete item
   */
  async delete(id: number): Promise<void> {
    try {
      const client = await this.getClient();
      await client.delete(`${this.endpoint}/${id}`);
    } catch (error) {
      return handleApiError(error);
    }
  }
}

export abstract class TemplateApi<
  T extends TemplateEntity,
  CreateDto,
  UpdateDto
> extends BaseApi<T, CreateDto, UpdateDto> {
  /**
   * Get all templates
   */
  async getTemplates(includeBuiltin: boolean = true): Promise<T[]> {
    try {
      const client = await this.getClient();
      const response = await client.get<T[]>(`${this.endpoint}/templates`, {
        params: { include_builtin: includeBuiltin },
      });
      return response.data;
    } catch (error) {
      console.log(error);
      return handleApiError(error);
    }
  }

  /**
   * Create a new template
   */
  async createTemplate(data: CreateDto): Promise<T> {
    try {
      const client = await this.getClient();
      const response = await client.post<T>(`${this.endpoint}/templates`, data);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Update an existing template
   */
  async updateTemplate(id: number, data: UpdateDto): Promise<T> {
    try {
      const client = await this.getClient();
      const response = await client.put<T>(
        `${this.endpoint}/templates/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Delete a template
   */
  async deleteTemplate(id: number): Promise<void> {
    try {
      const client = await this.getClient();
      await client.delete(`${this.endpoint}/templates/${id}`);
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Create from template
   */
  async createFromTemplate(params: CreateFromTemplateParams): Promise<T> {
    try {
      const client = await this.getClient();
      const response = await client.post<T>(
        `${this.endpoint}/from-template/${params.template_id}`
      );
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  }
}
