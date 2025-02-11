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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { AgentsSection } from "./components/agents-section";
import { ConfigSection } from "./components/config-section";
import { TasksSection } from "./components/tasks-section";
import { formSchema, FormValues } from "./schema";

export default function CreateCrewPage() {
  const router = useRouter();
  const form = useForm<FormValues>({
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

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await fetch("/api/crews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create crew");
      }

      router.push("/crews");
    } catch (error) {
      console.error("Error creating crew:", error);
    }
  };

  return (
    <div className="container py-10">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => router.push("/crews")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Crews
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create New Crew</CardTitle>
          <CardDescription>
            Configure your crew with agents and tasks
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

                <TabsContent value="agents">
                  <AgentsSection form={form} />
                </TabsContent>

                <TabsContent value="tasks">
                  <TasksSection form={form} />
                </TabsContent>

                <TabsContent value="config">
                  <ConfigSection form={form} />
                </TabsContent>
              </Tabs>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Create Crew
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}