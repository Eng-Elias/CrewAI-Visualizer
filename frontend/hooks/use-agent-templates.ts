import { useState, useEffect } from "react";
import { Agent, AgentCreateDto, AgentUpdateDto } from "@/utils/api/types";
import { agentApi } from "@/utils/api/agent-api";
import { ToastUtils } from "@/utils/ui/toast-utils";

export function useAgentTemplates() {
  const [templates, setTemplates] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await agentApi.getTemplates();
      setTemplates(data);
    } catch (error) {
      console.error("Failed to fetch agent templates:", error);
      setError("Failed to load agent templates");
      ToastUtils.error("Failed to load agent templates");
    } finally {
      setIsLoading(false);
    }
  };

  const createTemplate = async (data: AgentCreateDto) => {
    try {
      const newTemplate = await agentApi.createTemplate(data);
      setTemplates((prev) => [...prev, newTemplate]);
      ToastUtils.success("Agent template created successfully");
      return newTemplate;
    } catch (error) {
      console.error("Failed to create agent template:", error);
      ToastUtils.error("Failed to create agent template");
    }
  };

  const updateTemplate = async (id: number, data: AgentUpdateDto) => {
    try {
      const updatedTemplate = await agentApi.updateTemplate(id, data);
      setTemplates((prev) =>
        prev.map((template) =>
          template.id === id ? updatedTemplate : template
        )
      );
      ToastUtils.success("Agent template updated successfully");
      return updatedTemplate;
    } catch (error) {
      console.error("Failed to update agent template:", error);
      ToastUtils.error(
        `Failed to update agent template${
          error instanceof Error ? `: ${error.message}` : ""
        }`
      );
    }
  };

  const deleteTemplate = async (id: number) => {
    try {
      await agentApi.deleteTemplate(id);
      setTemplates((prev) => prev.filter((template) => template.id !== id));
      ToastUtils.success("Agent template deleted successfully");
    } catch (error) {
      console.error("Failed to delete agent template:", error);
      ToastUtils.error("Failed to delete agent template");
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return {
    templates,
    isLoading,
    error,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    refreshTemplates: fetchTemplates,
  };
}
