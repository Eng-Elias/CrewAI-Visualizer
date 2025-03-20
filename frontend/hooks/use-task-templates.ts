import { useCallback, useEffect, useState } from "react";
import { getTaskTemplates } from "@/utils/api/task-api";
import { useToast } from "@/hooks/use-toast";
import { Task } from "@/utils/api/types";

export function useTaskTemplates() {
  const [templates, setTemplates] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchTemplates = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getTaskTemplates();
      setTemplates(data);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to fetch task templates, ${error}`,
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
