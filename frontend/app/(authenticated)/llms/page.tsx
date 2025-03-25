"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { LLMCard } from '@/components/cards/llm/llm-card';
import { LLMModal } from '@/components/modals/llm/llm-modal';
import { NewLLMModal } from '@/components/modals/llm/new-llm-modal';
import { useLLMs } from '@/hooks/use-llms';
import { LLMFormData } from '@/lib/schemas/llm';
import { LLM } from '@/utils/api/types';
import { useToast } from '@/hooks/use-toast';

export default function LLMsPage() {
  const { toast } = useToast();
  const { llms, isLoading, error, createLLM, updateLLM, deleteLLM } = useLLMs();
  
  const [selectedLLM, setSelectedLLM] = useState<LLM | undefined>();
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleCreate = async (data: LLMFormData) => {
    try {
      await createLLM(data);
      setIsNewModalOpen(false);
      toast({
        title: 'Success',
        description: 'LLM created successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to create LLM ${error}`,
        variant: 'destructive',
      });
    }
  };

  const handleUpdate = async (data: LLMFormData) => {
    if (!selectedLLM) return;

    try {
      await updateLLM(selectedLLM.id, data);
      setIsEditModalOpen(false);
      toast({
        title: 'Success',
        description: 'LLM updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to update LLM ${error}`,
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedLLM) return;

    try {
      await deleteLLM(selectedLLM.id);
      setIsEditModalOpen(false);
      toast({
        title: 'Success',
        description: 'LLM deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to delete LLM ${error}`,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Language Models</h1>
          <p className="text-muted-foreground">
            Manage your LLM configurations
          </p>
        </div>
        <Button onClick={() => setIsNewModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add LLM
        </Button>
      </div>

      {error ? (
        <div className="text-red-500">{error}</div>
      ) : isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-100 animate-pulse rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {llms.map((llm) => (
            <LLMCard
              key={llm.id}
              llm={llm}
              onEdit={() => {
                setSelectedLLM(llm);
                setIsEditModalOpen(true);
              }}
              onDelete={() => {
                setSelectedLLM(llm);
                handleDelete();
              }}
            />
          ))}
        </div>
      )}

      <NewLLMModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onCreate={handleCreate}
      />

      <LLMModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedLLM(undefined);
        }}
        llm={selectedLLM}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
}
