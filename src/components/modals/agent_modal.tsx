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
import Switch from "../inputs/switch";
import TWFileInput from "../inputs/file";

export default function AgentModal(props: {
  agent: Agent | null;
  showModal: boolean;
  setShowModal: Function;
}): JSX.Element {
  const { agent, showModal, setShowModal } = props;

  const [isEdit, setEdit] = useState(false);

  const [tempAgent, setTempAgent] = useState<Agent | null>(agent);

  useEffect(() => {
    setTempAgent(agent);
  }, [agent]);

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
                        checked={agent?.allowDelegation}
                        disabled={true}
                      />
                    )}
                  </div>
                  <div className="flex items-center mb-4">
                    <label className="font-bold mx-2">Verbose: </label>
                    {isEdit ? (
                      <Switch
                        defaultChecked={tempAgent?.verbose}
                        onChange={(event) => {
                          setTempAgent((prevState) => ({
                            ...prevState!,
                            verbose: !!event.target.value,
                          }));
                        }}
                      />
                    ) : (
                      <Switch checked={agent?.verbose} disabled={true} />
                    )}
                  </div>
                </div>

                <div className="m-4 sm:w-1/2">
                  {isEdit ? (
                    <>
                      <label className="font-bold mx-2">Agent Image: </label>
                      <TWFileInput accept="image/*" />
                    </>
                  ) : (
                    <img
                      src={agent?.image ?? "/sailor.png"}
                      alt="Software Engineer"
                      className="w-full rounded-lg"
                    />
                  )}
                </div>
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
