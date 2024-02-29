"use client";

import { tools } from "@/data/data";
import { Agent } from "@/types/agent";
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
import TWFileInput from "../inputs/file";
import { selectTheme } from "@/data/consts";
import { Button, Switch } from "@material-tailwind/react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { UPDATE_AGENT } from "@/utils/graphql_queries";
import { useMutation } from "@apollo/client";

export default function AgentModal(props: {
  agent: Agent;
  showModal: boolean;
  setShowModal: Function;
  onUpdateAgent: Function;
}): JSX.Element {
  const { agent, showModal, setShowModal, onUpdateAgent = () => {} } = props;

  const [isEdit, setEdit] = useState(false);

  const [tempAgent, setTempAgent] = useState<Agent>(agent);

  useEffect(() => {
    setTempAgent(agent);
  }, [agent]);

  const [selectedImage, setSelectedImage] = useState<
    string | ArrayBuffer | null
  >(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setSelectedImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const [updateAgent] = useMutation(UPDATE_AGENT);
  const [updateAgentLoading, setUpdateAgentLoading] = useState(false);

  const handleUpdateAgent = async (agentData: Agent) => {
    setUpdateAgentLoading(true);
    return updateAgent({
      variables: {
        ...agentData,
        id: Number.parseInt(agentData.id as string),
      },
    }).finally(() => {
      setUpdateAgentLoading(false);
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
                {agent?.role}
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
              <div className="sm:flex">
                <div className="sm:w-1/2">
                  {isEdit && (
                    <div className="mb-4">
                      <label className="font-bold text-lg">Role:</label>
                      <TEInput
                        type="text"
                        className="mt-2"
                        value={tempAgent?.role}
                        onChange={(event) => {
                          setTempAgent((prevState) => ({
                            ...prevState!,
                            role: event.target.value,
                          }));
                        }}
                      />
                    </div>
                  )}
                  <div className="mb-4">
                    <label className="font-bold text-lg">Goal:</label>
                    {isEdit ? (
                      <TEInput
                        type="text"
                        className="mt-2"
                        value={tempAgent?.goal}
                        onChange={(event) => {
                          setTempAgent((prevState) => ({
                            ...prevState!,
                            goal: event.target.value,
                          }));
                        }}
                      />
                    ) : (
                      <div>{agent?.goal}</div>
                    )}
                  </div>
                  <div className="mb-4">
                    <label className="font-bold text-lg">Backstory:</label>
                    {isEdit ? (
                      <TETextarea
                        rows={4}
                        value={tempAgent?.backstory || ""}
                        onChange={(event) => {
                          setTempAgent((prevState) => ({
                            ...prevState!,
                            backstory: event.target.value,
                          }));
                        }}
                      />
                    ) : (
                      <div>{agent?.backstory}</div>
                    )}
                  </div>
                  <div className="flex flex-wrap mb-4">
                    <span className="font-bold mr-2 text-lg">Tools:</span>
                    {isEdit ? (
                      <TESelect
                        data={tools}
                        multiple
                        value={tempAgent?.tools}
                        onValueChange={(event: any) => {
                          const newValue = event.map((item: any) => item.value);
                          setTempAgent((prevState) => ({
                            ...prevState!,
                            tools: newValue,
                          }));
                        }}
                        className="w-full"
                        theme={selectTheme}
                      />
                    ) : (
                      agent?.tools.map((tool) => (
                        <span
                          key={tool}
                          className="bg-gray-200 text-gray-700 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2"
                        >
                          {tool}
                        </span>
                      ))
                    )}
                  </div>
                  <div className="flex items-center mb-4">
                    <label className="font-bold mx-2">Allow Delegation: </label>
                    {isEdit ? (
                      <Switch
                        crossOrigin={undefined}
                        color="blue"
                        defaultChecked={tempAgent?.allowDelegation}
                        onChange={(event) => {
                          setTempAgent((prevState) => ({
                            ...prevState!,
                            allowDelegation: !!event.target.value,
                          }));
                        }}
                      />
                    ) : (
                      <Switch
                        crossOrigin={undefined}
                        color="blue"
                        defaultChecked={tempAgent?.allowDelegation}
                        disabled={true}
                      />
                    )}
                  </div>
                  <div className="flex items-center mb-4">
                    <label className="font-bold mx-2">Verbose: </label>
                    {isEdit ? (
                      <Switch
                        crossOrigin={undefined}
                        color="blue"
                        defaultChecked={tempAgent?.verbose}
                        onChange={(event) => {
                          setTempAgent((prevState) => ({
                            ...prevState!,
                            verbose: !!event.target.value,
                          }));
                        }}
                      />
                    ) : (
                      <Switch
                        crossOrigin={undefined}
                        color="blue"
                        defaultChecked={tempAgent?.verbose}
                        disabled={true}
                      />
                    )}
                  </div>
                </div>

                <div className="m-4 sm:w-1/2">
                  {isEdit ? (
                    <>
                      <label className="font-bold mx-2">Agent Image: </label>
                      <TWFileInput
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      {selectedImage && (
                        <img
                          // @ts-ignore
                          src={selectedImage}
                          alt="Agent Image"
                          className="mx-auto my-3 max-w-72 h-auto"
                        />
                      )}
                    </>
                  ) : (
                    <img
                      src={agent?.image ?? "/sailor.png"}
                      alt="Software Engineer"
                      className="w-7/12 mx-auto rounded-lg"
                    />
                  )}
                </div>
              </div>
            </TEModalBody>

            <TEModalFooter>
              {!isEdit && (
                <TERipple rippleColor="light">
                  <Button
                    color="green"
                    onClick={() => setEdit(true)}
                    placeholder={undefined}
                  >
                    Edit
                  </Button>
                </TERipple>
              )}
              {isEdit && (
                <>
                  <TERipple rippleColor="light">
                    <Button
                      color="white"
                      onClick={() => setEdit(false)}
                      placeholder={undefined}
                    >
                      Cancel
                    </Button>
                  </TERipple>
                  <TERipple rippleColor="light">
                    <Button
                      color="blue"
                      loading={updateAgentLoading}
                      disabled={
                        !tempAgent.role || !tempAgent.goal || updateAgentLoading
                      }
                      onClick={() => {
                        handleUpdateAgent(tempAgent)
                          .then(() => {
                            setShowModal(false);
                            ReactSwal.fire({
                              title: "Updated",
                              text: "Agent updated successfully",
                              icon: "success",
                            });
                            onUpdateAgent();
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
