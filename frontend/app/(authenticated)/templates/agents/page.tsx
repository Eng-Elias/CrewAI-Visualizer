"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Pencil, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import { AgentTemplateModal } from "@/components/modals/agent-template-modal";

const agentTemplates = [
  {
    id: 1,
    name: "Research Analyst",
    description: "An agent specialized in gathering and analyzing information",
    role: "Researcher",
    goal: "To efficiently gather, analyze, and synthesize information from various sources",
    backstory: "You are an experienced research analyst with expertise in data gathering and analysis...",
    memory_enabled: true,
    verbose: false,
    allow_delegation: true,
    max_iterations: 5,
    capabilities: ["Web Search", "Data Analysis", "Report Generation"],
    tools: ["Web Search", "Data Analysis", "Report Generation"],
  },
  {
    id: 2,
    name: "Data Engineer",
    description: "Handles data processing and transformation tasks",
    role: "Engineer",
    goal: "To process and transform data efficiently while maintaining data quality",
    memory_enabled: true,
    verbose: true,
    allow_delegation: false,
    max_iterations: 3,
    capabilities: ["ETL", "Data Cleaning", "Schema Design"],
    tools: ["ETL", "Data Cleaning", "Schema Design"],
  },
];

export default function AgentTemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<typeof agentTemplates[0] | null>(
    null
  );

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Agent Templates</h1>
            <p className="text-muted-foreground">
              Browse and create agent templates with predefined roles and capabilities
            </p>
          </div>
          <Button asChild>
            <Link href="/templates/agents/new">
              <Plus className="mr-2 h-4 w-4" />
              New Agent Template
            </Link>
          </Button>
        </div>

        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input type="text" placeholder="Search agent templates..." />
          <Button variant="secondary" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {agentTemplates.map((template) => (
            <Card key={template.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{template.name}</CardTitle>
                  <Badge variant="secondary">{template.role}</Badge>
                </div>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {template.capabilities.map((capability) => (
                    <Badge key={capability} variant="outline">
                      {capability}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedTemplate(template)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="outline" asChild>
                  <Link href={`/templates/agents/${template.id}`}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </Button>
                <Button>Use Template</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <AgentTemplateModal
        isOpen={!!selectedTemplate}
        onClose={() => setSelectedTemplate(null)}
        template={selectedTemplate!}
      />
    </>
  );
}
