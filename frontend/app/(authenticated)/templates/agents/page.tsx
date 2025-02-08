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
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const agentTemplates = [
  {
    id: 1,
    name: "Research Analyst",
    description: "An agent specialized in gathering and analyzing information",
    role: "Researcher",
    capabilities: ["Web Search", "Data Analysis", "Report Generation"],
  },
  {
    id: 2,
    name: "Data Engineer",
    description: "Handles data processing and transformation tasks",
    role: "Engineer",
    capabilities: ["ETL", "Data Cleaning", "Schema Design"],
  },
  // Add more templates as needed
];

export default function AgentTemplatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Agent Templates</h1>
          <p className="text-muted-foreground">
            Browse and create agent templates with predefined roles and capabilities
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Agent Template
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
              <Button variant="outline">Edit</Button>
              <Button>Use Template</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
