"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AgentModal } from "@/components/modals/agent/agent-modal";
import { useAgentTemplates } from "@/hooks/use-agent-templates";
import { Agent } from "@/utils/api/types";
import { AgentFormData } from "@/lib/schemas/agent";

export default function ViewAgentTemplatePage({
  params,
}: {
  params: { id: string };
}) {
  const {
    templates,
    isLoading,
    error,
    updateTemplate,
    deleteTemplate,
    refreshTemplates,
  } = useAgentTemplates();

  const [selectedTemplate, setSelectedTemplate] = useState<Agent | null>(null);
  const [isLoadingAction, setIsLoadingAction] = useState(false);

  useEffect(() => {
    const template = templates.find((t) => t.id === parseInt(params.id));
    if (template) {
      setSelectedTemplate(template);
    }
  }, [templates, params.id]);

  const handleUpdate = async (data: AgentFormData) => {
    if (!selectedTemplate) return;
    try {
      setIsLoadingAction(true);
      await updateTemplate(selectedTemplate.id, data);
      await refreshTemplates();
    } catch (error) {
      console.error("Failed to update template:", error);
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedTemplate) return;
    try {
      setIsLoadingAction(true);
      await deleteTemplate(selectedTemplate.id);
    } catch (error) {
      console.error("Failed to delete template:", error);
    } finally {
      setIsLoadingAction(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-gray-500">Loading agent template...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  if (!selectedTemplate) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-gray-500">Agent template not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/templates/agents">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <AgentModal
        agent={selectedTemplate}
        isOpen={true}
        onClose={() => {}}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        isLoading={isLoadingAction}
      />
    </div>
  );
}
