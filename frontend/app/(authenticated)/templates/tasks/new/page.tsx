"use client";

import { useRouter } from "next/navigation";
import { TaskTemplateForm } from "@/components/forms/task-template-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewTaskTemplatePage() {
  const router = useRouter();

  const onSubmit = async (data: any) => {
    // TODO: Implement create logic with Supabase
    console.log("Creating new task template:", data);
    router.push("/templates/tasks");
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
          <h1 className="text-3xl font-bold">Create Task Template</h1>
          <p className="text-muted-foreground">
            Create a new task template with predefined settings
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl">
        <TaskTemplateForm onSubmit={onSubmit} />
      </div>
    </div>
  );
}
