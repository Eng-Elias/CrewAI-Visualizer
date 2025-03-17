"use client";

import { useEffect, useState } from "react";
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
import { Plus, Search, Pencil, Eye, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AgentTemplateModal } from "@/components/modals/agent-template-modal";
import { Agent } from "@/utils/api/types";
import { deleteAgent, getAgentTemplates } from "@/utils/api/agent-api";

export default function AgentTemplatesPage() {
  const [agentTemplates, setAgentTemplates] = useState<Agent[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Agent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchAgentTemplates = async () => {
      try {
        setIsLoading(true);
        const data = await getAgentTemplates();
        setAgentTemplates(data);
      } catch (error) {
        console.error("Failed to fetch agent templates:", error);
        toast.error(
          "Failed to load agent templates. Please check your connection and authentication."
        );
        setAgentTemplates([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgentTemplates();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteAgent(id);
      setAgentTemplates((prev) => prev.filter((agent) => agent.id !== id));
      toast.success("Agent template deleted successfully");
    } catch (error) {
      console.error("Failed to delete agent template:", error);
      toast.error("Failed to delete agent template");
    }
  };

  const filteredTemplates = searchQuery
    ? agentTemplates.filter(
        (template) =>
          template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          template.role.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : agentTemplates;

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Agent Templates</h1>
            <p className="text-muted-foreground">
              Browse and create agent templates with predefined roles and
              capabilities
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
          <Input
            type="text"
            placeholder="Search agent templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button variant="secondary" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-lg text-gray-500">Loading agent templates...</p>
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-64 space-y-4">
            <p className="text-lg text-gray-500">
              {searchQuery
                ? "No matching agent templates found"
                : "No agent templates found"}
            </p>
            <Button asChild>
              <Link href="/templates/agents/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Agent Template
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{template.name}</CardTitle>
                    <Badge variant="secondary">{template.role}</Badge>
                  </div>
                  <CardDescription>
                    {template.goal.substring(0, 100)}
                    {template.goal.length > 100 ? "..." : ""}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {template.tools &&
                    Object.keys(template.tools).length > 0 ? (
                      Object.keys(template.tools).map((tool) => (
                        <Badge key={tool} variant="outline">
                          {tool}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        No tools configured
                      </span>
                    )}
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
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete the agent template &quot;
                          {template.name}&quot;. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(template.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <Button>Use Template</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AgentTemplateModal
        isOpen={!!selectedTemplate}
        onClose={() => setSelectedTemplate(null)}
        template={selectedTemplate!}
      />
    </>
  );
}
