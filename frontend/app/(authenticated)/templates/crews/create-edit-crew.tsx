"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Agent,
  AgentRole,
  Crew,
  CrewAgent,
  CrewFormData,
  CrewTask,
  Task,
} from "@/utils/api/types";
import { createCrew, getCrew, updateCrew } from "@/utils/api/crew-api";
import { getAgents } from "@/utils/api/agent-api";
import { getTasks } from "@/utils/api/task-api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Plus, Trash2 } from "lucide-react";

// Define the form schema
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  process: z.string().optional(),
  verbose: z.boolean().default(true),
  manager_llm_id: z.number().optional(),
  function_calling_llm_id: z.number().optional(),
  config: z.any().optional(),
  max_rpm: z.number().optional(),
  language: z.string().optional(),
  memory: z.boolean().default(false),
  memory_config: z.any().optional(),
  embedder: z.any().optional(),
  full_output: z.boolean().default(false),
  manager_agent: z.number().optional(),
  planning: z.boolean().default(false),
  planning_llm_id: z.number().optional(),
  is_template: z.boolean().default(false),
  is_builtin: z.boolean().default(false),
  template_id: z.number().nullable().optional(),
  template_version: z.number().nullable().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateEditCrewProps {
  crewId?: number;
  isTemplate?: boolean;
}

export function CreateEditCrew({
  crewId,
  isTemplate = false,
}: CreateEditCrewProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedAgents, setSelectedAgents] = useState<CrewAgent[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<CrewTask[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<number | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [agentRole, setAgentRole] = useState<AgentRole | null>(null);

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      process: "",
      verbose: true,
      manager_llm_id: undefined,
      function_calling_llm_id: undefined,
      config: {},
      max_rpm: undefined,
      language: "",
      memory: false,
      memory_config: {},
      embedder: {},
      full_output: false,
      manager_agent: undefined,
      planning: false,
      planning_llm_id: undefined,
      is_template: isTemplate,
      is_builtin: false,
      template_id: null,
      template_version: null,
    },
  });

  // Fetch agents and tasks on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [agentsData, tasksData] = await Promise.all([
          getAgents(),
          getTasks(),
        ]);
        setAgents(agentsData);
        setTasks(tasksData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch agents and tasks. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Fetch crew data if editing an existing crew
  useEffect(() => {
    const fetchCrew = async () => {
      if (!crewId) return;

      try {
        setIsLoading(true);
        const crew = await getCrew(crewId);

        // Set form values
        form.reset({
          name: crew.name,
          description: crew.description,
          process: crew.process || "",
          verbose: crew.verbose,
          manager_llm_id: crew.manager_llm_id || undefined,
          function_calling_llm_id: crew.function_calling_llm_id || undefined,
          planning_llm_id: crew.planning_llm_id || undefined,
          config: crew.config || {},
          max_rpm: crew.max_rpm,
          language: crew.language || "",
          memory: crew.memory || false,
          memory_config: crew.memory_config || {},
          embedder: crew.embedder || {},
          full_output: crew.full_output || false,
          manager_agent: crew.manager_agent,
          planning: crew.planning || false,
          is_template: crew.is_template,
          is_builtin: crew.is_builtin,
        });

        // Set selected agents and tasks
        if (crew.crew_agents) {
          setSelectedAgents(
            crew.crew_agents.map((agent) => ({
              agent_id: agent.agent_id,
              order: agent.agent_order,
              role: agent.role,
            }))
          );
        }

        if (crew.crew_tasks) {
          setSelectedTasks(
            crew.crew_tasks.map((task) => ({
              task_id: task.task_id,
              order: task.task_order,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching crew:", error);
        toast({
          title: "Error",
          description: "Failed to fetch crew data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCrew();
  }, [crewId, form, toast]);

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    try {
      setIsSaving(true);

      // Prepare crew data
      const crewData: CrewFormData = {
        ...values,
        crew_agents: selectedAgents,
        crew_tasks: selectedTasks,
      };

      let result: Crew;
      if (crewId) {
        // Update existing crew
        result = await updateCrew(crewId, crewData);
        toast({
          title: "Success",
          description: "Crew updated successfully",
        });
      } else {
        // Create new crew
        result = await createCrew(crewData);
        console.log(result);
        toast({
          title: "Success",
          description: "Crew created successfully",
        });
      }

      // Redirect to crews page
      router.push("/templates/crews");
      router.refresh();
    } catch (error) {
      console.error("Error saving crew:", error);
      toast({
        title: "Error",
        description: "Failed to save crew. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle adding an agent to the crew
  const handleAddAgent = () => {
    if (!selectedAgentId || !agentRole) return;

    // Check if agent is already added
    if (selectedAgents.some((a) => a.agent_id === selectedAgentId)) {
      toast({
        title: "Error",
        description: "This agent is already added to the crew",
        variant: "destructive",
      });
      return;
    }

    // Add agent to selected agents
    setSelectedAgents([
      ...selectedAgents,
      {
        agent_id: selectedAgentId,
        agent_order: selectedAgents.length + 1,
        role: agentRole,
      },
    ]);

    // Reset selection
    setSelectedAgentId(null);
    setAgentRole(null);
  };

  // Handle removing an agent from the crew
  const handleRemoveAgent = (agentId: number) => {
    setSelectedAgents(selectedAgents.filter((a) => a.agent_id !== agentId));
  };

  // Handle adding a task to the crew
  const handleAddTask = () => {
    if (!selectedTaskId) return;

    // Check if task is already added
    if (selectedTasks.some((t) => t.task_id === selectedTaskId)) {
      toast({
        title: "Error",
        description: "This task is already added to the crew",
        variant: "destructive",
      });
      return;
    }

    // Add task to selected tasks
    setSelectedTasks([
      ...selectedTasks,
      {
        task_id: selectedTaskId,
        task_order: selectedTasks.length + 1,
      },
    ]);

    // Reset selection
    setSelectedTaskId(null);
  };

  // Handle removing a task from the crew
  const handleRemoveTask = (taskId: number) => {
    setSelectedTasks(selectedTasks.filter((t) => t.task_id !== taskId));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          {crewId ? "Edit Crew" : "Create Crew"}
        </h1>
        <p className="text-muted-foreground">
          {crewId
            ? "Update the crew's details, agents, and tasks"
            : "Create a new crew with agents and tasks"}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Information</TabsTrigger>
              <TabsTrigger value="agents">Agents</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic" className="space-y-4">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter crew name" {...field} />
                        </FormControl>
                        <FormDescription>
                          A descriptive name for your crew
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter crew description"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          A brief description of what this crew does
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="process"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Process</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter crew process"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          The process this crew follows to accomplish its tasks
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* <FormField
                    control={form.control}
                    name="is_template"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Template</FormLabel>
                          <FormDescription>
                            Mark this crew as a template for reuse
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  /> */}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Agents Tab */}
            <TabsContent value="agents" className="space-y-4">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-end gap-4">
                    <div className="flex-1">
                      <FormLabel>Agent</FormLabel>
                      <Select
                        value={selectedAgentId?.toString() || "none"}
                        onValueChange={(value) =>
                          setSelectedAgentId(
                            value !== "none" ? parseInt(value) : null
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select an agent" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {agents.map((agent) => (
                            <SelectItem
                              key={agent.id}
                              value={agent.id.toString()}
                            >
                              {agent.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex-1">
                      <FormLabel>Role</FormLabel>
                      <Input
                        placeholder="Enter agent role"
                        value={agentRole || ""}
                        onChange={(e) =>
                          setAgentRole(e.target.value as AgentRole)
                        }
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={handleAddAgent}
                      disabled={!selectedAgentId || !agentRole}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Agent
                    </Button>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium mb-2">Selected Agents</h3>
                    {selectedAgents.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No agents added to this crew yet
                      </p>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Order</TableHead>
                            <TableHead>Agent</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedAgents.map((selectedAgent) => {
                            const agent = agents.find(
                              (a) => a.id === selectedAgent.agent_id
                            );
                            return (
                              <TableRow key={selectedAgent.agent_id}>
                                <TableCell>
                                  {selectedAgent.agent_order}
                                </TableCell>
                                <TableCell>
                                  {agent?.name || "Unknown"}
                                </TableCell>
                                <TableCell>
                                  <Badge>{selectedAgent.role}</Badge>
                                </TableCell>
                                <TableCell>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      handleRemoveAgent(selectedAgent.agent_id)
                                    }
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name="manager_agent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Manager Agent</FormLabel>
                        <Select
                          value={field.value?.toString() || "none"}
                          onValueChange={(value) =>
                            field.onChange(
                              value !== "none" ? parseInt(value) : undefined
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select manager agent (optional)" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {agents.map((agent) => (
                              <SelectItem
                                key={agent.id}
                                value={agent.id.toString()}
                              >
                                {agent.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Optional manager agent for this crew
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tasks Tab */}
            <TabsContent value="tasks" className="space-y-4">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-end gap-4">
                    <div className="flex-1">
                      <FormLabel>Task</FormLabel>
                      <Select
                        value={selectedTaskId?.toString() || "none"}
                        onValueChange={(value) =>
                          setSelectedTaskId(
                            value !== "none" ? parseInt(value) : null
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a task" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {tasks.map((task) => (
                            <SelectItem
                              key={task.id}
                              value={task.id.toString()}
                            >
                              {task.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      type="button"
                      onClick={handleAddTask}
                      disabled={!selectedTaskId}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Task
                    </Button>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium mb-2">Selected Tasks</h3>
                    {selectedTasks.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No tasks added to this crew yet
                      </p>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Order</TableHead>
                            <TableHead>Task</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedTasks.map((selectedTask) => {
                            const task = tasks.find(
                              (t) => t.id === selectedTask.task_id
                            );
                            return (
                              <TableRow key={selectedTask.task_id}>
                                <TableCell>{selectedTask.task_order}</TableCell>
                                <TableCell>{task?.name || "Unknown"}</TableCell>
                                <TableCell className="max-w-[200px] truncate">
                                  {task?.description || "No description"}
                                </TableCell>
                                <TableCell>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      handleRemoveTask(selectedTask.task_id)
                                    }
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Advanced Settings Tab */}
            <TabsContent value="advanced" className="space-y-4">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="verbose"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Verbose</FormLabel>
                            <FormDescription>
                              Enable verbose output for this crew
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="memory"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Memory</FormLabel>
                            <FormDescription>
                              Enable memory for this crew
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="planning"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Planning</FormLabel>
                            <FormDescription>
                              Enable planning for this crew
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="full_output"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Full Output</FormLabel>
                            <FormDescription>
                              Enable full output for this crew
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="manager_llm_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Manager LLM</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter manager LLM" {...field} />
                        </FormControl>
                        <FormDescription>
                          LLM to use for the manager
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="function_calling_llm_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Function Calling LLM</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter function calling LLM"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          LLM to use for function calling
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="planning_llm_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Planning LLM</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter planning LLM" {...field} />
                        </FormControl>
                        <FormDescription>
                          LLM to use for planning
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Language</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter language" {...field} />
                        </FormControl>
                        <FormDescription>
                          Language for the crew to use
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
                        <FormLabel>Max RPM</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter max RPM"
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(
                                value ? parseInt(value) : undefined
                              );
                            }}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormDescription>
                          Maximum requests per minute
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/templates/crews")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Crew"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
