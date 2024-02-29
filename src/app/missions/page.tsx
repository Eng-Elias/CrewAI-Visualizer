"use client";

import MissionModal from "@/components/modals/mission_modal";
import NewMissionModal from "@/components/modals/new_mission_modal";
import { missions } from "@/data/data";
import { Mission } from "@/types/mission";
import { GET_MISSIONS } from "@/utils/graphql_queries";
import { useQuery } from "@apollo/client";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button, IconButton } from "@material-tailwind/react";
import { useState } from "react";

const MissionsPage = () => {
  const [showMissionModal, setShowMissionModal] = useState(false);
  const [showNewMissionModal, setShowNewMissionModal] = useState(false);

  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);

  const { loading, error, data, refetch } = useQuery(GET_MISSIONS);

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
    <div>
      <div>
        <IconButton
          color="green"
          placeholder={undefined}
          className="float-right mr-5"
          onClick={() => {
            setShowNewMissionModal(true);
          }}
        >
          <Icon icon="mdi:add-bold" width="30" height="30" />
        </IconButton>
        <NewMissionModal
          showModal={showNewMissionModal}
          setShowModal={setShowNewMissionModal}
          onAddNewMission={() => {
            refetch();
          }}
        />
      </div>
      <div className="container m-auto flex flex-wrap flex-col md:flex-row items-center justify-start p-2">
        {data?.missions.map((mission: Mission, i: number) => (
          <div key={i} className=" w-full lg:w-1/2 p-3">
            <div
              className="bg-indigo-600 text-white rounded shadow-xl p-3 cursor-pointer"
              onClick={() => {
                setSelectedMission(mission);
                setShowMissionModal(true);
              }}
            >
              <h3 className="text-xl text-center">{mission.name}</h3>
            </div>
          </div>
        ))}
        <MissionModal
          mission={selectedMission}
          showModal={showMissionModal}
          setShowModal={setShowMissionModal}
        />
      </div>
    </div>
  );
};

export default MissionsPage;
