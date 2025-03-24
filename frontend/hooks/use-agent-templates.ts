import { useCallback, useEffect, useState } from "react";
import { Agent } from "@/utils/api/types";
import { agentApi } from "@/utils/api";
import { useToast } from "@/hooks/use-toast";

export function useAgentTemplates(includeBuiltin: boolean = true) {
  const [templates, setTemplates] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchTemplates = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await agentApi.getTemplates(includeBuiltin);
      setTemplates(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch agent templates",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, includeBuiltin]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const refresh = useCallback(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  return {
    templates,
    isLoading,
    refresh,
  };
}
