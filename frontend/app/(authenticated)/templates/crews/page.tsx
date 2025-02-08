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
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const crewTemplates = [
  {
    id: 1,
    name: "Basic Research Crew",
    description: "A crew setup for basic research tasks with analyst and researcher agents",
    agents: 2,
    tasks: 3,
  },
  {
    id: 2,
    name: "Data Processing Crew",
    description: "Specialized crew for ETL and data processing workflows",
    agents: 3,
    tasks: 5,
  },
  // Add more templates as needed
];

export default function CrewTemplatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Crew Templates</h1>
          <p className="text-muted-foreground">
            Manage and create crew templates for your projects
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Template
        </Button>
      </div>

      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input type="text" placeholder="Search templates..." />
        <Button variant="secondary" size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {crewTemplates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <CardTitle>{template.name}</CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-sm">
                <span>Agents: {template.agents}</span>
                <span>Tasks: {template.tasks}</span>
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
