"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Plus, GripVertical, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const agentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  goal: z.string().min(1, "Goal is required"),
  backstory: z.string().min(1, "Backstory is required"),
  memory_enabled: z.boolean(),
  verbose: z.boolean(),
  allow_delegation: z.boolean(),
  max_iterations: z.number().min(1, "Max iterations must be at least 1"),
  max_rpm: z.number().min(1, "Max RPM must be at least 1").optional(),
});

const taskSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
});

const formSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Name is required"),
  process: z.enum(["sequential", "hierarchical"]),
  verbose: z.boolean(),
  manager_llm: z.string().min(1, "Manager LLM is required"),
  function_calling_llm: z.string().min(1, "Function Calling LLM is required"),
  max_rpm: z.number().min(1, "Max RPM must be at least 1"),
  language: z.string().min(1, "Language is required"),
  memory: z.boolean(),
  planning: z.boolean(),
  planning_llm: z.string().optional(),
  agents: z.array(agentSchema),
  tasks: z.array(taskSchema),
});

const SortableTask = ({
  task,
  index,
  removeTask,
  form,
}: {
  task: any;
  index: number;
  removeTask: (index: number) => void;
  form: any;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id || index });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <Card
      key={index}
      className="border shadow-sm"
      ref={setNodeRef}
      style={style}
    >
      <div className="flex gap-4 items-start p-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="cursor-move hover:bg-muted"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </Button>
        <div className="flex-1 space-y-4">
          <FormField
            control={form.control}
            name={`tasks.${index}.name`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Task Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`tasks.${index}.description`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => removeTask(index)}
          className="text-destructive hover:text-destructive hover:bg-destructive/20"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

export default function CreateCrewPage() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: 0,
      name: "",
      process: "sequential",
      verbose: false,
      manager_llm: "",
      function_calling_llm: "",
      max_rpm: 10,
      language: "",
      memory: false,
      planning: false,
      agents: [],
      tasks: [],
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = form
        .getValues("tasks")
        .findIndex(
          (task, index) => task.id === active.id || index === active.id
        );
      const newIndex = form
        .getValues("tasks")
        .findIndex((task, index) => task.id === over.id || index === over.id);

      const tasks = arrayMove(form.getValues("tasks"), oldIndex, newIndex);
      form.setValue("tasks", tasks);
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // TODO: Implement crew creation
    router.push("/crews");
  }

  const addAgent = () => {
    const currentAgents = form.getValues("agents") || [];
    form.setValue("agents", [
      ...currentAgents,
      {
        name: "",
        role: "",
        goal: "",
        backstory: "",
        memory_enabled: true,
        verbose: false,
        allow_delegation: false,
        max_iterations: 1,
        max_rpm: undefined,
      },
    ]);
  };

  const removeAgent = (index: number) => {
    const currentAgents = form.getValues("agents") || [];
    form.setValue(
      "agents",
      currentAgents.filter((_: any, i: number) => i !== index)
    );
  };

  const getNextTaskId = () => {
    const tasks = form.getValues("tasks") || [];
    const maxId = tasks.reduce((max, task) => Math.max(max, task.id || 0), 0);
    return maxId + 1;
  };

  const addTask = (taskData: any) => {
    const currentTasks = form.getValues("tasks") || [];
    const newTask = {
      ...taskData,
      id: getNextTaskId(),
    };
    form.setValue("tasks", [...currentTasks, newTask]);
  };

  const removeTask = (index: number) => {
    const currentTasks = form.getValues("tasks") || [];
    form.setValue(
      "tasks",
      currentTasks.filter((_: any, i: number) => i !== index)
    );
  };

  const [openTemplateModal, setOpenTemplateModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openTaskTemplateModal, setOpenTaskTemplateModal] = useState(false);
  const [openCreateTaskModal, setOpenCreateTaskModal] = useState(false);

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/crews")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Create Crew</h1>
      </div>

      <Card className="border-2">
        <CardHeader>
          <CardTitle>Create New Crew</CardTitle>
          <CardDescription>
            Configure your crew&apos;s settings, agents, and tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Crew Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter crew name" {...field} />
                    </FormControl>
                    <FormDescription>
                      A unique name for your crew
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Tabs defaultValue="agents" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8 border-2 p-1 bg-background">
                  <TabsTrigger
                    value="agents"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm data-[state=inactive]:bg-muted/40 data-[state=inactive]:hover:bg-muted/60 font-medium transition-colors"
                  >
                    Agents
                  </TabsTrigger>
                  <TabsTrigger
                    value="tasks"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm data-[state=inactive]:bg-muted/40 data-[state=inactive]:hover:bg-muted/60 font-medium transition-colors"
                  >
                    Tasks
                  </TabsTrigger>
                  <TabsTrigger
                    value="config"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm data-[state=inactive]:bg-muted/40 data-[state=inactive]:hover:bg-muted/60 font-medium transition-colors"
                  >
                    Configuration
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="agents" className="space-y-4">
                  <div className="flex gap-4">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Dialog
                            open={openTemplateModal}
                            onOpenChange={setOpenTemplateModal}
                          >
                            <DialogTrigger asChild>
                              <Button variant="outline">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Agent from Template
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl bg-white">
                              <DialogHeader>
                                <DialogTitle className="text-xl font-bold">
                                  Choose Agent Template
                                </DialogTitle>
                                <DialogDescription className="text-muted-foreground">
                                  Select from our collection of builtin and
                                  pre-created agents
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid grid-cols-3 gap-4 py-4">
                                {[
                                  {
                                    name: "Researcher",
                                    role: "Research Assistant",
                                    goal: "Gather and analyze information from various sources",
                                    backstory:
                                      "An AI agent specialized in conducting thorough research and providing comprehensive insights",
                                    tools: [
                                      "web_search",
                                      "document_analysis",
                                      "data_extraction",
                                    ],
                                  },
                                  {
                                    name: "Writer",
                                    role: "Content Creator",
                                    goal: "Create high-quality written content",
                                    backstory:
                                      "A creative AI agent focused on producing engaging and informative content",
                                    tools: [
                                      "text_generation",
                                      "grammar_check",
                                      "plagiarism_detection",
                                    ],
                                  },
                                  {
                                    name: "Analyst",
                                    role: "Data Analyst",
                                    goal: "Analyze data and provide actionable insights",
                                    backstory:
                                      "A detail-oriented AI agent specialized in data analysis and visualization",
                                    tools: [
                                      "data_analysis",
                                      "visualization",
                                      "statistical_modeling",
                                    ],
                                  },
                                ].map((template, index) => (
                                  <Card
                                    key={index}
                                    className="hover:border-primary bg-card"
                                  >
                                    <CardHeader>
                                      <CardTitle className="text-lg font-semibold">
                                        {template.name}
                                      </CardTitle>
                                      <CardDescription className="text-sm text-muted-foreground">
                                        <div className="space-y-2">
                                          <p>
                                            <span className="font-medium">
                                              Role:
                                            </span>{" "}
                                            {template.role}
                                          </p>
                                          <p>
                                            <span className="font-medium">
                                              Goal:
                                            </span>{" "}
                                            {template.goal}
                                          </p>
                                        </div>
                                      </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                      <div className="text-sm">
                                        <span className="font-medium">
                                          Backstory:
                                        </span>
                                        <p className="text-muted-foreground mt-1">
                                          {template.backstory}
                                        </p>
                                      </div>
                                      <div className="text-sm">
                                        <span className="font-medium">
                                          Tools:
                                        </span>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                          {template.tools.map((tool, i) => (
                                            <span
                                              key={i}
                                              className="px-2 py-1 bg-muted rounded-md text-xs"
                                            >
                                              {tool}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                      <Button
                                        className="w-full cursor-pointer bg-indigo-500 text-white hover:bg-indigo-600"
                                        onClick={() => {
                                          const newAgent = {
                                            name: template.name,
                                            role: template.role,
                                            goal: template.goal,
                                            backstory: template.backstory,
                                            tools: template.tools,
                                            memory_enabled: true,
                                            verbose: false,
                                            allow_delegation: false,
                                            max_iterations: 1,
                                          };
                                          const currentAgents =
                                            form.getValues("agents") || [];
                                          form.setValue("agents", [
                                            ...currentAgents,
                                            newAgent,
                                          ]);
                                          setOpenTemplateModal(false);
                                        }}
                                      >
                                        Choose
                                      </Button>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Choose agent from templates, builtin and pre-created
                            agents
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <Dialog
                      open={openCreateModal}
                      onOpenChange={setOpenCreateModal}
                    >
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="mr-2 h-4 w-4" />
                          Create New Agent
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-white sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle className="text-xl font-bold">
                            Create New Agent
                          </DialogTitle>
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
                              memory_enabled:
                                formData.get("memory_enabled") === "true",
                              verbose: formData.get("verbose") === "true",
                              allow_delegation:
                                formData.get("allow_delegation") === "true",
                              max_iterations:
                                parseInt(
                                  formData.get("max_iterations") as string
                                ) || 1,
                              max_rpm:
                                parseInt(formData.get("max_rpm") as string) ||
                                undefined,
                            };
                            const currentAgents =
                              form.getValues("agents") || [];
                            form.setValue("agents", [
                              ...currentAgents,
                              newAgent,
                            ]);
                            setOpenCreateModal(false);
                          }}
                          className="space-y-6"
                        >
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                  id="name"
                                  name="name"
                                  placeholder="Agent name"
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Input
                                  id="role"
                                  name="role"
                                  placeholder="Agent role"
                                  required
                                />
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
                                <Label htmlFor="max_iterations">
                                  Max Iterations
                                </Label>
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
                                <Input
                                  id="max_rpm"
                                  name="max_rpm"
                                  type="number"
                                  min={1}
                                  placeholder="Optional"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                              <div className="flex items-center space-x-2">
                                <Switch
                                  id="memory_enabled"
                                  name="memory_enabled"
                                  defaultChecked
                                />
                                <Label htmlFor="memory_enabled">Memory</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch id="verbose" name="verbose" />
                                <Label htmlFor="verbose">Verbose</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch
                                  id="allow_delegation"
                                  name="allow_delegation"
                                />
                                <Label htmlFor="allow_delegation">
                                  Allow Delegation
                                </Label>
                              </div>
                            </div>
                          </div>

                          <Button
                            type="submit"
                            className="w-full bg-indigo-500 text-white hover:bg-indigo-600"
                          >
                            Create Agent
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {/* Display existing agents */}
                  <div className="space-y-4">
                    {form.watch("agents")?.map((agent: any, index: number) => (
                      <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <div>
                            <CardTitle>{agent.name}</CardTitle>
                            <CardDescription>{agent.role}</CardDescription>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const currentAgents = form.getValues("agents");
                              form.setValue(
                                "agents",
                                currentAgents.filter(
                                  (_: any, i: number) => i !== index
                                )
                              );
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="tasks" className="space-y-4">
                  <div className="flex gap-4">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Dialog
                            open={openTaskTemplateModal}
                            onOpenChange={setOpenTaskTemplateModal}
                          >
                            <DialogTrigger asChild>
                              <Button variant="outline">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Task from Template
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl bg-white">
                              <DialogHeader>
                                <DialogTitle className="text-xl font-bold">
                                  Choose Task Template
                                </DialogTitle>
                                <DialogDescription className="text-muted-foreground">
                                  Select from our collection of builtin and
                                  pre-created tasks
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid grid-cols-3 gap-4 py-4">
                                {[
                                  {
                                    name: "Web Research",
                                    description: "Research a specific topic on the web",
                                    expected_output: "Comprehensive research report with key findings and sources",
                                    tools: [
                                      "web_search",
                                      "web_scraping",
                                      "summarization",
                                    ],
                                    async_execution: false,
                                  },
                                  {
                                    name: "Data Analysis",
                                    description: "Analyze data and generate insights",
                                    expected_output: "Data analysis report with visualizations and key metrics",
                                    tools: [
                                      "data_analysis",
                                      "visualization",
                                      "statistics",
                                    ],
                                    async_execution: true,
                                  },
                                  {
                                    name: "Content Generation",
                                    description: "Generate high-quality content based on provided topic",
                                    expected_output: "Well-structured content piece with proper formatting",
                                    tools: [
                                      "text_generation",
                                      "grammar_check",
                                      "plagiarism_detection",
                                    ],
                                    async_execution: false,
                                  },
                                ].map((template, index) => (
                                  <Card
                                    key={index}
                                    className="hover:border-primary bg-card"
                                  >
                                    <CardHeader>
                                      <CardTitle className="text-lg font-semibold">
                                        {template.name}
                                      </CardTitle>
                                      <CardDescription className="text-sm text-muted-foreground">
                                        {template.description}
                                      </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                      <div className="text-sm">
                                        <span className="font-medium">
                                          Expected Output:
                                        </span>
                                        <p className="text-muted-foreground mt-1">
                                          {template.expected_output}
                                        </p>
                                      </div>
                                      <div className="text-sm">
                                        <span className="font-medium">
                                          Tools:
                                        </span>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                          {template.tools.map((tool, i) => (
                                            <span
                                              key={i}
                                              className="px-2 py-1 bg-muted rounded-md text-xs"
                                            >
                                              {tool}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                      <div className="flex items-center text-sm">
                                        <span className="font-medium mr-2">
                                          Async:
                                        </span>
                                        {template.async_execution ? "Yes" : "No"}
                                      </div>
                                      <Button
                                        className="w-full cursor-pointer bg-indigo-500 text-white hover:bg-indigo-600"
                                        onClick={() => {
                                          const newTask = {
                                            id: Date.now(),
                                            name: template.name,
                                            description: template.description,
                                            expected_output: template.expected_output,
                                            tools: template.tools,
                                            async_execution: template.async_execution,
                                          };
                                          const currentTasks = form.getValues("tasks") || [];
                                          form.setValue("tasks", [...currentTasks, newTask]);
                                          setOpenTaskTemplateModal(false);
                                        }}
                                      >
                                        Choose
                                      </Button>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Choose task from templates, builtin and pre-created
                            tasks
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <Dialog
                      open={openCreateTaskModal}
                      onOpenChange={setOpenCreateTaskModal}
                    >
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="mr-2 h-4 w-4" />
                          Create New Task
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-white sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle className="text-xl font-bold">
                            Create New Task
                          </DialogTitle>
                          <DialogDescription className="text-muted-foreground">
                            Fill in the details to create a new task
                          </DialogDescription>
                        </DialogHeader>
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            const newTask = {
                              name: formData.get("name") as string,
                              description: formData.get("description") as string,
                              expected_output: formData.get("expected_output") as string,
                              tools: (formData.get("tools") as string).split(",").map(t => t.trim()),
                              async_execution: formData.get("async_execution") === "true",
                            };
                            addTask(newTask);
                            setOpenCreateTaskModal(false);
                          }}
                          className="space-y-6"
                        >
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="name">Name</Label>
                              <Input
                                id="name"
                                name="name"
                                placeholder="Task name"
                                required
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="description">Description</Label>
                              <Textarea
                                id="description"
                                name="description"
                                placeholder="Describe what the task should accomplish"
                                required
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="expected_output">Expected Output</Label>
                              <Textarea
                                id="expected_output"
                                name="expected_output"
                                placeholder="What should the task produce as output?"
                                required
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="tools">Tools</Label>
                              <Input
                                id="tools"
                                name="tools"
                                placeholder="Enter tools separated by commas"
                              />
                              <p className="text-sm text-muted-foreground">
                                Example: web_search, data_analysis, text_generation
                              </p>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Switch
                                id="async_execution"
                                name="async_execution"
                              />
                              <Label htmlFor="async_execution">
                                Async Execution
                              </Label>
                            </div>
                          </div>

                          <Button
                            type="submit"
                            className="w-full bg-indigo-500 text-white hover:bg-indigo-600"
                          >
                            Create Task
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {/* Sortable Tasks List */}
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={form.watch("tasks")?.map((task, index) => ({ ...task, id: task.id ?? index })) || []}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-4">
                        {form.watch("tasks")?.map((task: any, index: number) => (
                          <SortableTask
                            key={task.id || index}
                            task={task}
                            index={index}
                            removeTask={removeTask}
                            form={form}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </TabsContent>

                <TabsContent value="config" className="space-y-6">
                  <Card className="border shadow-sm">
                    <CardHeader className="bg-muted/30">
                      <CardTitle className="text-lg">
                        Crew Configuration
                      </CardTitle>
                      <CardDescription>
                        Configure your crew&apos;s behavior and settings
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="process"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Process Type</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select process type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="sequential">
                                    Sequential
                                  </SelectItem>
                                  <SelectItem value="hierarchical">
                                    Hierarchical
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                How the crew will process tasks
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
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select language" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="en">English</SelectItem>
                                  <SelectItem value="es">Spanish</SelectItem>
                                  <SelectItem value="fr">French</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Primary language for the crew
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="manager_llm"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Manager LLM</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select LLM" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                                  <SelectItem value="gpt-3.5-turbo">
                                    GPT-3.5 Turbo
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                LLM for the manager agent
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="function_calling_llm"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Function Calling LLM</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select LLM" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                                  <SelectItem value="gpt-3.5-turbo">
                                    GPT-3.5 Turbo
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                LLM for function calling
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
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(parseInt(e.target.value))
                                  }
                                />
                              </FormControl>
                              <FormDescription>
                                Maximum requests per minute
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="verbose"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 space-x-3 space-y-0 hover:bg-muted/50">
                                <div className="space-y-0.5">
                                  <FormLabel>Verbose Mode</FormLabel>
                                  <FormDescription>
                                    Enable detailed logging
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    className="data-[state=checked]:bg-indigo-500 data-[state=unchecked]:bg-slate-200 transition-colors duration-200 ease-in-out hover:data-[state=checked]:bg-indigo-600 hover:data-[state=unchecked]:bg-slate-300"
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="memory"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 space-x-3 space-y-0 hover:bg-muted/50">
                                <div className="space-y-0.5">
                                  <FormLabel>Memory</FormLabel>
                                  <FormDescription>
                                    Enable memory for the crew
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    className="data-[state=checked]:bg-indigo-500 data-[state=unchecked]:bg-slate-200 transition-colors duration-200 ease-in-out hover:data-[state=checked]:bg-indigo-600 hover:data-[state=unchecked]:bg-slate-300"
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="planning"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 space-x-3 space-y-0 hover:bg-muted/50">
                                <div className="space-y-0.5">
                                  <FormLabel>Planning</FormLabel>
                                  <FormDescription>
                                    Enable planning for the crew
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    className="data-[state=checked]:bg-indigo-500 data-[state=unchecked]:bg-slate-200 transition-colors duration-200 ease-in-out hover:data-[state=checked]:bg-indigo-600 hover:data-[state=unchecked]:bg-slate-300"
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>

                        {form.watch("planning") && (
                          <FormField
                            control={form.control}
                            name="planning_llm"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Planning LLM</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select LLM" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                                    <SelectItem value="gpt-3.5-turbo">
                                      GPT-3.5 Turbo
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                  LLM for planning
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end">
                <Button type="submit">Create Crew</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
