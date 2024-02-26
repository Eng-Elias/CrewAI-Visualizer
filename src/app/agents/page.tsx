"use client";

import AgentModal from "@/components/modals/agent_modal";
import { Agent } from "@/types/agent";
import { GET_AGENTS } from "@/utils/graphql_queries";
import { useQuery } from "@apollo/client";
import { Icon } from "@iconify/react";
import { Button } from "@material-tailwind/react";
import { useState } from "react";

const AgentsPage = () => {
  const [showModal, setShowModal] = useState(false);

  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const { loading, error, data } = useQuery(GET_AGENTS);

  if (loading) {
    return (
      <Button
        variant="text"
        loading={true}
        placeholder={"Loading"}
        className="text-white"
      >
        Loading
      </Button>
    );
  }

  return (
    <div className="container m-auto flex flex-wrap flex-col md:flex-row items-center justify-start p-2">
      {data.agents.map((agent: Agent, i: number) => (
        <div key={i} className="w-full lg:w-1/2 p-3 relative">
          <div
            className={`flex flex-col ${
              i % 2 == 0 ? "lg:flex-row" : "lg:flex-row-reverse"
            } rounded overflow-hidden h-auto min-h-40 border`}
          >
            <img
              className="block h-auto w-full lg:w-48 flex-none bg-cover"
              src={agent.image ?? "/sailor.png"}
              alt="Agent"
            />
            <div className="rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col leading-normal w-100">
              <div className="text-white font-bold text-lg mb-2 leading-tight">
                {agent.role}
              </div>
              <div className="text-slate-300 text-ellipsis">
                Goal: {agent.goal}
              </div>
            </div>
            <button
              className="absolute bottom-0 right-0 bg-blue-500 text-white px-4 py-2 rounded-bl"
              style={{ zIndex: 10 }}
              onClick={() => {
                setSelectedAgent(agent);
                setShowModal(true);
              }}
            >
              <Icon icon="entypo:popup" width="20" height="20" />
            </button>
          </div>
        </div>
      ))}
      <AgentModal
        agent={selectedAgent}
        showModal={showModal}
        setShowModal={setShowModal}
      />
    </div>
  );
};

export default AgentsPage;
