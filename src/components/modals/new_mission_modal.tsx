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
import { useQuery } from "@apollo/client";
import { GET_AGENTS } from "@/utils/graphql_queries";
import { Agent } from "@/types/agent";

function NewMissionModal(props: {
  showModal: boolean;
  setShowModal: Function;
}): JSX.Element {
  const { showModal, setShowModal } = props;

  const [tempMission, setTempMission] = useState<Mission | null>({
    id: -1,
    name: "",
    crew: [],
    tasks: [],
    verbose: false,
    process: Process.SEQUENTIAL,
    result: "",
  });

  const { loading, error, data: agentsData } = useQuery(GET_AGENTS);

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
                <button
                  type="button"
                  className="inline-block rounded bg-primary-100 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:bg-primary-accent-100 focus:bg-primary-accent-100 focus:outline-none focus:ring-0 active:bg-primary-accent-200"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </TERipple>
              <TERipple rippleColor="light">
                <button
                  type="button"
                  className="ml-1 inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                >
                  Save changes
                </button>
              </TERipple>
            </TEModalFooter>
          </TEModalContent>
        </TEModalDialog>
      </TEModal>
    </div>
  );
}

export default NewMissionModal;
