"use client";

import MissionModal from "@/components/modals/mission_modal";
import { missions } from "@/data/data";
import { Mission } from "@/types/mission";
import { GET_MISSIONS } from "@/utils/graphql_queries";
import { useQuery } from "@apollo/client";
import { Button } from "@material-tailwind/react";
import { useState } from "react";

const MissionsPage = () => {
  const [showModal, setShowModal] = useState(false);

  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);

  const { loading, error, data } = useQuery(GET_MISSIONS);

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
      {data?.missions.map((mission: Mission, i: number) => (
        <div key={i} className=" w-full lg:w-1/2 p-3">
          <div
            className="bg-indigo-600 text-white rounded shadow-xl p-3 cursor-pointer"
            onClick={() => {
              setSelectedMission(mission);
              setShowModal(true);
            }}
          >
            <h3 className="text-xl text-center">{mission.name}</h3>
          </div>
        </div>
      ))}
      <MissionModal
        mission={selectedMission}
        showModal={showModal}
        setShowModal={setShowModal}
      />
    </div>
  );
};

export default MissionsPage;
