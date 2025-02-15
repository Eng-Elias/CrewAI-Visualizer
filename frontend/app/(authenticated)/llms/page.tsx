"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { LLMCard } from "./llm-card";
import { CreateEditLLMModal } from "./create-edit-modal";
import { ViewLLMModal } from "./view-modal";

export type LLM = {
  id: number;
  name: string;
  provider: string;
  api_key?: string;
  models: string[];
  config: object;
  created_at: string;
  updated_at: string;
};

// Sample data
const initialLLMs: LLM[] = [
  {
    id: 1,
    name: "GPT-4",
    provider: "OpenAI",
    api_key: "sk-sample-key",
    models: ["gpt-4", "gpt-4-turbo"],
    config: { temperature: 0.7, max_tokens: 2000 },
    created_at: new Date("2024-01-01").toISOString(),
    updated_at: new Date("2024-01-01").toISOString(),
  },
  {
    id: 2,
    name: "Claude",
    provider: "Anthropic",
    api_key: "sk-sample-key-2",
    models: ["claude-2", "claude-instant"],
    config: { temperature: 0.8, max_tokens: 1500 },
    created_at: new Date("2024-01-02").toISOString(),
    updated_at: new Date("2024-01-02").toISOString(),
  },
];

export default function LLMsPage() {
  const [llms, setLLMs] = useState<LLM[]>(initialLLMs);
  const [selectedLLM, setSelectedLLM] = useState<LLM | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const handleDelete = (id: number) => {
    setLLMs((prev) => prev.filter((llm) => llm.id !== id));
    toast.success("LLM deleted successfully");
  };

  const handleCreateOrUpdate = async (data: Partial<LLM>) => {
    if (selectedLLM) {
      // Update
      setLLMs((prev) =>
        prev.map((llm) =>
          llm.id === selectedLLM.id
            ? {
                ...llm,
                ...data,
                updated_at: new Date().toISOString(),
              }
            : llm
        )
      );
      toast.success("LLM updated successfully");
    } else {
      // Create
      const newLLM: LLM = {
        ...(data as Omit<LLM, "id" | "created_at" | "updated_at">),
        id: Math.max(0, ...llms.map((llm) => llm.id)) + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setLLMs((prev) => [...prev, newLLM]);
      toast.success("LLM created successfully");
    }
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Language Models</h1>
        <Button
          onClick={() => {
            setSelectedLLM(null);
            setIsCreateModalOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New LLM
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {llms.map((llm) => (
          <LLMCard
            key={llm.id}
            llm={llm}
            onView={() => {
              setSelectedLLM(llm);
              setIsViewModalOpen(true);
            }}
            onEdit={() => {
              setSelectedLLM(llm);
              setIsEditModalOpen(true);
            }}
            onDelete={() => handleDelete(llm.id)}
          />
        ))}
      </div>

      <CreateEditLLMModal
        open={isCreateModalOpen || isEditModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateModalOpen(false);
            setIsEditModalOpen(false);
            setSelectedLLM(null);
          }
        }}
        llm={selectedLLM}
        onSubmit={(data) => handleCreateOrUpdate(data)}
      />

      <ViewLLMModal
        open={isViewModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsViewModalOpen(false);
            setSelectedLLM(null);
          }
        }}
        llm={selectedLLM}
      />
    </div>
  );
}
