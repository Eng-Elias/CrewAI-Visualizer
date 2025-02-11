"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { use } from "react";

const mockCrew = {
  id: 1,
  name: "Data Analysis Crew",
  description: "A crew specialized in analyzing data and generating insights",
  process: "sequential",
  verbose: true,
  manager_llm: "gpt-4",
  function_calling_llm: "gpt-3.5-turbo",
  max_rpm: 10,
  language: "en",
  memory: true,
  planning: true,
  planning_llm: "gpt-4",
  agents: [
    { id: 1, name: "Data Collector", role: "Collects and preprocesses data" },
    { id: 2, name: "Analyst", role: "Analyzes data and generates insights" },
    { id: 3, name: "Reporter", role: "Creates reports from analysis" },
  ],
  tasks: [
    { id: 1, name: "Collect Data", description: "Gather data from sources" },
    { id: 2, name: "Analyze Data", description: "Process and analyze data" },
    { id: 3, name: "Generate Report", description: "Create final report" },
  ],
};

export default function ViewCrewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/crews")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">{mockCrew.name}</h1>
        </div>
        <Button onClick={() => router.push(`/crews/${resolvedParams.id}/edit`)}>
          <Edit className="w-4 h-4 mr-2" />
          Edit Crew
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>{mockCrew.description}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Process</p>
                <p className="text-sm text-muted-foreground">
                  {mockCrew.process}
                </p>
              </div>
              <div>
                <p className="font-medium">Manager LLM</p>
                <p className="text-sm text-muted-foreground">
                  {mockCrew.manager_llm}
                </p>
              </div>
              <div>
                <p className="font-medium">Function Calling LLM</p>
                <p className="text-sm text-muted-foreground">
                  {mockCrew.function_calling_llm}
                </p>
              </div>
              <div>
                <p className="font-medium">Planning LLM</p>
                <p className="text-sm text-muted-foreground">
                  {mockCrew.planning_llm}
                </p>
              </div>
              <div>
                <p className="font-medium">Max RPM</p>
                <p className="text-sm text-muted-foreground">{mockCrew.max_rpm}</p>
              </div>
              <div>
                <p className="font-medium">Language</p>
                <p className="text-sm text-muted-foreground">
                  {mockCrew.language}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm">Memory:</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    mockCrew.memory
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {mockCrew.memory ? "Enabled" : "Disabled"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Planning:</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    mockCrew.planning
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {mockCrew.planning ? "Enabled" : "Disabled"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Verbose:</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    mockCrew.verbose
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {mockCrew.verbose ? "Enabled" : "Disabled"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Agents</CardTitle>
              <CardDescription>
                Agents participating in this crew
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCrew.agents.map((agent) => (
                  <div
                    key={agent.id}
                    className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{agent.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {agent.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tasks</CardTitle>
              <CardDescription>Tasks assigned to this crew</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCrew.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{task.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {task.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
