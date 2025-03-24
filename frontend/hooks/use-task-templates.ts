import { useCallback, useEffect, useState } from "react";
import { Task } from "@/utils/api/types";
import { taskApi } from "@/utils/api";
import { useToast } from "@/hooks/use-toast";

export function useTaskTemplates() {
  const [templates, setTemplates] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchTemplates = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await taskApi.getTemplates();
      setTemplates(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch task templates",
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
