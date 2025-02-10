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
import { TaskTemplateModal } from "@/components/modals/task-template-modal";

const taskTemplates = [
  {
    id: 1,
    name: "Web Research",
    description: "Conduct comprehensive web research on a given topic",
    expected_output:
      "A detailed report with key findings, sources, and insights",
    async_execution: true,
    tools: ["Web Search", "Data Analysis", "Report Generation"],
    estimatedTime: "30-60 minutes",
    complexity: "Medium" as const,
  },
  {
    id: 2,
    name: "Data Processing",
    description: "Process and transform raw data into a structured format",
    expected_output: "Clean, structured data in the specified format",
    async_execution: true,
    tools: ["ETL", "Data Cleaning", "Schema Design"],
    estimatedTime: "15-30 minutes",
    complexity: "Low" as const,
  },
  {
    id: 3,
    name: "Report Generation",
    description: "Generate a report based on the provided data and findings",
    expected_output:
      "A well-structured report with key insights and recommendations",
    async_execution: false,
    tools: ["Report Generation"],
    estimatedTime: "5-10 minutes",
    complexity: "High" as const,
  },
];

export default function TaskTemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<
    (typeof taskTemplates)[0] | null
  >(null);

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Task Templates</h1>
            <p className="text-muted-foreground">
              Browse and create task templates with predefined configurations
            </p>
          </div>
          <Button asChild>
            <Link href="/templates/tasks/new">
              <Plus className="mr-2 h-4 w-4" />
              New Task Template
            </Link>
          </Button>
        </div>

        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input type="text" placeholder="Search task templates..." />
          <Button variant="secondary" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {taskTemplates.map((template) => (
            <Card key={template.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{template.name}</CardTitle>
                  <Badge
                    variant={
                      template.complexity === "High"
                        ? "destructive"
                        : template.complexity === "Medium"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {template.complexity}
                  </Badge>
                </div>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {template.tools.map((tool) => (
                    <Badge key={tool} variant="outline">
                      {tool}
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
                  <Link href={`/templates/tasks/${template.id}`}>
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

      <TaskTemplateModal
        isOpen={!!selectedTemplate}
        onClose={() => setSelectedTemplate(null)}
        template={selectedTemplate!}
      />
    </>
  );
}
