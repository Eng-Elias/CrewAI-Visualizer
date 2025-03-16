"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import CreateEditAgent from "../create-edit-agent";
import { use } from "react";

// Use a server component to extract the ID
export default function ViewAgentTemplatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/templates/agents">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <CreateEditAgent id={resolvedParams.id} />
    </div>
  );
}
