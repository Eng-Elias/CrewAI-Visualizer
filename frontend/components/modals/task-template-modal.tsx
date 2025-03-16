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
import { Task } from "@/utils/api/types";

interface TaskTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: Task;
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
              <div className="flex space-x-2">
                {template.is_builtin && <Badge>Built-in</Badge>}
                {template.async_execution && (
                  <Badge variant="secondary">Async</Badge>
                )}
              </div>
            </div>
            <DialogDescription className="text-base mt-2">
              {template.description}
            </DialogDescription>
          </DialogHeader>

          <Separator className="my-4" />

          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-6 p-1">
              <div>
                <h3 className="text-lg font-semibold">Expected Output</h3>
                <p className="text-gray-700 mt-1">{template.expected_output}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold">Agent</h3>
                <p className="text-gray-700 mt-1">ID: {template.agent}</p>
              </div>

              {template.tools && Object.keys(template.tools).length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold">Tools</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {Object.keys(template.tools).map((tool) => (
                      <Badge key={tool} variant="outline">
                        {tool}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {template.config && Object.keys(template.config).length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold">Configuration</h3>
                  <pre className="bg-gray-100 p-3 rounded-md mt-2 text-sm overflow-auto">
                    {JSON.stringify(template.config, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    )
  );
}
