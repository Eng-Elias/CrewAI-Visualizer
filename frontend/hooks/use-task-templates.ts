"use client";

import { useState, useEffect } from "react";
import { taskApi } from "@/utils/api/task-api";
import { Task, TaskCreateDto, TaskUpdateDto } from "@/utils/api/types";
import { ToastUtils } from "@/utils/ui/toast-utils";

export function useTaskTemplates() {
  const [templates, setTemplates] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setIsLoading(true);
      const data = await taskApi.getTemplates();
      setTemplates(data);
      setError(null);
    } catch (error) {
      console.error("Failed to load task templates:", error);
      setError("Failed to load task templates");
      ToastUtils.error("Failed to load task templates");
    } finally {
      setIsLoading(false);
    }
  };

  const createTemplate = async (data: TaskCreateDto) => {
    try {
      const newTemplate = await taskApi.createTemplate(data);
      setTemplates([...templates, newTemplate]);
      ToastUtils.success("Task template created successfully");
      return newTemplate;
    } catch (error) {
      console.error("Failed to create task template:", error);
      ToastUtils.error(`Failed to create task template`);
    }
  };

  const updateTemplate = async (id: number, data: TaskUpdateDto) => {
    try {
      const updatedTemplate = await taskApi.updateTemplate(id, data);
      setTemplates(
        templates.map((template) =>
          template.id === id ? updatedTemplate : template
        )
      );
      ToastUtils.success("Task template updated successfully");
      return updatedTemplate;
    } catch (error) {
      console.error("Failed to update task template:", error);
      ToastUtils.error(
        `Failed to update task template${
          error instanceof Error ? `: ${error.message}` : ""
        }`
      );
    }
  };

  const deleteTemplate = async (id: number) => {
    try {
      await taskApi.deleteTemplate(id);
      setTemplates(templates.filter((template) => template.id !== id));
      ToastUtils.success("Task template deleted successfully");
    } catch (error) {
      console.error("Failed to delete task template:", error);
      ToastUtils.error("Failed to delete task template");
    }
  };

  return {
    templates,
    isLoading,
    error,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    refresh: loadTemplates,
  };
}
