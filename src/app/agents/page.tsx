"use client";

import AgentModal from "@/components/modals/agent-modal";
import { agents } from "@/data/data";
import { Agent } from "@/types/agent";
import { Icon } from "@iconify/react";
import { useState } from "react";

const ExplorePage = () => {
  const [showModal, setShowModal] = useState(false);

  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  return (
    <div className="container m-auto flex flex-wrap flex-col md:flex-row items-center justify-start p-2">
      {agents.map((agent, i) => (
        <div key={i} className="w-full lg:w-1/2 p-3 relative">
          <div
            className={`flex flex-col ${
              i % 2 == 0 ? "lg:flex-row" : "lg:flex-row-reverse"
            } rounded overflow-hidden h-auto min-h-40 border`}
          >
            <img
              className="block h-auto w-full lg:w-48 flex-none bg-cover"
              src={agent.image}
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

export default ExplorePage;
