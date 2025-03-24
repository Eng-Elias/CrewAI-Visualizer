import { useCallback, useEffect, useState } from "react";
import { LLM } from "@/utils/api/types";
import { llmApi } from "@/utils/api";
import { useToast } from "@/hooks/use-toast";

export function useLLMs() {
  const [llms, setLLMs] = useState<LLM[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchLLMs = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await llmApi.getAll();
      setLLMs(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch LLMs",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchLLMs();
  }, [fetchLLMs]);

  const refresh = useCallback(() => {
    fetchLLMs();
  }, [fetchLLMs]);

  return {
    llms,
    isLoading,
    refresh,
  };
}
