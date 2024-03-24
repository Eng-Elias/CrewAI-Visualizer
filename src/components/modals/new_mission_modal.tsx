import { Process, selectTheme } from "@/data/consts";
import { Mission } from "@/types/mission";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Alert, Button, Input, Switch } from "@material-tailwind/react";
import React, { useState } from "react";
import {
  TEModal,
  TEModalBody,
  TEModalContent,
  TEModalDialog,
  TEModalFooter,
  TEModalHeader,
  TERipple,
  TESelect,
} from "tw-elements-react";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_MISSION, GET_AGENTS } from "@/utils/graphql_queries";
import { Agent } from "@/types/agent";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

function NewMissionModal(props: {
  showModal: boolean;
  setShowModal: Function;
  onAddNewMission: Function;
}): JSX.Element {
  const { showModal, setShowModal, onAddNewMission = () => {} } = props;

  const [tempMission, setTempMission] = useState<Mission>({
    name: "",
    crew: [],
    tasks: [],
    verbose: false,
    process: Process.SEQUENTIAL,
    result: "",
  });

  const {
    loading,
    error: agentsError,
    data: agentsData,
  } = useQuery(GET_AGENTS);

  const [createMission] = useMutation(CREATE_MISSION);
  const [createMissionLoading, setCreateMissionLoading] = useState(false);

  const handleCreateMission = async (missionData: Mission) => {
    setCreateMissionLoading(true);
    return createMission({
      variables: {
        ...missionData,
        // TODO: Check why Prisma Schema (id Int) return String.
        crew: missionData.crew
          .filter((agent) => Number.parseInt(agent?.id as string))
          .map((agent) => Number.parseInt(agent.id as string)),
        tasks: missionData.tasks.map((task) => ({
          ...task,
          agent: Number.parseInt(task.agent?.id as string),
        })),
      },
    }).finally(() => {
      setCreateMissionLoading(false);
    });
  };

  const ReactSwal = withReactContent(Swal);

  return (
    <div>
      <TEModal show={showModal} setShow={setShowModal}>
        <TEModalDialog size="lg">
          <TEModalContent style={{ backgroundColor: "#282828" }}>
            <TEModalHeader>
              <h1 className="text-xl font-medium leading-normal">
                Create New Mission
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
                  {loading ? (
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
                  )}
                </div>
                <div className="flex items-center mb-4">
                  <label className="font-bold mx-2">Verbose: </label>
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
                </div>
                <div className="mb-4">
                  <label className="font-bold text-lg">Process:</label>
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
                </div>
              </div>
            </TEModalBody>

            <TEModalFooter>
              <TERipple rippleColor="light">
                <Button
                  color="white"
                  onClick={() => setShowModal(false)}
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  Close
                </Button>
              </TERipple>
              <TERipple rippleColor="light">
                <Button
                  color="green"
                  loading={createMissionLoading}
                  disabled={!tempMission.name || createMissionLoading}
                  onClick={() => {
                    handleCreateMission(tempMission)
                      .then(() => {
                        setShowModal(false);
                        ReactSwal.fire({
                          title: "New Mission",
                          text: "New mission created successfully",
                          icon: "success",
                        });
                        onAddNewMission();
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
                  Add
                </Button>
              </TERipple>
            </TEModalFooter>
          </TEModalContent>
        </TEModalDialog>
      </TEModal>
    </div>
  );
}

export default NewMissionModal;
