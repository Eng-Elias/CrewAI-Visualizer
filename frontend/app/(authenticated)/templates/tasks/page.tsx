"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { TaskCard } from "@/components/cards/task/task-card";
import { TaskModal } from "@/components/modals/task/task-modal";
import { NewTaskModal } from "@/components/modals/task/new-task-modal";
import { useTaskTemplates } from "@/hooks/use-task-templates";
import { Task, TaskCreateDto, TaskUpdateDto } from "@/utils/api/types";
import { useAuth } from "@/lib/auth/provider";
import { ToastUtils } from "@/utils/ui/toast-utils";

export default function TaskTemplatesPage() {
  const { user } = useAuth();

  const {
    templates,
    isLoading,
    error,
    createTemplate,
    updateTemplate,
    deleteTemplate,
  } = useTaskTemplates();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<Task | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isLoadingAction, setIsLoadingAction] = useState(false);

  const handleCreate = async (data: TaskCreateDto) => {
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

  const handleUpdate = async (data: TaskUpdateDto) => {
    if (!selectedTemplate) return;
    try {
      setIsLoadingAction(true);
      await updateTemplate(selectedTemplate.id, data);
      setSelectedTemplate(null);
    } catch (error) {
      console.error("Failed to update template:", error);
      ToastUtils.error("Failed to update task template");
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
      ToastUtils.error("Failed to delete task template");
    } finally {
      setIsLoadingAction(false);
    }
  };

  const filteredTemplates = searchQuery
    ? templates.filter(
        (template) =>
          template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          template.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : templates;

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Task Templates</h1>
            <p className="text-muted-foreground">
              Browse and create task templates with predefined descriptions and
              expected outputs
            </p>
          </div>
          <Button onClick={() => setIsNewModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Task Template
          </Button>
        </div>

        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            type="text"
            placeholder="Search task templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button variant="secondary" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-lg text-gray-500">Loading task templates...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-lg text-red-500">{error}</p>
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-64 space-y-4">
            <p className="text-lg text-gray-500">
              {searchQuery
                ? "No matching task templates found"
                : "No task templates found"}
            </p>
            <Button onClick={() => setIsNewModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Task Template
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map((template: Task) => (
              <TaskCard
                key={template.id}
                task={template}
                onButtonClick={() => setSelectedTemplate(template)}
                isLoading={isLoadingAction}
              />
            ))}
          </div>
        )}
      </div>

      <NewTaskModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onCreate={handleCreate}
        isLoading={isLoadingAction}
      />

      {selectedTemplate && (
        <TaskModal
          task={selectedTemplate}
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
