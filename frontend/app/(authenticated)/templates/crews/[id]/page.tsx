"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCrew } from "@/hooks/use-crew";
import { createCrewFromTemplate } from "@/utils/api/crew-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CrewAgent, CrewTask } from "@/utils/api/types";
import { use } from "react";

interface CrewTemplatePageProps {
  params: Promise<{ id: string }>;
}

export default function CrewTemplatePage({ params }: CrewTemplatePageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const crewId = parseInt(resolvedParams.id);
  const { crew, isLoading } = useCrew(crewId);

  const handleCreateFromTemplate = async () => {
    try {
      const newCrew = await createCrewFromTemplate(crewId);
      router.push(`/crews/${newCrew.id}/edit`);
    } catch (error) {
      console.error("Error creating crew from template:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{crew?.name}</h1>
        <div className="space-x-4">
          <Button
            onClick={() => router.push(`/templates/crews/${crewId}/edit`)}
          >
            Edit Template
          </Button>
          <Button onClick={handleCreateFromTemplate}>
            Create Crew from Template
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{crew?.description}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {crew?.crew_agents?.map((agent: CrewAgent) => (
                  <TableRow key={agent.agent_id}>
                    <TableCell>{agent.data?.name}</TableCell>
                    <TableCell>{agent.role}</TableCell>
                    <TableCell>{agent.data?.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Assigned Agent</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {crew?.crew_tasks?.map((task: CrewTask) => (
                  <TableRow key={task.task_id}>
                    <TableCell>{task.data?.name}</TableCell>
                    <TableCell>{task.data?.description}</TableCell>
                    <TableCell>
                      {crew.crew_agents?.find(
                        (a: CrewAgent) => a.agent_id === task.assigned_agent_id
                      )?.data?.name || "Unassigned"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
