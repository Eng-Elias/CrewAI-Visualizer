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
import { Button, Switch } from "@material-tailwind/react";
import { useMutation } from "@apollo/client";
import { CREATE_AGENT } from "@/utils/graphql_queries";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

function NewAgentModal(props: {
  showModal: boolean;
  setShowModal: Function;
  onAddNewAgent: Function;
}) {
  const {
    showModal,
    setShowModal,
    onAddNewAgent: onAddNewAdent = () => {},
  } = props;

  const [tempAgent, setTempAgent] = useState<Agent>({
    role: "",
    goal: "",
    backstory: "",
    tools: [],
    allowDelegation: false,
    verbose: false,
  });

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

  const [createAgent] = useMutation(CREATE_AGENT);
  const [createAgentLoading, setCreateAgentLoading] = useState(false);

  const handleCreateAgent = (agentData: Agent) => {
    setCreateAgentLoading(true);
    return createAgent({
      variables: {
        ...agentData,
      },
    }).finally(() => {
      setCreateAgentLoading(false);
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
                  loading={createAgentLoading}
                  disabled={
                    !tempAgent.role || !tempAgent.goal || createAgentLoading
                  }
                  onClick={() => {
                    handleCreateAgent(tempAgent)
                      .then(() => {
                        setShowModal(false);
                        ReactSwal.fire({
                          title: "Smart Agent",
                          text: "New agent joined to your crew",
                          icon: "success",
                        });
                        onAddNewAdent();
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

export default NewAgentModal;
