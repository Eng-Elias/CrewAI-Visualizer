import { useState } from "react";
import { Task, CrewAgent } from "@/utils/api/types";
import { useTaskTemplates } from "@/hooks/use-task-templates";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TaskForm } from "@/app/(authenticated)/templates/tasks/components/task-form";

interface AddCrewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Task) => void;
  crewAgents: CrewAgent[];
}

export function AddCrewTaskModal({
  isOpen,
  onClose,
  onAddTask,
  crewAgents,
}: AddCrewTaskModalProps) {
  const [activeTab, setActiveTab] = useState("existing");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const { templates: taskTemplates = [] } = useTaskTemplates();

  const handleAddExisting = () => {
    if (selectedTask) {
      onAddTask(selectedTask);
      onClose();
    }
  };

  const handleCreateNew = async (task: Task) => {
    onAddTask(task);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Task to Crew</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="existing">Use Existing Task</TabsTrigger>
            <TabsTrigger value="new">Create New Task</TabsTrigger>
          </TabsList>

          <TabsContent value="existing" className="space-y-4">
            <div className="space-y-4">
              <Select
                onValueChange={(value) => {
                  const task = taskTemplates.find(
                    (t) => t.id === parseInt(value)
                  );
                  setSelectedTask(task || null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a task template" />
                </SelectTrigger>
                <SelectContent>
                  {taskTemplates.map((task) => (
                    <SelectItem key={task.id} value={task.id.toString()}>
                      {task.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                onClick={handleAddExisting}
                disabled={!selectedTask}
                className="w-full"
              >
                Add Selected Task
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="new">
            <TaskForm
              onSubmit={handleCreateNew}
              submitButtonText="Add to Crew"
              defaultValues={{
                is_template: false,
                is_builtin: false,
              }}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
