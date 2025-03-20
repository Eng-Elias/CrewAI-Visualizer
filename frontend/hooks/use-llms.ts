import { useCallback, useEffect, useState } from "react";
import { getLLMs } from "@/utils/api/llm-api";
import { useToast } from "@/hooks/use-toast";
import { LLM } from "@/utils/api/types";

export function useLLMs() {
  const [llms, setLLMs] = useState<LLM[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchLLMs = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getLLMs();
      setLLMs(data);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to fetch LLMs ${error}`,
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
