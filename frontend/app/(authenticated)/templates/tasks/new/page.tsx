"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import CreateEditTask from "../create-edit-task";

export default function NewTaskPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/templates/tasks">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create New Task</h1>
          <p className="text-muted-foreground">
            Create a new task for your agents to execute
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl">
        <CreateEditTask />
      </div>
    </div>
  );
}
