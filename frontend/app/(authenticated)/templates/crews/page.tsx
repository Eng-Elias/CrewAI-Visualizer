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
import { Plus, Search, Pencil, Eye, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import { CrewTemplateModal } from "@/components/modals/crew-template-modal";

const crewTemplates = [
  {
    id: 1,
    name: "Research Team",
    description: "A crew specialized in gathering and analyzing information",
    agents: [
      {
        name: "Research Analyst",
        role: "Researcher",
      },
      {
        name: "Data Engineer",
        role: "Engineer",
      },
      {
        name: "Report Writer",
        role: "Writer",
      },
    ],
    tasks: [
      {
        name: "Web Research",
        description: "Gather information from various web sources",
      },
      {
        name: "Data Processing",
        description: "Clean and structure the collected data",
      },
      {
        name: "Report Generation",
        description: "Create a comprehensive report with findings",
      },
    ],
  },
  {
    id: 2,
    name: "Data Processing Team",
    description: "A crew focused on data transformation and analysis",
    agents: [
      {
        name: "Data Engineer",
        role: "Engineer",
      },
      {
        name: "Data Analyst",
        role: "Analyst",
      },
    ],
    tasks: [
      {
        name: "Data Extraction",
        description: "Extract data from various sources",
      },
      {
        name: "Data Transformation",
        description: "Transform data into the required format",
      },
    ],
  },
];

export default function CrewTemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<typeof crewTemplates[0] | null>(
    null
  );

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Crew Templates</h1>
            <p className="text-muted-foreground">
              Browse and create crew templates with predefined agents and tasks
            </p>
          </div>
          <Button asChild>
            <Link href="/templates/crews/new">
              <Plus className="mr-2 h-4 w-4" />
              New Crew Template
            </Link>
          </Button>
        </div>

        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input type="text" placeholder="Search crew templates..." />
          <Button variant="secondary" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {crewTemplates.map((template) => (
            <Card key={template.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{template.name}</CardTitle>
                  <Badge variant="secondary">
                    <Users className="mr-2 h-4 w-4" />
                    {template.agents.length} Agents
                  </Badge>
                </div>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {template.agents.map((agent) => (
                    <Badge key={agent.name} variant="outline">
                      {agent.role}
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
                  <Link href={`/templates/crews/${template.id}`}>
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

      <CrewTemplateModal
        isOpen={!!selectedTemplate}
        onClose={() => setSelectedTemplate(null)}
        template={selectedTemplate!}
      />
    </>
  );
}
