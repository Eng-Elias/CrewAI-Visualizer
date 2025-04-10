"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { AgentCard } from "@/components/cards/agent/agent-card";
import { AgentModal } from "@/components/modals/agent/agent-modal";
import { NewAgentModal } from "@/components/modals/agent/new-agent-modal";
import { useAgentTemplates } from "@/hooks/use-agent-templates";
import { Agent, AgentCreateDto, AgentUpdateDto } from "@/utils/api/types";
import { useAuth } from "@/lib/auth/provider";
import { ToastUtils } from "@/utils/ui/toast-utils";

export default function AgentTemplatesPage() {
  const { user } = useAuth();

  const {
    templates,
    isLoading,
    error,
    createTemplate,
    updateTemplate,
    deleteTemplate,
  } = useAgentTemplates();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<Agent | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isLoadingAction, setIsLoadingAction] = useState(false);

  const handleCreate = async (data: AgentCreateDto) => {
    try {
      setIsLoadingAction(true);
      await createTemplate(data);
      setIsNewModalOpen(false);
    } catch (error) {
      console.error("Failed to create template:", error);
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleUpdate = async (data: AgentUpdateDto) => {
    if (!selectedTemplate) return;
    try {
      setIsLoadingAction(true);
      await updateTemplate(selectedTemplate.id, data);
      setSelectedTemplate(null);
    } catch (error) {
      console.error("Failed to update template:", error);
      ToastUtils.error("Failed to update agent template");
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedTemplate) return;
    try {
      setIsLoadingAction(true);
      await deleteTemplate(selectedTemplate.id);
      setSelectedTemplate(null);
    } catch (error) {
      console.error("Failed to delete template:", error);
      ToastUtils.error("Failed to delete agent template");
    } finally {
      setIsLoadingAction(false);
    }
  };

  const filteredTemplates = searchQuery
    ? templates.filter(
        (template) =>
          template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          template.role.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : templates;

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Agent Templates</h1>
            <p className="text-muted-foreground">
              Browse and create agent templates with predefined roles and
              capabilities
            </p>
          </div>
          <Button onClick={() => setIsNewModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Agent Template
          </Button>
        </div>

        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            type="text"
            placeholder="Search agent templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button variant="secondary" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-lg text-gray-500">Loading agent templates...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-lg text-red-500">{error}</p>
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-64 space-y-4">
            <p className="text-lg text-gray-500">
              {searchQuery
                ? "No matching agent templates found"
                : "No agent templates found"}
            </p>
            <Button onClick={() => setIsNewModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Agent Template
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map((template) => (
              <AgentCard
                key={template.id}
                agent={template}
                onEditButtonClick={() => setSelectedTemplate(template)}
                onViewButtonClick={() => setSelectedTemplate(template)}
                isLoading={isLoadingAction}
              />
            ))}
          </div>
        )}
      </div>

      <NewAgentModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onCreate={handleCreate}
        isLoading={isLoadingAction}
      />

      {selectedTemplate && (
        <AgentModal
          agent={selectedTemplate}
          isOpen={!!selectedTemplate}
          isEditable={user?.id === selectedTemplate?.user_id}
          onClose={() => setSelectedTemplate(null)}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          isLoading={isLoadingAction}
        />
      )}
    </>
  );
}
