"use client";

import MissionModal from "@/components/modals/mission_modal";
import NewMissionModal from "@/components/modals/new_mission_modal";
import { Mission } from "@/types/mission";
import { GET_MISSIONS } from "@/utils/graphql_queries";
import { useQuery } from "@apollo/client";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Alert, Button, IconButton } from "@material-tailwind/react";
import { useState } from "react";

const MissionsPage = () => {
  const [showMissionModal, setShowMissionModal] = useState(false);
  const [showNewMissionModal, setShowNewMissionModal] = useState(false);

  const [selectedMission, setSelectedMission] = useState<Mission>();

  const { loading, error, data, refetch } = useQuery(GET_MISSIONS);

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

  if (error) {
    return (
      <div className="w-full">
        <Alert
          color="yellow"
          icon={<Icon icon="material-symbols:warning-outline" fontSize={26} />}
          className="w-fit"
        >
          {error?.message ?? "An error occurred."}
        </Alert>
      </div>
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
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
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
      {data?.missions.length === 0 && (
        <div className="w-full">
          <Alert
            color="cyan"
            icon={
              <Icon icon="material-symbols:warning-outline" fontSize={26} />
            }
            className="w-fit"
          >
            No missions, Try to add one.
          </Alert>
        </div>
      )}
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
          mission={selectedMission!}
          showModal={showMissionModal}
          setShowModal={setShowMissionModal}
          onUpdateMission={() => {
            refetch();
          }}
          onRunMission={() => {
            refetch();
          }}
          onDeleteMission={() => {
            refetch();
          }}
        />
      </div>
    </div>
  );
};

export default MissionsPage;
