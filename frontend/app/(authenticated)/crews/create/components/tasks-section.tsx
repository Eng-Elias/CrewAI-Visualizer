"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface TasksSectionProps {
  form: UseFormReturn<FormValues>;
}

function SortableTask({
  task,
  index,
  removeTask,
  form,
}: {
  task: any;
  index: number;
  removeTask: (index: number) => void;
  form: UseFormReturn<FormValues>;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: task.id ?? index,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card ref={setNodeRef} style={style} className="bg-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-4">
          <div {...attributes} {...listeners} className="cursor-move">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-muted-foreground"
            >
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">{task.name}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              {task.description}
            </CardDescription>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive"
          onClick={() => removeTask(index)}
        >
          Remove
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm">
          <span className="font-medium">Expected Output:</span>
          <p className="text-muted-foreground mt-1">{task.expected_output}</p>
        </div>
        <div className="text-sm">
          <span className="font-medium">Tools:</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {task.tools.map((tool: string, i: number) => (
              <span key={i} className="px-2 py-1 bg-muted rounded-md text-xs">
                {tool}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center text-sm">
          <span className="font-medium mr-2">Async:</span>
          {task.async_execution ? "Yes" : "No"}
        </div>
      </CardContent>
    </Card>
  );
}

export function TasksSection({ form }: TasksSectionProps) {
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openTemplateModal, setOpenTemplateModal] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getNextTaskId = () => {
    const tasks = form.getValues("tasks") || [];
    const maxId = tasks.reduce((max, task) => Math.max(max, task.id || 0), 0);
    return maxId + 1;
  };

  const addTask = (taskData: any) => {
    const currentTasks = form.getValues("tasks") || [];
    const newTask = {
      ...taskData,
      id: getNextTaskId(),
    };
    form.setValue("tasks", [...currentTasks, newTask]);
  };

  const removeTask = (index: number) => {
    const currentTasks = form.getValues("tasks") || [];
    form.setValue(
      "tasks",
      currentTasks.filter((_: any, i: number) => i !== index)
    );
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = form
        .getValues("tasks")
        .findIndex((task, index) => task.id === active.id || index === active.id);
      const newIndex = form
        .getValues("tasks")
        .findIndex((task, index) => task.id === over.id || index === over.id);

      const tasks = arrayMove(form.getValues("tasks"), oldIndex, newIndex);
      form.setValue("tasks", tasks);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Dialog open={openTemplateModal} onOpenChange={setOpenTemplateModal}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add Task from Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl bg-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Choose Task Template</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Select from our collection of builtin and pre-created tasks
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-3 gap-4 py-4">
              {[
                {
                  name: "Web Research",
                  description: "Research a specific topic on the web",
                  expected_output: "Comprehensive research report with key findings and sources",
                  tools: ["web_search", "web_scraping", "summarization"],
                  async_execution: false,
                },
                {
                  name: "Data Analysis",
                  description: "Analyze data and generate insights",
                  expected_output: "Data analysis report with visualizations and key metrics",
                  tools: ["data_analysis", "visualization", "statistics"],
                  async_execution: true,
                },
                {
                  name: "Content Generation",
                  description: "Generate high-quality content based on provided topic",
                  expected_output: "Well-structured content piece with proper formatting",
                  tools: ["text_generation", "grammar_check", "plagiarism_detection"],
                  async_execution: false,
                },
              ].map((template, index) => (
                <Card
                  key={index}
                  className="cursor-pointer hover:border-primary bg-card"
                  onClick={() => {
                    addTask(template);
                    setOpenTemplateModal(false);
                  }}
                >
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">{template.name}</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      {template.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-sm">
                      <span className="font-medium">Expected Output:</span>
                      <p className="text-muted-foreground mt-1">{template.expected_output}</p>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Tools:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {template.tools.map((tool, i) => (
                          <span key={i} className="px-2 py-1 bg-muted rounded-md text-xs">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="font-medium mr-2">Async:</span>
                      {template.async_execution ? "Yes" : "No"}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={openCreateModal} onOpenChange={setOpenCreateModal}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Create New Task</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Fill in the details to create a new task
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const newTask = {
                  name: formData.get("name") as string,
                  description: formData.get("description") as string,
                  expected_output: formData.get("expected_output") as string,
                  tools: (formData.get("tools") as string).split(",").map(t => t.trim()),
                  async_execution: formData.get("async_execution") === "true",
                };
                addTask(newTask);
                setOpenCreateModal(false);
              }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" placeholder="Task name" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="What does this task do?"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expected_output">Expected Output</Label>
                  <Textarea
                    id="expected_output"
                    name="expected_output"
                    placeholder="What should this task produce?"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tools">Tools</Label>
                  <Input
                    id="tools"
                    name="tools"
                    placeholder="Comma-separated list of tools"
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="async_execution" name="async_execution" />
                  <Label htmlFor="async_execution">Async Execution</Label>
                </div>
              </div>

              <Button type="submit" className="w-full bg-indigo-500 text-white hover:bg-indigo-600">
                Create Task
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Sortable Tasks List */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={form.watch("tasks")?.map((task, index) => ({ ...task, id: task.id ?? index })) || []}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {form.watch("tasks")?.map((task: any, index: number) => (
              <SortableTask
                key={task.id || index}
                task={task}
                index={index}
                removeTask={removeTask}
                form={form}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
