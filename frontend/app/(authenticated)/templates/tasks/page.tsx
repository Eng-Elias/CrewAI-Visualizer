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
import { Plus, Search, Clock, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const taskTemplates = [
  {
    id: 1,
    name: "Web Research Task",
    description: "Template for web-based research and data gathering",
    estimatedTime: "30-45 min",
    complexity: "Medium",
    tools: ["Web Search", "Data Extraction"],
  },
  {
    id: 2,
    name: "Data Analysis Task",
    description: "Template for analyzing and processing collected data",
    estimatedTime: "1-2 hours",
    complexity: "High",
    tools: ["Data Processing", "Visualization"],
  },
  // Add more templates as needed
];

export default function TaskTemplatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Task Templates</h1>
          <p className="text-muted-foreground">
            Manage and create task templates for your crews and agents
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
            <CardContent className="space-y-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="mr-2 h-4 w-4" />
                {template.estimatedTime}
              </div>
              <div className="flex flex-wrap gap-2">
                {template.tools.map((tool) => (
                  <Badge key={tool} variant="outline">
                    {tool}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
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
  );
}
