"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { JsonEditor } from "json-edit-react";
import { AgentFormData } from "@/utils/api/types";
import { createAgent, getAgent, updateAgent } from "@/utils/api";

// Form schema
const agentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  goal: z.string().min(1, "Goal is required"),
  backstory: z.string().optional(),
  memory_enabled: z.boolean().default(true),
  verbose: z.boolean().default(false),
  allow_delegation: z.boolean().default(true),
  max_iterations: z.number().min(1).default(5),
  max_rpm: z
    .union([z.number().min(0), z.undefined(), z.null()])
    .optional()
    .transform((val) => (val === null ? undefined : val)),
  tools: z.record(z.any()).optional(),
  llm_config: z.record(z.any()).optional(),
});

type FormValues = z.infer<typeof agentSchema>;

interface CreateEditAgentProps {
  id?: string;
}

export default function CreateEditAgent({ id }: CreateEditAgentProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!id;

  const form = useForm<FormValues>({
    resolver: zodResolver(agentSchema),
    defaultValues: {
      name: "",
      role: "",
      goal: "",
      backstory: "",
      memory_enabled: true,
      verbose: false,
      allow_delegation: true,
      max_iterations: 5,
      max_rpm: undefined,
      tools: {},
      llm_config: {},
    },
  });

  useEffect(() => {
    if (isEditing) {
      const fetchAgent = async () => {
        try {
          setIsLoading(true);
          // Ensure id is properly parsed as an integer
          const agentId = typeof id === "string" ? parseInt(id, 10) : id;
          const agent = await getAgent(agentId);
          form.reset({
            name: agent.name,
            role: agent.role,
            goal: agent.goal,
            backstory: agent.backstory || "",
            memory_enabled: agent.memory_enabled,
            verbose: agent.verbose,
            allow_delegation: agent.allow_delegation,
            max_iterations: agent.max_iterations,
            max_rpm: agent.max_rpm,
            tools: agent.tools || {},
            llm_config: agent.llm_config || {},
          });
        } catch (error) {
          console.error("Failed to fetch agent:", error);
          toast.error(
            "Failed to load agent. Please check your connection and authentication."
          );
          router.push("/templates/agents");
        } finally {
          setIsLoading(false);
        }
      };

      fetchAgent();
    }
  }, [id, isEditing, form, router]);

  const onSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true);

      const agentData: AgentFormData = {
        name: data.name,
        role: data.role,
        goal: data.goal,
        backstory: data.backstory || undefined,
        memory_enabled: data.memory_enabled,
        verbose: data.verbose,
        allow_delegation: data.allow_delegation,
        max_iterations: data.max_iterations,
        max_rpm: data.max_rpm === null ? undefined : data.max_rpm,
        tools: data.tools || {},
        llm_config: data.llm_config || {},
      };

      console.log("Submitting agent data:", agentData);

      if (isEditing) {
        await updateAgent(parseInt(id, 10), agentData);
        toast.success("Agent updated successfully");
      } else {
        await createAgent(agentData);
        toast.success("Agent created successfully");
      }

      router.push("/templates/agents");
    } catch (error) {
      console.error("Failed to save agent:", error);
      toast.error(
        `Failed to ${
          isEditing ? "update" : "create"
        } agent. Please check your input and try again.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          {isEditing ? "Edit" : "Create"} Agent Template
        </h1>
        <p className="text-muted-foreground">
          {isEditing
            ? "Update the details of your agent template"
            : "Configure a new agent template for your crew"}
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-gray-500">Loading...</p>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Research Analyst" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <FormControl>
                            <Input placeholder="Researcher" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="goal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Goal</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="To efficiently gather, analyze, and synthesize information from various sources"
                            className="min-h-24"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="backstory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Backstory (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="You are an experienced research analyst with expertise in data gathering and analysis..."
                            className="min-h-32"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Provide context and background for the agent to better
                          understand its role
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Configuration</h2>
                <div className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="memory_enabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Memory Enabled
                            </FormLabel>
                            <FormDescription>
                              Allow the agent to remember previous interactions
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="verbose"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Verbose Mode
                            </FormLabel>
                            <FormDescription>
                              Enable detailed logging of agent activities
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="allow_delegation"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Allow Delegation
                            </FormLabel>
                            <FormDescription>
                              Allow the agent to delegate tasks to other agents
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="max_iterations"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Iterations</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={1}
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value) || 1)
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            Maximum number of iterations the agent can perform
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="max_rpm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max RPM (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              placeholder="Optional"
                              {...field}
                              value={
                                field.value === undefined ||
                                field.value === null
                                  ? ""
                                  : field.value
                              }
                              onChange={(e) => {
                                const value =
                                  e.target.value === ""
                                    ? undefined
                                    : parseInt(e.target.value);
                                field.onChange(value);
                              }}
                            />
                          </FormControl>
                          <FormDescription>
                            Maximum requests per minute
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">
                  Advanced Configuration
                </h2>
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="tools"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tools Configuration</FormLabel>
                        <FormControl>
                          <div className="border rounded-md p-4 bg-secondary">
                            <JsonEditor
                              data={field.value || {}}
                              setData={(newValue) => field.onChange(newValue)}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Configure the tools available to this agent
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="llm_config"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LLM Configuration</FormLabel>
                        <FormControl>
                          <div className="border rounded-md p-4 bg-secondary">
                            <JsonEditor
                              data={field.value || {}}
                              setData={(newValue) => field.onChange(newValue)}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Configure the language model settings for this agent
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/templates/agents")}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isEditing ? "Update" : "Create"} Agent
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
