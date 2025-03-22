import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ProcessType } from "@/utils/api/types";
import { Crew, CrewFormData, AgentRole } from "@/utils/api/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCrewAgents } from "@/hooks/use-crew-agents";
import { useCrewTasks } from "@/hooks/use-crew-tasks";
import { AddCrewAgentModal } from "@/components/modals/add-crew-agent-modal";
import { AddCrewTaskModal } from "@/components/modals/add-crew-task-modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  process: z.nativeEnum(ProcessType),
  verbose: z.boolean().default(true),
  manager_llm_id: z.number().optional(),
  function_calling_llm_id: z.number().optional(),
  planning_llm_id: z.number().optional(),
  config: z.any().optional(),
  max_rpm: z.number().optional(),
  language: z.string().optional(),
  memory: z.boolean().default(true),
  memory_config: z.any().optional(),
  embedder: z.any().optional(),
  full_output: z.boolean().default(false),
  manager_agent: z.number().optional(),
  planning: z.boolean().default(false),
  is_template: z.boolean(),
  is_builtin: z.boolean().default(false),
  template_id: z.number().nullable(),
  template_version: z.number().nullable(),
});

interface CrewFormProps {
  initialData?: Crew;
  onSubmit: (data: CrewFormData) => Promise<void>;
  isTemplate?: boolean;
  submitButtonText?: string;
}

export function CrewForm({
  initialData,
  onSubmit,
  isTemplate = false,
  submitButtonText = "Save",
}: CrewFormProps) {
  const [isAddingAgent, setIsAddingAgent] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { agents, addAgent, removeAgent, updateAgentRole } = useCrewAgents(
    initialData?.crew_agents
  );

  const { tasks, addTask, removeTask, assignAgent, handleAgentRemoval } =
    useCrewTasks(initialData?.crew_tasks, agents);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...initialData,
      is_template: isTemplate,
      is_builtin: false,
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      await onSubmit({
        ...data,
        crew_agents: agents,
        crew_tasks: tasks,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
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
                  <Textarea {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="process"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Process Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select process type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(ProcessType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>

        <Separator />

        {/* Agents Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Agents</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddingAgent(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Agent
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agents.map((agent) => (
                  <TableRow key={agent.agent_id}>
                    <TableCell>{agent.data?.name}</TableCell>
                    <TableCell>
                      <Select
                        value={agent.role}
                        onValueChange={(value) =>
                          updateAgentRole(agent.agent_id, value as AgentRole)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(AgentRole).map((role) => (
                            <SelectItem key={role} value={role}>
                              {role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          removeAgent(agent.agent_id);
                          handleAgentRemoval(agent.agent_id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Tasks Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Tasks</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddingTask(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Assigned Agent</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.task_id}>
                    <TableCell>{task.data?.name}</TableCell>
                    <TableCell>
                      <Select
                        value={task.assigned_agent_id?.toString()}
                        onValueChange={(value) =>
                          assignAgent(task.task_id, parseInt(value))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select agent" />
                        </SelectTrigger>
                        <SelectContent>
                          {agents.map((agent) => (
                            <SelectItem
                              key={agent.agent_id}
                              value={agent.agent_id.toString()}
                            >
                              {agent.data?.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeTask(task.task_id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitButtonText}
        </Button>

        <AddCrewAgentModal
          isOpen={isAddingAgent}
          onClose={() => setIsAddingAgent(false)}
          onAddAgent={addAgent}
        />

        <AddCrewTaskModal
          isOpen={isAddingTask}
          onClose={() => setIsAddingTask(false)}
          onAddTask={addTask}
          crewAgents={agents}
        />
      </form>
    </Form>
  );
}
