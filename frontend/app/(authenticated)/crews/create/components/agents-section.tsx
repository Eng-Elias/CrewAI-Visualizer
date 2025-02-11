"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "../schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { TooltipProvider, Tooltip, TooltipTrigger } from "@/components/ui/tooltip";

interface AgentsSectionProps {
  form: UseFormReturn<FormValues>;
}

export function AgentsSection({ form }: AgentsSectionProps) {
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openTemplateModal, setOpenTemplateModal] = useState(false);

  const removeAgent = (index: number) => {
    const currentAgents = form.getValues("agents") || [];
    form.setValue(
      "agents",
      currentAgents.filter((_: any, i: number) => i !== index)
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Dialog open={openTemplateModal} onOpenChange={setOpenTemplateModal}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Agent from Template
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl bg-white">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Choose Agent Template</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                      Select from our collection of builtin and pre-created agents
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-3 gap-4 py-4">
                    {[
                      {
                        name: "Researcher",
                        role: "Research Assistant",
                        goal: "Gather and analyze information from various sources",
                        backstory: "An AI agent specialized in conducting thorough research and providing comprehensive insights",
                        tools: ["web_search", "document_analysis", "data_extraction"],
                      },
                      {
                        name: "Writer",
                        role: "Content Creator",
                        goal: "Create high-quality written content",
                        backstory: "A creative AI agent focused on producing engaging and informative content",
                        tools: ["text_generation", "grammar_check", "plagiarism_detection"],
                      },
                      {
                        name: "Analyst",
                        role: "Data Analyst",
                        goal: "Process and analyze data to extract meaningful insights",
                        backstory: "A detail-oriented AI agent skilled in data analysis and visualization",
                        tools: ["data_analysis", "visualization", "statistics"],
                      },
                    ].map((template, index) => (
                      <Card
                        key={index}
                        className="cursor-pointer hover:border-primary bg-card"
                        onClick={() => {
                          const currentAgents = form.getValues("agents") || [];
                          form.setValue("agents", [
                            ...currentAgents,
                            {
                              ...template,
                              memory_enabled: false,
                              verbose: false,
                              allow_delegation: false,
                              max_iterations: 1,
                            },
                          ]);
                          setOpenTemplateModal(false);
                        }}
                      >
                        <CardHeader>
                          <CardTitle className="text-lg font-semibold">{template.name}</CardTitle>
                          <CardDescription className="text-sm text-muted-foreground">
                            {template.role}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="text-sm">
                            <span className="font-medium">Goal:</span>
                            <p className="text-muted-foreground mt-1">{template.goal}</p>
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">Tools:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {template.tools.map((tool, i) => (
                                <span key={i} className="px-2 py-1 bg-muted rounded-md text-xs">
                                  {tool}
                                </span>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </TooltipTrigger>
          </Tooltip>
        </TooltipProvider>

        <Dialog open={openCreateModal} onOpenChange={setOpenCreateModal}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create New Agent
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Create New Agent</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Fill in the details to create a new agent
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const newAgent = {
                  name: formData.get("name") as string,
                  role: formData.get("role") as string,
                  goal: formData.get("goal") as string,
                  backstory: formData.get("backstory") as string,
                  memory_enabled: formData.get("memory_enabled") === "true",
                  verbose: formData.get("verbose") === "true",
                  allow_delegation: formData.get("allow_delegation") === "true",
                  max_iterations: parseInt(formData.get("max_iterations") as string) || 1,
                  max_rpm: parseInt(formData.get("max_rpm") as string) || undefined,
                };
                const currentAgents = form.getValues("agents") || [];
                form.setValue("agents", [...currentAgents, newAgent]);
                setOpenCreateModal(false);
              }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" placeholder="Agent name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" name="role" placeholder="Agent role" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goal">Goal</Label>
                  <Textarea
                    id="goal"
                    name="goal"
                    placeholder="What is the agent's primary goal?"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="backstory">Backstory</Label>
                  <Textarea
                    id="backstory"
                    name="backstory"
                    placeholder="Provide some background context for the agent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="max_iterations">Max Iterations</Label>
                    <Input
                      id="max_iterations"
                      name="max_iterations"
                      type="number"
                      defaultValue={1}
                      min={1}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max_rpm">Max RPM</Label>
                    <Input id="max_rpm" name="max_rpm" type="number" min={1} />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="memory_enabled" name="memory_enabled" />
                    <Label htmlFor="memory_enabled">Memory Enabled</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="verbose" name="verbose" />
                    <Label htmlFor="verbose">Verbose</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="allow_delegation" name="allow_delegation" />
                    <Label htmlFor="allow_delegation">Allow Delegation</Label>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full bg-indigo-500 text-white hover:bg-indigo-600">
                Create Agent
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {form.watch("agents")?.map((agent: any, index: number) => (
          <Card key={index} className="bg-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-lg font-semibold">{agent.name}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  {agent.role}
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive"
                onClick={() => removeAgent(index)}
              >
                Remove
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm">
                <span className="font-medium">Goal:</span>
                <p className="text-muted-foreground mt-1">{agent.goal}</p>
              </div>
              {agent.backstory && (
                <div className="text-sm">
                  <span className="font-medium">Backstory:</span>
                  <p className="text-muted-foreground mt-1">{agent.backstory}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Max Iterations:</span>
                  <p className="text-muted-foreground mt-1">{agent.max_iterations}</p>
                </div>
                {agent.max_rpm && (
                  <div>
                    <span className="font-medium">Max RPM:</span>
                    <p className="text-muted-foreground mt-1">{agent.max_rpm}</p>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Memory:</span>
                  <span className="text-muted-foreground">
                    {agent.memory_enabled ? "Enabled" : "Disabled"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Verbose:</span>
                  <span className="text-muted-foreground">
                    {agent.verbose ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Delegation:</span>
                  <span className="text-muted-foreground">
                    {agent.allow_delegation ? "Allowed" : "Not Allowed"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
