import { useState, useEffect } from 'react';
import { LLM } from '@/utils/api/types';
import { LLMFormData } from '@/lib/schemas/llm';
import { llmApi } from '@/utils/api/llm-api';

export function useLLMs() {
  const [llms, setLLMs] = useState<LLM[]>([]);
  const [providers, setProviders] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLLMs();
    fetchProviders();
  }, []);

  const fetchLLMs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await llmApi.getAll();
      setLLMs(data);
    } catch (err) {
      setError('Failed to fetch LLMs');
      console.error('Failed to fetch LLMs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProviders = async () => {
    try {
      const data = await llmApi.getProviders();
      setProviders(data);
    } catch (error) {
      console.log(error);
      console.error('Failed to fetch LLM providers:', error);
    }
  };

  const createLLM = async (data: LLMFormData) => {
    try {
      const newLLM = await llmApi.create(data);
      setLLMs(prev => [...prev, newLLM]);
      return newLLM;
    } catch (err) {
      console.error('Failed to create LLM:', err);
      throw err;
    }
  };

  const updateLLM = async (id: number, data: LLMFormData) => {
    try {
      const updatedLLM = await llmApi.update(id, data);
      setLLMs(prev => prev.map(llm => llm.id === id ? updatedLLM : llm));
      return updatedLLM;
    } catch (err) {
      console.error('Failed to update LLM:', err);
      throw err;
    }
  };

  const deleteLLM = async (id: number) => {
    try {
      await llmApi.delete(id);
      setLLMs(prev => prev.filter(llm => llm.id !== id));
    } catch (err) {
      console.error('Failed to delete LLM:', err);
      throw err;
    }
  };

  return {
    llms,
    providers,
    isLoading,
    error,
    createLLM,
    updateLLM,
    deleteLLM,
    refetch: fetchLLMs,
  };
}
