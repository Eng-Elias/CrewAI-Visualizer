"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users } from "lucide-react";

interface CrewTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: {
    id: number;
    name: string;
    description: string;
    agents: Array<{
      name: string;
      role: string;
    }>;
    tasks: Array<{
      name: string;
      description: string;
    }>;
  };
}

export function CrewTemplateModal({
  isOpen,
  onClose,
  template,
}: CrewTemplateModalProps) {
  return (
    template && (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl">{template.name}</DialogTitle>
              <Badge variant="secondary">
                <Users className="mr-2 h-4 w-4" />
                {template.agents.length} Agents
              </Badge>
            </div>
            <DialogDescription>Crew Template Details</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh]">
            <div className="space-y-6 p-1">
              <div>
                <h3 className="font-semibold">Description</h3>
                <p className="text-muted-foreground">{template.description}</p>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold">Agents</h3>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {template.agents.map((agent, index) => (
                    <div
                      key={index}
                      className="rounded-lg border p-4 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{agent.name}</h4>
                        <Badge>{agent.role}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold">Tasks</h3>
                <div className="mt-4 space-y-4">
                  {template.tasks.map((task, index) => (
                    <div
                      key={index}
                      className="rounded-lg border p-4 shadow-sm"
                    >
                      <h4 className="font-medium">{task.name}</h4>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {task.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    )
  );
}
