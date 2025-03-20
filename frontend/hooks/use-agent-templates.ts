import { useCallback, useEffect, useState } from "react";
import { getAgentTemplates } from "@/utils/api/agent-api";
import { useToast } from "@/hooks/use-toast";
import { Agent } from "@/utils/api/types";

export function useAgentTemplates() {
  const [templates, setTemplates] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchTemplates = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getAgentTemplates();
      setTemplates(data);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to fetch agent templates, ${error}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

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
