import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LLM } from "./page";

interface ViewLLMModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  llm: LLM | null;
}

export function ViewLLMModal({ open, onOpenChange, llm }: ViewLLMModalProps) {
  if (!llm) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <DialogTitle>{llm.name}</DialogTitle>
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
            <pre className="bg-secondary p-4 rounded-lg overflow-auto max-h-[200px] text-sm">
              {JSON.stringify(llm.config, null, 2)}
            </pre>
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
