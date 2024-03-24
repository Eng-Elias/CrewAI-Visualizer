"use client";

import AgentModal from "@/components/modals/agent_modal";
import NewAgentModal from "@/components/modals/new_agent_modal";
import { Agent } from "@/types/agent";
import { GET_AGENTS } from "@/utils/graphql_queries";
import { useQuery } from "@apollo/client";
import { Icon } from "@iconify/react";
import { Alert, Button, IconButton } from "@material-tailwind/react";
import Image from "next/image";
import { useState } from "react";

const AgentsPage = () => {
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [showNewAgentModal, setShowNewAgentModal] = useState(false);

  const [selectedAgent, setSelectedAgent] = useState<Agent>();

  const { loading, error, data, refetch } = useQuery(GET_AGENTS);

  if (loading) {
    return (
      <Button
        variant="text"
        loading={true}
        placeholder={"Loading"}
        className="text-white"
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        Loading
      </Button>
    );
  }

  return (
    <div>
      <div>
        <IconButton
          color="green"
          placeholder={undefined}
          className="float-right mr-5"
          onClick={() => {
            setShowNewAgentModal(true);
          }}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <Icon icon="mdi:add-bold" width="30" height="30" />
        </IconButton>
        <NewAgentModal
          showModal={showNewAgentModal}
          setShowModal={setShowNewAgentModal}
          onAddNewAgent={() => {
            refetch();
          }}
        />
      </div>
      <div className="container m-auto flex flex-wrap flex-col md:flex-row items-center justify-start p-2">
        {error && (
          <div className="w-full">
            <Alert
              color="yellow"
              icon={
                <Icon icon="material-symbols:warning-outline" fontSize={26} />
              }
              className="w-fit"
            >
              {error?.message ?? "An error occurred."}
            </Alert>
          </div>
        )}
        {data?.agents.length === 0 && (
          <div className="w-full">
            <Alert
              color="cyan"
              icon={
                <Icon icon="material-symbols:warning-outline" fontSize={26} />
              }
              className="w-fit"
            >
              No Agents, Try to add one.
            </Alert>
          </div>
        )}
        {data?.agents.map((agent: Agent, i: number) => (
          <div key={i} className="w-full lg:w-1/2 p-3 relative">
            <div
              className={`flex flex-col ${
                i % 2 == 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              } rounded overflow-hidden h-auto min-h-52 border`}
            >
              <img
                className="block max-w-72 w-full lg:w-48 flex-none bg-cover mx-auto"
                src={agent.image ?? "/agents_images/sailor.png"}
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
                  setShowAgentModal(true);
                }}
              >
                <Icon icon="entypo:popup" width="20" height="20" />
              </button>
            </div>
          </div>
        ))}
        <AgentModal
          agent={selectedAgent!}
          showModal={showAgentModal}
          setShowModal={setShowAgentModal}
          onUpdateAgent={() => {
            refetch();
          }}
          onUploadImage={() => {
            refetch();
          }}
          onDeleteAgent={() => {
            refetch();
          }}
        />
      </div>
    </div>
  );
};

export default AgentsPage;
