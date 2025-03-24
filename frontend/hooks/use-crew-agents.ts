import { useState } from "react";
import { Agent, CrewAgent, AgentRoleType } from "@/utils/api/types";
import { useToast } from "@/hooks/use-toast";

export const useCrewAgents = (initialAgents: CrewAgent[] = []) => {
  const [agents, setAgents] = useState<CrewAgent[]>(initialAgents);
  const { toast } = useToast();

  const addAgent = (agent: Agent, role: AgentRoleType) => {
    const existingAgent = agents.find((a) => a.agent_id === agent.id);
    if (existingAgent) {
      toast({
        title: "Agent already exists",
        description: "This agent is already part of the crew",
        variant: "destructive",
      });
      return false;
    }

    const newAgent: Partial<CrewAgent> = {
      agent_id: agent.id,
      role,
      agent_order: agents.length + 1,
    };

    setAgents([...agents, newAgent as CrewAgent]);
    return true;
  };

  const removeAgent = (agentId: number) => {
    setAgents(agents.filter((a) => a.agent_id !== agentId));
  };

  const updateAgentRole = (agentId: number, role: AgentRoleType) => {
    setAgents(agents.map((a) => (a.agent_id === agentId ? { ...a, role } : a)));
  };

  const reorderAgents = (newOrder: CrewAgent[]) => {
    setAgents(
      newOrder.map((agent, index) => ({
        ...agent,
        agent_order: index + 1,
      }))
    );
  };

  return {
    agents,
    setAgents,
    addAgent,
    removeAgent,
    updateAgentRole,
    reorderAgents,
  };
};
