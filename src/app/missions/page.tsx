"use client";

import MissionModal from "@/components/modals/mission_modal";
import { missions } from "@/data/data";
import { Mission } from "@/types/mission";
import { useState } from "react";

const MissionsPage = () => {
  const [showModal, setShowModal] = useState(false);

  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  return (
    <div className="container m-auto flex flex-wrap flex-col md:flex-row items-center justify-start p-2">
      {missions.map((mission, i) => (
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
