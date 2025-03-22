import { useState } from "react";
import { Task, CrewTask, CrewAgent } from "@/utils/api/types";
import { useToast } from "@/hooks/use-toast";

export const useCrewTasks = (
  initialTasks: CrewTask[] = [],
  crewAgents: CrewAgent[] = []
) => {
  const [tasks, setTasks] = useState<CrewTask[]>(initialTasks);
  const { toast } = useToast();

  const addTask = (task: Task) => {
    const existingTask = tasks.find((t) => t.task_id === task.id);
    if (existingTask) {
      toast({
        title: "Task already exists",
        description: "This task is already part of the crew",
        variant: "destructive",
      });
      return false;
    }

    const newTask: CrewTask = {
      task_id: task.id,
      task_order: tasks.length + 1,
      data: task,
    };

    setTasks([...tasks, newTask]);
    return true;
  };

  const removeTask = (taskId: number) => {
    setTasks(tasks.filter((t) => t.task_id !== taskId));
  };

  const assignAgent = (taskId: number, agentId: number) => {
    // Verify agent exists in crew
    const agentExists = crewAgents.some((a) => a.agent_id === agentId);
    if (!agentExists) {
      toast({
        title: "Invalid agent",
        description: "Selected agent is not part of the crew",
        variant: "destructive",
      });
      return false;
    }

    setTasks(
      tasks.map((t) =>
        t.task_id === taskId ? { ...t, assigned_agent_id: agentId } : t
      )
    );
    return true;
  };

  const reorderTasks = (newOrder: CrewTask[]) => {
    setTasks(
      newOrder.map((task, index) => ({
        ...task,
        task_order: index + 1,
      }))
    );
  };

  // When an agent is removed, remove their assignments
  const handleAgentRemoval = (agentId: number) => {
    setTasks(
      tasks.map((task) =>
        task.assigned_agent_id === agentId
          ? { ...task, assigned_agent_id: undefined }
          : task
      )
    );
  };

  return {
    tasks,
    setTasks,
    addTask,
    removeTask,
    assignAgent,
    reorderTasks,
    handleAgentRemoval,
  };
};
