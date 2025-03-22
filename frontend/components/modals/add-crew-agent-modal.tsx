import { useState } from "react";
import { Agent, AgentRole } from "@/utils/api/types";
import { useAgentTemplates } from "@/hooks/use-agent-templates";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AgentForm } from "@/app/(authenticated)/templates/agents/components/agent-form";

interface AddCrewAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAgent: (agent: Agent, role: AgentRole) => void;
}

export function AddCrewAgentModal({ isOpen, onClose, onAddAgent }: AddCrewAgentModalProps) {
  const [activeTab, setActiveTab] = useState("existing");
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [selectedRole, setSelectedRole] = useState<AgentRole>(AgentRole.WORKER);
  const { templates: agentTemplates = [] } = useAgentTemplates();

  const handleAddExisting = () => {
    if (selectedAgent) {
      onAddAgent(selectedAgent, selectedRole);
      onClose();
    }
  };

  const handleCreateNew = async (agent: Agent) => {
    onAddAgent(agent, selectedRole);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Agent to Crew</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="existing">Use Existing Agent</TabsTrigger>
            <TabsTrigger value="new">Create New Agent</TabsTrigger>
          </TabsList>

          <TabsContent value="existing" className="space-y-4">
            <div className="space-y-4">
              <Select
                onValueChange={(value) => {
                  const agent = agentTemplates.find((a) => a.id === parseInt(value));
                  setSelectedAgent(agent || null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an agent template" />
                </SelectTrigger>
                <SelectContent>
                  {agentTemplates.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id.toString()}>
                      {agent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedRole}
                onValueChange={(value) => setSelectedRole(value as AgentRole)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select agent role" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(AgentRole).map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                onClick={handleAddExisting}
                disabled={!selectedAgent}
                className="w-full"
              >
                Add Selected Agent
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="new">
            <AgentForm
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
