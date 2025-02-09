"use client";

import { useRouter } from "next/navigation";
import { TaskTemplateForm } from "@/components/forms/task-template-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ViewTaskTemplatePage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();

  // TODO: Fetch task data from Supabase using the id
  const mockTaskData = {
    name: "Web Research Task",
    description: "Research and gather information about a specific topic",
    expected_output: "A comprehensive report containing the findings",
    async_execution: false,
    tools: [],
    config: {},
  };

  const onSubmit = async (data: any) => {
    // TODO: Implement update logic with Supabase
    console.log("Updating task template:", data);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/templates/tasks">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Task Template</h1>
          <p className="text-muted-foreground">
            Modify the task template settings
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl">
        <TaskTemplateForm
          initialData={mockTaskData}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}
