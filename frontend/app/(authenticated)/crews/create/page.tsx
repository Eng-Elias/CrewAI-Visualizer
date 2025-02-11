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

const agentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
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
    form.setValue("agents", [...currentAgents, { name: "", role: "" }]);
  };

  const removeAgent = (index: number) => {
    const currentAgents = form.getValues("agents") || [];
    form.setValue(
      "agents",
      currentAgents.filter((_, i) => i !== index)
    );
  };

  const addTask = () => {
    const currentTasks = form.getValues("tasks") || [];
    form.setValue("tasks", [...currentTasks, { name: "", description: "" }]);
  };

  const removeTask = (index: number) => {
    const currentTasks = form.getValues("tasks") || [];
    form.setValue(
      "tasks",
      currentTasks.filter((_, i) => i !== index)
    );
  };

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
                  <Card className="border shadow-sm">
                    <CardHeader className="bg-muted/30">
                      <CardTitle className="text-lg">Crew Agents</CardTitle>
                      <CardDescription>
                        Add and configure agents for your crew
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                      {form.watch("agents")?.map((_, index) => (
                        <Card key={index} className="border shadow-sm">
                          <div className="flex gap-4 items-start p-4">
                            <div className="flex-1 space-y-4">
                              <FormField
                                control={form.control}
                                name={`agents.${index}.name`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Agent Name</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Enter agent name"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={`agents.${index}.role`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Agent Role</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Enter agent role"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeAgent(index)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/20"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </Card>
                      ))}
                      <Button
                        type="button"
                        onClick={addAgent}
                        variant="outline"
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Agent
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="tasks" className="space-y-4">
                  <Card className="border shadow-sm">
                    <CardHeader className="bg-muted/30">
                      <CardTitle className="text-lg">Crew Tasks</CardTitle>
                      <CardDescription>
                        Define and order tasks for your crew
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                      >
                        <SortableContext
                          items={form.watch("tasks").map((_, index) => index)}
                          strategy={verticalListSortingStrategy}
                        >
                          {form.watch("tasks")?.map((task, index) => (
                            <SortableTask
                              key={index}
                              task={task}
                              index={index}
                              removeTask={removeTask}
                              form={form}
                            />
                          ))}
                        </SortableContext>
                      </DndContext>
                      <Button
                        type="button"
                        onClick={addTask}
                        variant="outline"
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Task
                      </Button>
                    </CardContent>
                  </Card>
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
