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

interface AgentTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: {
    id: number;
    name: string;
    role: string;
    goal: string;
    backstory?: string;
    memory_enabled: boolean;
    verbose: boolean;
    allow_delegation: boolean;
    max_iterations: number;
    max_rpm?: number;
    tools?: string[];
  };
}

export function AgentTemplateModal({
  isOpen,
  onClose,
  template,
}: AgentTemplateModalProps) {
  return (
    template && (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl">{template.name}</DialogTitle>
              <Badge variant="secondary">{template.role}</Badge>
            </div>
            <DialogDescription>Agent Template Details</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh]">
            <div className="space-y-6 p-1">
              <div>
                <h3 className="font-semibold">Goal</h3>
                <p className="text-muted-foreground">{template.goal}</p>
              </div>

              {template.backstory && (
                <div>
                  <h3 className="font-semibold">Backstory</h3>
                  <p className="text-muted-foreground">{template.backstory}</p>
                </div>
              )}

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="font-semibold">Configuration</h3>
                  <ul className="mt-2 space-y-2">
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Memory Enabled
                      </span>
                      <Badge
                        variant={
                          template.memory_enabled ? "default" : "secondary"
                        }
                      >
                        {template.memory_enabled ? "Yes" : "No"}
                      </Badge>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Verbose Mode
                      </span>
                      <Badge
                        variant={template.verbose ? "default" : "secondary"}
                      >
                        {template.verbose ? "Yes" : "No"}
                      </Badge>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Allow Delegation
                      </span>
                      <Badge
                        variant={
                          template.allow_delegation ? "default" : "secondary"
                        }
                      >
                        {template.allow_delegation ? "Yes" : "No"}
                      </Badge>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold">Limits</h3>
                  <ul className="mt-2 space-y-2">
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Max Iterations
                      </span>
                      <Badge>{template.max_iterations}</Badge>
                    </li>
                    {template.max_rpm && (
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">Max RPM</span>
                        <Badge>{template.max_rpm}</Badge>
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {template.tools && template.tools.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold">Tools</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {template.tools.map((tool) => (
                        <Badge key={tool} variant="outline">
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    )
  );
}
