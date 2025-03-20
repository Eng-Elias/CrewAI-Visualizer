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
import { Crew } from "@/utils/api/types";

interface CrewTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: Crew;
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
                {template.crew_agents?.length || 0} Agents
              </Badge>
            </div>
            <DialogDescription>Crew Details</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh]">
            <div className="space-y-6 p-1">
              <div>
                <h3 className="font-semibold">Description</h3>
                <p className="text-muted-foreground">{template.description}</p>
              </div>

              {template.process && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold">Process</h3>
                    <p className="text-muted-foreground">{template.process}</p>
                  </div>
                </>
              )}

              <Separator />

              <div>
                <h3 className="font-semibold">Configuration</h3>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Verbose</p>
                    <p className="text-sm text-muted-foreground">
                      {template.verbose ? "Yes" : "No"}
                    </p>
                  </div>
                  {template.max_rpm && (
                    <div>
                      <p className="text-sm font-medium">Max RPM</p>
                      <p className="text-sm text-muted-foreground">
                        {template.max_rpm}
                      </p>
                    </div>
                  )}
                  {template.language && (
                    <div>
                      <p className="text-sm font-medium">Language</p>
                      <p className="text-sm text-muted-foreground">
                        {template.language}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium">Memory</p>
                    <p className="text-sm text-muted-foreground">
                      {template.memory ? "Enabled" : "Disabled"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Planning</p>
                    <p className="text-sm text-muted-foreground">
                      {template.planning ? "Enabled" : "Disabled"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Full Output</p>
                    <p className="text-sm text-muted-foreground">
                      {template.full_output ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold">Agents</h3>
                {template.crew_agents && template.crew_agents.length > 0 ? (
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {template.crew_agents.map((agent) => (
                      <div
                        key={agent.agent_id}
                        className="rounded-lg border p-4 shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">
                            {agent.data?.name || `Agent ${agent.agent_id}`}
                          </h4>
                          <Badge>{agent.role}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-muted-foreground">
                    No agents assigned to this crew
                  </p>
                )}
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold">Tasks</h3>
                {template.crew_tasks && template.crew_tasks.length > 0 ? (
                  <div className="mt-4 space-y-4">
                    {template.crew_tasks.map((task) => (
                      <div
                        key={task.task_id}
                        className="rounded-lg border p-4 shadow-sm"
                      >
                        <h4 className="font-medium">
                          {task.data?.name || `Task ${task.task_id}`}
                        </h4>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {task.data?.description || "No description available"}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-muted-foreground">
                    No tasks assigned to this crew
                  </p>
                )}
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    )
  );
}
