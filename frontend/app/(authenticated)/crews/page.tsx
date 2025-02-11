"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Eye, Edit } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const mockCrews = [
  {
    id: 1,
    name: "Data Analysis Crew",
    description: "A crew specialized in analyzing data and generating insights",
    agentsCount: 3,
    tasksCount: 5,
  },
  {
    id: 2,
    name: "Content Creation Crew",
    description: "A crew focused on generating and editing content",
    agentsCount: 4,
    tasksCount: 6,
  },
];

export default function CrewsPage() {
  const router = useRouter();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Crews</h1>
        <Button onClick={() => router.push("/crews/create")}>
          <Plus className="w-4 h-4 mr-2" />
          Create Crew
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockCrews.map((crew) => (
          <Card key={crew.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{crew.name}</span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push(`/crews/${crew.id}`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push(`/crews/${crew.id}/edit`)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                {crew.description}
              </p>
              <div className="flex justify-between text-sm">
                <span>{crew.agentsCount} Agents</span>
                <span>{crew.tasksCount} Tasks</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
