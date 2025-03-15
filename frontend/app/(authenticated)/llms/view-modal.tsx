import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { LLM } from "@/utils/api/types";
import { JsonEditor } from "json-edit-react";

interface ViewLLMModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  llm: LLM | null;
}

export function ViewLLMModal({ open, onOpenChange, llm }: ViewLLMModalProps) {
  if (!llm) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle>{llm.name}</DialogTitle>
          <DialogDescription>
            View the details of this LLM configuration.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-1">Provider</h3>
            <p>{llm.provider}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-1">Models</h3>
            <div className="flex flex-wrap gap-1">
              {llm.models.map((model) => (
                <span
                  key={model}
                  className="text-sm bg-secondary px-2 py-1 rounded-full"
                >
                  {model}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-1">Configuration</h3>
            <div className="border rounded-md p-4 bg-secondary">
              <JsonEditor
                data={llm.config}
                restrictAdd
                restrictEdit
                restrictDelete
                restrictDrag
                restrictTypeSelection
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-1">Created At</h3>
              <p className="text-sm">
                {new Date(llm.created_at).toLocaleString()}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">Updated At</h3>
              <p className="text-sm">
                {new Date(llm.updated_at).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
