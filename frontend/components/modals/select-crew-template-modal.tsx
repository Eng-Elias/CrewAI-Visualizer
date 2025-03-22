import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCrewTemplates } from "@/hooks/use-crew-templates";
import { Crew } from "@/utils/api/types";

interface SelectCrewTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (template: Crew) => void;
}

export function SelectCrewTemplateModal({
  isOpen,
  onClose,
  onSelect,
}: SelectCrewTemplateModalProps) {
  const { templates, isLoading } = useCrewTemplates();
  const [selectedTemplate, setSelectedTemplate] = useState<Crew | null>(null);

  const handleSelect = () => {
    if (selectedTemplate) {
      onSelect(selectedTemplate);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Select Crew Template</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div>Loading templates...</div>
        ) : (
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Agents</TableHead>
                  <TableHead>Tasks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates?.map((template: Crew) => (
                  <TableRow
                    key={template.id}
                    className={`cursor-pointer ${
                      selectedTemplate?.id === template.id ? "bg-accent" : ""
                    }`}
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <TableCell>{template.name}</TableCell>
                    <TableCell>{template.description}</TableCell>
                    <TableCell>{template.crew_agents?.length || 0}</TableCell>
                    <TableCell>{template.crew_tasks?.length || 0}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSelect} disabled={!selectedTemplate}>
                Use Template
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
