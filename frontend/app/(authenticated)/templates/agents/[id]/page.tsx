"use client";

import { useRouter } from "next/navigation";
import { AgentTemplateForm } from "@/components/forms/agent-template-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ViewAgentTemplatePage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();

  // TODO: Fetch agent data from Supabase using the id
  const mockAgentData = {
    name: "Research Assistant",
    role: "Researcher",
    goal: "To gather and analyze information efficiently",
    backstory: "You are an experienced research assistant...",
    memory_enabled: true,
    verbose: false,
    allow_delegation: false,
    max_iterations: 1,
  };

  const onSubmit = async (data: any) => {
    // TODO: Implement update logic with Supabase
    console.log("Updating agent template:", data);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/templates/agents">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Agent Template</h1>
          <p className="text-muted-foreground">
            Modify the agent template settings
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl">
        <AgentTemplateForm
          initialData={mockAgentData}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}
