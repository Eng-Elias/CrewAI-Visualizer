"use client";

import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import {
  TERipple,
  TEModal,
  TEModalDialog,
  TEModalContent,
  TEModalHeader,
  TEModalBody,
  TEModalFooter,
  TESelect,
} from "tw-elements-react";
import { Mission } from "@/types/mission";
import MissionTaskEditor from "../inputs/mission_tasks_editor";
import { TasksAccordion } from "../ui/tasks_accordions";
import { Process, selectTheme } from "@/data/consts";
import { Alert, Button, Input, Switch } from "@material-tailwind/react";
import { useMutation, useQuery } from "@apollo/client";
import {
  DELETE_MISSION,
  GET_AGENTS,
  RUN_MISSION,
  UPDATE_MISSION,
} from "@/utils/graphql_queries";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { Agent } from "@/types/agent";

export default function MissionModal(props: {
  mission: Mission;
  showModal: boolean;
  setShowModal: Function;
  onUpdateMission?: Function;
  onRunMission?: Function;
  onDeleteMission?: Function;
}): JSX.Element {
  const {
    mission,
    showModal,
    setShowModal,
    onUpdateMission = () => {},
    onRunMission = () => {},
    onDeleteMission = () => {},
  } = props;

  const [isEdit, setEdit] = useState(false);

  const [tempMission, setTempMission] = useState<Mission>(mission);
  const [missionResult, setMissionResult] = useState<String>(
    mission?.result ?? ""
  );

  useEffect(() => {
    setTempMission(mission);
    setMissionResult(mission?.result ?? "");
  }, [mission]);

  const {
    loading,
    error: agentsError,
    data: agentsData,
  } = useQuery(GET_AGENTS);

  const [updateMission] = useMutation(UPDATE_MISSION);
  const [updateMissionLoading, setUpdateMissionLoading] = useState(false);

  const handleUpdateMission = async (missionData: Mission) => {
    setUpdateMissionLoading(true);
    return updateMission({
      variables: {
        ...missionData,
        // TODO: Check why Prisma Schema (id Int) return String.
        id: Number.parseInt(missionData.id as string),
        crew: missionData.crew
          .filter((agent) => Number.parseInt(agent?.id as string))
          .map((agent) => Number.parseInt(agent.id as string)),
        tasks: missionData.tasks.map((task) => ({
          name: task.name,
          description: task.description,
          expected_output: task.expected_output,
          agent: Number.parseInt(task.agent?.id as string),
        })),
      },
    }).finally(() => {
      setUpdateMissionLoading(false);
    });
  };

  const ReactSwal = withReactContent(Swal);

  const [runMission] = useMutation(RUN_MISSION);
  const [runMissionLoading, setRunMissionLoading] = useState(false);

  const handleRunMission = async () => {
    setRunMissionLoading(true);
    return runMission({
      variables: {
        id: Number.parseInt(mission.id as string),
      },
    }).finally(() => {
      setRunMissionLoading(false);
    });
  };

  const [deleteMission] = useMutation(DELETE_MISSION);
  const [deleteMissionLoading, setDeleteMissionLoading] = useState(false);

  const handleDeleteMission = async () => {
    setDeleteMissionLoading(true);
    return deleteMission({
      variables: {
        id: Number.parseInt(mission.id as string),
      },
    }).finally(() => {
      setDeleteMissionLoading(false);
    });
  };

  return (
    <div>
      <TEModal show={showModal} setShow={setShowModal}>
        <TEModalDialog size="lg">
          <TEModalContent style={{ backgroundColor: "#282828" }}>
            <TEModalHeader>
              <h1 className="text-xl font-medium leading-normal">
                {mission?.name}
              </h1>
              <Button
                onClick={() => setShowModal(false)}
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                <Icon icon="ep:close-bold" width={20} height={20} />
              </Button>
            </TEModalHeader>
            <TEModalBody>
              <div>
                {isEdit && (
                  <div className="mb-4">
                    <label className="font-bold text-lg">Name:</label>
                    <Input
                      label="Name"
                      color="blue"
                      className="text-white"
                      value={tempMission?.name}
                      onChange={(event) => {
                        setTempMission((prevState) => ({
                          ...prevState!,
                          name: event.target.value,
                        }));
                      }}
                      crossOrigin={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    />
                  </div>
                )}
                <div className="mb-4">
                  <span className="font-bold mr-2 text-lg">Crew (Agents):</span>
                  <br />
                  {agentsError && (
                    <>
                      <div className="w-full my-1">
                        <Alert
                          color="yellow"
                          icon={
                            <Icon
                              icon="material-symbols:warning-outline"
                              fontSize={26}
                            />
                          }
                          className="w-fit"
                        >
                          {agentsError?.message ?? "An error occurred."}
                        </Alert>
                      </div>
                    </>
                  )}
                  {isEdit ? (
                    loading ? (
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
                    ) : (
                      <TESelect
                        data={
                          agentsData?.agents.map((agent: Agent) => ({
                            text: agent.role,
                            value: agent.id,
                          })) ?? []
                        }
                        multiple
                        value={tempMission.crew.map((agent) => agent.id!)}
                        onValueChange={(event: any) => {
                          const newValue = event.map((item: any) => item.value);
                          const newCrew =
                            agentsData?.agents.filter((agent: Agent) =>
                              newValue.includes(agent.id)
                            ) ?? [];
                          const newTasks = tempMission.tasks.map((task) => ({
                            ...task,
                            agent:
                              newCrew.find(
                                (agent: Agent) => agent.id === task.agent?.id
                              ) ?? null,
                          }));
                          setTempMission((prevState) => ({
                            ...prevState!,
                            crew: newCrew,
                            tasks: newTasks,
                          }));
                        }}
                        theme={selectTheme}
                      />
                    )
                  ) : (
                    mission?.crew.map((agent, i) => (
                      <>
                        <div
                          key={i}
                          className="bg-gray-200 text-gray-700 rounded-full px-3 py-1 text-sm font-semibold m-1 sm:w-1/2"
                        >
                          {agent.role}
                        </div>
                      </>
                    ))
                  )}
                </div>
                <div className="flex items-center mb-4">
                  <label className="font-bold mx-2">Verbose: </label>
                  {isEdit ? (
                    <Switch
                      crossOrigin={undefined}
                      color="blue"
                      defaultChecked={tempMission?.verbose}
                      onChange={(event) => {
                        setTempMission((prevState) => ({
                          ...prevState!,
                          verbose: !!event.target.value,
                        }));
                      }}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    />
                  ) : (
                    <Switch
                      crossOrigin={undefined}
                      color="blue"
                      checked={mission?.verbose}
                      disabled={true}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    />
                  )}
                </div>
                <div className="mb-4">
                  <label className="font-bold text-lg">Process:</label>
                  {isEdit ? (
                    <TESelect
                      data={[
                        { text: Process.SEQUENTIAL, value: Process.SEQUENTIAL },
                        {
                          text: Process.HIERARCHICAL,
                          value: Process.HIERARCHICAL,
                        },
                      ]}
                      value={tempMission?.process}
                      onValueChange={(event: any) => {
                        setTempMission((prevState) => ({
                          ...prevState!,
                          process: event?.value,
                        }));
                      }}
                      className="dark:text-black"
                      theme={selectTheme}
                    />
                  ) : (
                    <span className="bg-blue-300 text-gray-700 rounded-full px-3 py-1 text-sm font-semibold m-1">
                      {mission?.process}
                    </span>
                  )}
                </div>
                <div className="mb-4">
                  <label className="font-bold text-lg">Tasks:</label>
                  {isEdit ? (
                    <div>
                      <MissionTaskEditor
                        mission={tempMission!}
                        agents={tempMission?.crew!}
                        onMissionChange={(mission: Mission) => {
                          setTempMission(mission);
                        }}
                      />
                    </div>
                  ) : (
                    <div>
                      {mission?.tasks.length > 0 ? (
                        <div>
                          <TasksAccordion tasks={mission.tasks} />
                        </div>
                      ) : (
                        <div>
                          There is no task, please add at least one task.
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {!isEdit && (
                  <>
                    <div className="my-3">
                      <Button
                        color="blue"
                        disabled={
                          runMissionLoading || mission?.tasks.length === 0
                        }
                        onClick={() => {
                          handleRunMission()
                            .then((missionData) => {
                              const { result, error, message } =
                                missionData.data.runMission;
                              if (!error) {
                                setMissionResult(result);
                                ReactSwal.fire({
                                  title: "Finished",
                                  text: "Mission finished successfully",
                                  icon: "success",
                                });
                                onRunMission();
                              } else {
                                ReactSwal.fire({
                                  title: "Error",
                                  text: message,
                                  icon: "error",
                                });
                              }
                            })
                            .catch((error) => {
                              ReactSwal.fire({
                                title: "Error",
                                text: error,
                                icon: "error",
                              });
                            });
                        }}
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      >
                        {mission?.result ? "Re-Run" : "Run"}
                      </Button>
                      {runMissionLoading && (
                        <Button
                          variant="text"
                          loading={true}
                          placeholder={"Running"}
                          className="text-white"
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                        >
                          Running
                        </Button>
                      )}
                    </div>
                    <div>
                      <label className="font-bold text-lg">Result:</label>
                      <div
                        className="border-2 rounded p-2"
                        style={{ whiteSpace: "pre-line" }}
                      >
                        {missionResult}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </TEModalBody>

            {/* Update Mission */}
            <TEModalFooter>
              {!isEdit && (
                <>
                  <TERipple rippleColor="light">
                    <Button
                      color="red"
                      className="mx-1"
                      loading={deleteMissionLoading}
                      onClick={() => {
                        ReactSwal.fire({
                          title: "Pay Attention",
                          text: "Are you sure you want to delete this mission?",
                          icon: "error",
                        })
                          .then(() => {
                            handleDeleteMission().then(() => {
                              setShowModal(false);
                              onDeleteMission();
                              ReactSwal.fire({
                                title: "Deleted",
                                text: "Mission deleted successfully",
                                icon: "success",
                              });
                            });
                          })
                          .catch((error) => {
                            ReactSwal.fire({
                              title: "Error",
                              text: error,
                              icon: "warning",
                            });
                          });
                      }}
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      Delete
                    </Button>
                  </TERipple>
                  <TERipple rippleColor="light">
                    <Button
                      color="green"
                      onClick={() => setEdit(true)}
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      Edit
                    </Button>
                  </TERipple>
                </>
              )}
              {isEdit && (
                <>
                  <TERipple rippleColor="light">
                    <Button
                      color="white"
                      onClick={() => setEdit(false)}
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      Cancel
                    </Button>
                  </TERipple>
                  <TERipple rippleColor="light">
                    <Button
                      color="green"
                      loading={updateMissionLoading}
                      disabled={!tempMission.name || updateMissionLoading}
                      onClick={() => {
                        handleUpdateMission(tempMission)
                          .then(() => {
                            setShowModal(false);
                            setEdit(false);
                            ReactSwal.fire({
                              title: "Update Mission",
                              text: "Mission updated successfully",
                              icon: "success",
                            });
                            onUpdateMission();
                          })
                          .catch((error) => {
                            ReactSwal.fire({
                              title: "Error",
                              text: error,
                              icon: "error",
                            });
                          });
                      }}
                      className="mx-1"
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      Save Changes
                    </Button>
                  </TERipple>
                </>
              )}
            </TEModalFooter>
          </TEModalContent>
        </TEModalDialog>
      </TEModal>
    </div>
  );
}
