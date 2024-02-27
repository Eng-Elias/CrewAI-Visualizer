import { selectTheme } from "@/data/consts";
import { tools } from "@/data/data";
import { Agent } from "@/types/agent";
import { Icon } from "@iconify/react/dist/iconify.js";
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
  TETextarea,
} from "tw-elements-react";
import TWFileInput from "../inputs/file";
import { Switch } from "@material-tailwind/react";

function NewAgentModal(props: { showModal: boolean; setShowModal: Function }) {
  const { showModal, setShowModal } = props;

  const [tempAgent, setTempAgent] = useState<Agent | null>();

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

  return (
    <div>
      <TEModal show={showModal} setShow={setShowModal}>
        <TEModalDialog size="lg">
          <TEModalContent style={{ backgroundColor: "#282828" }}>
            <TEModalHeader>
              <h1 className="text-xl font-medium leading-normal">
                Add new agent to you Crew
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
                  <div className="mb-4">
                    <label className="font-bold text-lg">Goal:</label>
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
                  </div>
                  <div className="mb-4">
                    <label className="font-bold text-lg">Backstory:</label>
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
                  </div>
                  <div className="flex flex-wrap mb-4">
                    <span className="font-bold mr-2 text-lg">Tools:</span>
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
                  </div>
                  <div className="flex items-center mb-4">
                    <label className="font-bold mx-2">Allow Delegation: </label>
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
                  </div>
                  <div className="flex items-center mb-4">
                    <label className="font-bold mx-2">Verbose: </label>
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
                  </div>
                </div>

                <div className="m-4 sm:w-1/2">
                  <label className="font-bold mx-2">Agent Image: </label>
                  <TWFileInput accept="image/*" onChange={handleImageChange} />
                  {selectedImage && (
                    <img
                      // @ts-ignore
                      src={selectedImage}
                      alt="Agent Image"
                      className="mx-auto my-3 max-w-72 h-auto"
                    />
                  )}
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
                  Add
                </button>
              </TERipple>
            </TEModalFooter>
          </TEModalContent>
        </TEModalDialog>
      </TEModal>
    </div>
  );
}

export default NewAgentModal;
