"use client";

import { selectTheme } from "@/data/consts";
import { Agent } from "@/types/agent";
import { Mission } from "@/types/mission";
import { Task } from "@/types/task";
import { Button } from "@material-tailwind/react";
import React, { useState } from "react";
import { TESelect } from "tw-elements-react";

interface MissionTaskEditorProps {
  mission: Mission;
  agents: Array<Agent>;
  onMissionChange: (updatedMission: Mission) => void;
}

const MissionTaskEditor: React.FC<MissionTaskEditorProps> = ({
  mission,
  agents = [],
  onMissionChange,
}) => {
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskAgent, setNewTaskAgent] = useState<Agent | null>(null);
  const [newTaskDescription, setNewTaskDescription] = useState("");

  const handleAddTask = () => {
    const newTask: Task = {
      name: newTaskName,
      description: newTaskDescription,
      agent: newTaskAgent,
    };
    const updatedTasks = [...(mission?.tasks ?? []), newTask];
    const updatedMission: Mission = { ...mission, tasks: updatedTasks };
    onMissionChange(updatedMission);
    setNewTaskName("");
    setNewTaskDescription("");
  };

  const handleRemoveTask = (index: number) => {
    const updatedTasks = [...(mission?.tasks ?? [])];
    updatedTasks.splice(index, 1);
    const updatedMission: Mission = { ...mission, tasks: updatedTasks };
    onMissionChange(updatedMission);
  };

  return (
    <div>
      <h2 className="text-lg font-bold">Mission Tasks</h2>
      {mission?.tasks?.map((task, index) => (
        <div key={index} className="mt-4 border-b border-gray-200 pb-4">
          <div className="flex justify-between items-center">
            <h3 className="text-md font-semibold">{task.name}</h3>
            <Button
              onClick={() => handleRemoveTask(index)}
              className="text-red-500"
              placeholder={undefined}
            >
              Remove
            </Button>
          </div>
          <div className="text-sm text-gray-300 my-2">{task.description}</div>
          <div className="ml-3">
            <strong>Agent: </strong>
            <span className="bg-gray-200 text-gray-700 rounded-full px-3 py-1 text-sm font-semibold m-1 sm:w-1/2">
              {task.agent?.role ?? "No Agent"}
            </span>
          </div>
        </div>
      ))}
      <div role="alert" className="mt-4">
        <div className="bg-success-600 text-white font-bold rounded-t px-4 py-2">
          Add New Task:
        </div>
        <div className="border border-t-0 border-success-400 rounded-b bg-success-100 px-4 py-3 text-success-700">
          <div>
            <label>Task Name: </label>
            <input
              type="text"
              placeholder="Task Name"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              className="border border-gray-300 text-black rounded px-3 py-1"
            />
          </div>
          <div>
            <label>Task Description: </label>
            <br />
            <textarea
              placeholder="Task Description"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              className="w-full border border-gray-300 text-black rounded px-3 py-1 ml-2"
            />
          </div>
          <div className="m-2">
            <label>Agent</label>
            <TESelect
              className="bg-gray-700 text-white"
              data={[
                { text: "None", value: -1 },
                ...(mission?.crew ?? []).map((agent) => ({
                  text: agent.role,
                  value: agent.id,
                })),
              ]}
              onValueChange={(event: any) => {
                if (event.value) {
                  const agent =
                    agents.find((a) => a.id === event.value) ?? null;
                  setNewTaskAgent(agent);
                }
              }}
              theme={selectTheme}
            />
          </div>
          <Button
            color="green"
            disabled={!newTaskName || !newTaskDescription}
            onClick={handleAddTask}
            placeholder={undefined}
          >
            Add Task
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MissionTaskEditor;
