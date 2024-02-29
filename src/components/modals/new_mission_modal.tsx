import { Process, selectTheme } from "@/data/consts";
import { Mission } from "@/types/mission";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button, Switch } from "@material-tailwind/react";
import React, { useState } from "react";
import {
  TEInput,
  TEModal,
  TEModalBody,
  TEModalContent,
  TEModalDialog,
  TEModalFooter,
  TEModalHeader,
  TERipple,
  TESelect,
} from "tw-elements-react";
import MissionTaskEditor from "../inputs/mission_tasks_editor";
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

  const { loading, error, data: agentsData } = useQuery(GET_AGENTS);

  const [createMission] = useMutation(CREATE_MISSION);
  const [createMissionLoading, setCreateMissionLoading] = useState(false);

  const handleCreateMission = (missionData: Mission) => {
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
              <button
                type="button"
                className="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
                onClick={() => setShowModal(false)}
                aria-label="Close"
              >
                <Icon icon="ep:close-bold" width={20} height={20} />
              </button>
            </TEModalHeader>
            <TEModalBody>
              <div>
                <div className="mb-4">
                  <label className="font-bold text-lg">Name:</label>
                  <TEInput
                    type="text"
                    className="mt-2"
                    value={tempMission?.name}
                    onChange={(event) => {
                      setTempMission((prevState) => ({
                        ...prevState!,
                        name: event.target.value,
                      }));
                    }}
                  />
                </div>
                <div className="mb-4">
                  <span className="font-bold mr-2 text-lg">Crew (Agents):</span>
                  <br />
                  {loading ? (
                    <Button
                      variant="text"
                      loading={true}
                      placeholder={"Loading"}
                      className="text-white"
                    >
                      Loading
                    </Button>
                  ) : (
                    <TESelect
                      data={agentsData.agents.map((agent: Agent) => ({
                        text: agent.role,
                        value: agent.id,
                      }))}
                      multiple
                      onValueChange={(event: any) => {
                        const newValue = event.map((item: any) => item.value);
                        const newCrew = agentsData.agents.filter(
                          (agent: Agent) => newValue.includes(agent.id)
                        );
                        setTempMission((prevState) => ({
                          ...prevState!,
                          crew: newCrew,
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
                <div className="mb-4">
                  <label className="font-bold text-lg">Tasks:</label>
                  <div>
                    <MissionTaskEditor
                      mission={tempMission!}
                      agents={agentsData?.agents}
                      onMissionChange={(mission: Mission) => {
                        setTempMission(mission);
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label className="font-bold text-lg">Result:</label>
                  {tempMission?.result && (
                    <div className="border-2 rounded p-2">
                      {tempMission?.result}
                    </div>
                  )}
                </div>
                <div className="my-3">
                  <button className="mx-auto block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white">
                    {tempMission?.result ? "Re-Run" : "Run"}
                  </button>
                </div>
              </div>
            </TEModalBody>

            <TEModalFooter>
              <TERipple rippleColor="light">
                <Button
                  color="white"
                  onClick={() => setShowModal(false)}
                  placeholder={undefined}
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
