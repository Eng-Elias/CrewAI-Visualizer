"use client";

import { agents, tools } from "@/data/data";
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
  TEInput,
  TETextarea,
  TESelect,
} from "tw-elements-react";
import Switch from "../inputs/switch";
import { Mission } from "@/types/mission";
import { Collapse, initTE } from "tw-elements";
import AccordionItem from "../ui/accordion_item";
import MissionTaskEditor from "../inputs/mission_tasks_editor";

export default function MissionModal(props: {
  mission: Mission | null;
  showModal: boolean;
  setShowModal: Function;
}): JSX.Element {
  const { mission, showModal, setShowModal } = props;

  const [isEdit, setEdit] = useState(false);

  const [tempMission, setTempMission] = useState<Mission | null>(mission);

  useEffect(() => {
    setTempMission(mission);
  }, [mission]);

  useEffect(() => {
    initTE({ Collapse });
  }, []);

  return (
    <div>
      <TEModal show={showModal} setShow={setShowModal}>
        <TEModalDialog size="lg">
          <TEModalContent style={{ backgroundColor: "#282828" }}>
            <TEModalHeader>
              <h1 className="text-xl font-medium leading-normal">
                {mission?.name}
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
                {isEdit && (
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
                )}
                <div className="mb-4">
                  <span className="font-bold mr-2 text-lg">Crew (Agents):</span>
                  <br />
                  {isEdit ? (
                    <TESelect
                      data={agents.map((agent) => ({
                        text: agent.role,
                        value: agent.role,
                      }))}
                      multiple
                      value={tempMission?.crew.map((agent) => agent.role) ?? []}
                      onValueChange={(event: any) => {
                        const newValue = event.map((item: any) => item.value);
                        setTempMission((prevState) => ({
                          ...prevState!,
                          tools: newValue,
                        }));
                      }}
                    />
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
                      defaultChecked={tempMission?.verbose}
                      onChange={(event) => {
                        setTempMission((prevState) => ({
                          ...prevState!,
                          verbose: !!event.target.value,
                        }));
                      }}
                    />
                  ) : (
                    <Switch checked={mission?.verbose} disabled={true} />
                  )}
                </div>
                <div className="mb-4">
                  <label className="font-bold text-lg">Process:</label>
                  {isEdit ? (
                    <TESelect
                      data={[
                        { text: "SEQUENTIAL", value: "SEQUENTIAL" },
                        { text: "HIERARCHICAL", value: "HIERARCHICAL" },
                      ]}
                      value={tempMission?.process}
                      onValueChange={(event: any) => {
                        setTempMission((prevState) => ({
                          ...prevState!,
                          process: event?.value,
                        }));
                      }}
                      className="dark:text-black"
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
                        mission={mission!}
                        onMissionChange={(mission: Mission) => {
                          setTempMission(mission);
                        }}
                      />
                    </div>
                  ) : (
                    <div>
                      {mission?.tasks ? (
                        <div>
                          {mission.tasks.map((task, i) => (
                            <AccordionItem
                              key={i}
                              id={`task${i}`}
                              title={task.name}
                              description={task.description}
                              moreInfo={
                                <div className="ml-3">
                                  <strong>Agent: </strong>
                                  <span className="bg-gray-200 text-gray-700 rounded-full px-3 py-1 text-sm font-semibold m-1 sm:w-1/2">
                                    {task.agent?.role}
                                  </span>
                                </div>
                              }
                            />
                          ))}
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
                    <div>
                      <label className="font-bold text-lg">Result:</label>
                      {mission?.result && (
                        <div className="border-2 rounded p-2">
                          {mission?.result}
                        </div>
                      )}
                    </div>
                    <div className="my-3">
                      <button className="mx-auto block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white">
                        {mission?.result ? "Re-Run" : "Run"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </TEModalBody>

            <TEModalFooter>
              {!isEdit && (
                <TERipple rippleColor="light">
                  <button
                    type="button"
                    onClick={() => setEdit(true)}
                    className="ml-1 inline-block rounded bg-success-600 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                  >
                    Edit
                  </button>
                </TERipple>
              )}
              {isEdit && (
                <>
                  <TERipple rippleColor="light">
                    <button
                      type="button"
                      className="inline-block rounded bg-primary-100 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:bg-primary-accent-100 focus:bg-primary-accent-100 focus:outline-none focus:ring-0 active:bg-primary-accent-200"
                      onClick={() => setEdit(false)}
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
                </>
              )}
            </TEModalFooter>
          </TEModalContent>
        </TEModalDialog>
      </TEModal>
    </div>
  );
}
