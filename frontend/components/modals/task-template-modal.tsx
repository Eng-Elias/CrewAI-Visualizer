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
import { Clock } from "lucide-react";

interface TaskTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: {
    id: number;
    name: string;
    description: string;
    expected_output: string;
    async_execution: boolean;
    tools?: string[];
    estimatedTime?: string;
    complexity?: "Low" | "Medium" | "High";
  };
}

export function TaskTemplateModal({
  isOpen,
  onClose,
  template,
}: TaskTemplateModalProps) {
  return (
    template && (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl">{template.name}</DialogTitle>
              {template.complexity && (
                <Badge
                  variant={
                    template.complexity === "High"
                      ? "destructive"
                      : template.complexity === "Medium"
                      ? "default"
                      : "secondary"
                  }
                >
                  {template.complexity}
                </Badge>
              )}
            </div>
            <DialogDescription>Task Template Details</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh]">
            <div className="space-y-6 p-1">
              <div>
                <h3 className="font-semibold">Description</h3>
                <p className="text-muted-foreground">{template.description}</p>
              </div>

              <div>
                <h3 className="font-semibold">Expected Output</h3>
                <p className="text-muted-foreground">
                  {template.expected_output}
                </p>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="font-semibold">Configuration</h3>
                  <ul className="mt-2 space-y-2">
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Async Execution
                      </span>
                      <Badge
                        variant={
                          template.async_execution ? "default" : "secondary"
                        }
                      >
                        {template.async_execution ? "Yes" : "No"}
                      </Badge>
                    </li>
                    {template.estimatedTime && (
                      <li className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          <Clock className="mr-2 inline-block h-4 w-4" />
                          Estimated Time
                        </span>
                        <Badge variant="outline">
                          {template.estimatedTime}
                        </Badge>
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {template.tools && template.tools.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold">Required Tools</h3>
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
