"use client";

import { useRouter } from "next/navigation";
import { AgentTemplateForm } from "@/components/forms/agent-template-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewAgentTemplatePage() {
  const router = useRouter();

  const onSubmit = async (data: any) => {
    // TODO: Implement create logic with Supabase
    console.log("Creating new agent template:", data);
    router.push("/templates/agents");
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
          <h1 className="text-3xl font-bold">Create Agent Template</h1>
          <p className="text-muted-foreground">
            Create a new agent template with predefined settings
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl">
        <AgentTemplateForm onSubmit={onSubmit} />
      </div>
    </div>
  );
}
