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
import { JsonEditor } from "json-edit-react";
import { Agent } from "@/utils/api/types";
import { createTask, getTask, updateTask, getAgents } from "@/utils/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

// Form schema
const taskSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  expected_output: z.string().min(1, "Expected output is required"),
  agent: z.number().min(1, "Agent is required"),
  async_execution: z.boolean().default(false),
  tools: z.any().optional(),
  config: z.any().optional(),
  output_json: z.any().optional(),
  context: z.array(z.number()).optional(),
  is_template: z.boolean().default(false),
  is_builtin: z.boolean().default(false),
  template_id: z.number().optional().nullable(),
  template_version: z.number().optional().nullable(),
});

type FormValues = z.infer<typeof taskSchema>;

interface CreateEditTaskProps {
  id?: string;
}

export default function CreateEditTask({ id }: CreateEditTaskProps) {
  const router = useRouter();
  const isEditing = !!id;
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [agents, setAgents] = useState<Agent[]>([]);

  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      name: "",
      description: "",
      expected_output: "",
      agent: 0,
      async_execution: false,
      tools: {},
      config: {},
      output_json: null,
      context: [],
      is_template: false,
      is_builtin: false,
      template_id: null,
      template_version: null,
    },
  });

  // Fetch agents for dropdown
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const agentsData = await getAgents();
        setAgents(agentsData);
      } catch (error) {
        console.error("Error fetching agents:", error);
        toast.error("Failed to load agents");
      }
    };

    fetchAgents();
  }, []);

  // Fetch task data if editing
  useEffect(() => {
    const fetchTask = async () => {
      if (isEditing) {
        try {
          setInitialLoading(true);
          const taskData = await getTask(parseInt(id));
          
          // Set form values from task data
          form.reset({
            name: taskData.name,
            description: taskData.description,
            expected_output: taskData.expected_output,
            agent: taskData.agent,
            async_execution: taskData.async_execution || false,
            tools: taskData.tools || {},
            config: taskData.config || {},
            output_json: taskData.output_json || null,
            context: taskData.context || [],
            is_template: taskData.is_template || false,
            is_builtin: taskData.is_builtin || false,
            template_id: taskData.template_id || null,
            template_version: taskData.template_version || null,
          });
        } catch (error) {
          console.error("Error fetching task:", error);
          toast.error("Failed to load task");
        } finally {
          setInitialLoading(false);
        }
      }
    };

    fetchTask();
  }, [id, isEditing, form]);

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      
      // Ensure tools and config are objects if they're empty
      const formattedData = {
        ...data,
        tools: data.tools || {},
        config: data.config || {},
      };

      if (isEditing) {
        await updateTask(parseInt(id), formattedData);
        toast.success("Task updated successfully");
      } else {
        await createTask(formattedData);
        toast.success("Task created successfully");
      }
      
      router.push("/templates/tasks");
    } catch (error) {
      console.error("Error saving task:", error);
      toast.error(`Failed to ${isEditing ? "update" : "create"} task`);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading task data...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">
        {isEditing ? "Edit Task" : "Create New Task"}
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Task name" {...field} />
                    </FormControl>
                    <FormDescription>
                      A descriptive name for the task
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
                        placeholder="Task description"
                        {...field}
                        rows={3}
                      />
                    </FormControl>
                    <FormDescription>
                      Describe what this task does
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expected_output"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Output</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Expected output"
                        {...field}
                        rows={3}
                      />
                    </FormControl>
                    <FormDescription>
                      Describe what output is expected from this task
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="agent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agent</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value ? field.value.toString() : undefined}
                      value={field.value ? field.value.toString() : undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an agent" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
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
                      The agent that will execute this task
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="async_execution"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Asynchronous Execution
                      </FormLabel>
                      <FormDescription>
                        Run this task asynchronously
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
                name="is_template"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Template Task
                      </FormLabel>
                      <FormDescription>
                        Mark this task as a template
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

            <div className="space-y-6">
              <FormField
                control={form.control}
                name="tools"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tools</FormLabel>
                    <FormControl>
                      <Card>
                        <CardContent className="p-0 overflow-hidden">
                          <div className="h-[300px] overflow-auto p-4">
                            <JsonEditor
                              data={field.value || {}}
                              onChange={(newData) => {
                                field.onChange(newData.newValue);
                              }}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </FormControl>
                    <FormDescription>
                      Tools configuration in JSON format
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="config"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Configuration</FormLabel>
                    <FormControl>
                      <Card>
                        <CardContent className="p-0 overflow-hidden">
                          <div className="h-[300px] overflow-auto p-4">
                            <JsonEditor
                              data={field.value || {}}
                              onChange={field.onChange}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </FormControl>
                    <FormDescription>
                      Additional configuration in JSON format
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/templates/tasks")}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Update Task" : "Create Task"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
