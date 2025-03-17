"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { LLMCard } from "./llm-card";
import { CreateEditLLMModal } from "./create-edit-llms";
import { ViewLLMModal } from "./view-modal";
import { LLM, LLMFormData } from "@/utils/api/types";
import { createLLM, deleteLLM, getLLMs, updateLLM } from "@/utils/api/llm-api";

export default function LLMsPage() {
  const [llms, setLLMs] = useState<LLM[]>([]);
  const [selectedLLM, setSelectedLLM] = useState<LLM | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLLMs = async () => {
      try {
        setIsLoading(true);
        const data = await getLLMs();
        setLLMs(data);
      } catch (error) {
        console.error("Failed to fetch LLMs:", error);
        toast.error(
          "Failed to load LLMs. Please check your connection and authentication."
        );
        // Set empty array to avoid undefined errors
        setLLMs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLLMs();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteLLM(id);
      setLLMs((prev) => prev.filter((llm) => llm.id !== id));
      toast.success("LLM deleted successfully");
    } catch (error) {
      console.error("Failed to delete LLM:", error);
      toast.error("Failed to delete LLM");
    }
  };

  const handleCreateOrUpdate = async (data: LLMFormData) => {
    try {
      if (selectedLLM) {
        // Update
        const updatedLLM = await updateLLM(selectedLLM.id, data);
        setLLMs((prev) =>
          prev.map((llm) => (llm.id === selectedLLM.id ? updatedLLM : llm))
        );
        toast.success("LLM updated successfully");
      } else {
        // Create
        const newLLM = await createLLM(data);
        setLLMs((prev) => [...prev, newLLM]);
        toast.success("LLM created successfully");
      }
      setIsCreateModalOpen(false);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Failed to save LLM:", error);
      toast.error("Failed to save LLM");
    }
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

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-gray-500">Loading LLMs...</p>
        </div>
      ) : llms.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-64 space-y-4">
          <p className="text-lg text-gray-500">No LLMs found</p>
          <Button
            onClick={() => {
              setSelectedLLM(null);
              setIsCreateModalOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Your First LLM
          </Button>
        </div>
      ) : (
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
      )}

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
