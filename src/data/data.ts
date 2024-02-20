import { Agent } from "@/types/agent";

export const agents: Array<Agent> = [
  {
    role: "Senior Software Engineer",
    goal: "Create software as needed",
    backstory: `
        You are a Senior Software Engineer at a leading tech think tank.
		Your expertise in programming in python. and do your best to
		produce perfect code
    `,
    tools: ["DUCK_DUCK_GO_SEARCH", "PYTHON_REPL", "STACK_EXCHANGE"],
    allowDelegation: false,
    verbose: true,
    image:
      "https://cdn.pixabay.com/photo/2021/08/04/13/06/software-developer-6521720_1280.jpg",
  },
  {
    role: "Software Quality Control Engineer",
    goal: "create prefect code, by analizing the code that is given for errors",
    backstory: `
        You are a software engineer that specializes in checking code for errors.
        You have an eye for detail and a knack for finding hidden bugs.
        You check for missing imports, variable declarations, mismatched brackets and syntax errors.
        You also check for security vulnerabilities, and logic errors.
    `,
    tools: [],
    allowDelegation: false,
    verbose: true,
    image:
      "https://cdn.pixabay.com/photo/2021/08/04/13/06/software-developer-6521720_1280.jpg",
  },
  {
    role: "Chief Software Quality Control Engineer",
    goal: "Ensure that the code does the job that it is supposed to do",
    backstory: `
        You feel that programmers always do only half the job, so you are
        super dedicate to make high quality code.
    `,
    tools: [],
    allowDelegation: false,
    verbose: true,
    image:
      "https://cdn.pixabay.com/photo/2021/08/04/13/06/software-developer-6521720_1280.jpg",
  },
];

export const tools = [
  { text: "tool1", value: "tool1" },
  { text: "tool2", value: "tool2" },
  { text: "tool3", value: "tool3" },
  { text: "tool4", value: "tool4" },
  { text: "tool5", value: "tool5" },
];

export const missions = [
  {
    name: "Mission1",
    crew: [
      "Senior Software Engineer",
      "Software Quality Control Engineer",
      "Chief Software Quality Control Engineer",
    ],
    tasks: [
      {
        name: "Task1",
        description: "description description description description",
        agent: "Senior Software Engineer",
      },
      {
        name: "Task2",
        description: "description description description description",
        agent: "Chief Software Quality Control Engineer",
      },
    ],
    verbose: true,
    process: "sequential",
    result: "",
  },
  {
    name: "Mission2",
    crew: [
      "Senior Software Engineer",
      "Software Quality Control Engineer",
      "Chief Software Quality Control Engineer",
    ],
    tasks: [
      {
        name: "Task1",
        description: "description description description description",
        agent: "Senior Software Engineer",
      },
      {
        name: "Task2",
        description: "description description description description",
        agent: "Chief Software Quality Control Engineer",
      },
    ],
    verbose: true,
    process: "sequential",
    result:
      "result result result result result result result result result result result ",
  },
  {
    name: "Mission3",
    crew: [
      "Senior Software Engineer",
      "Software Quality Control Engineer",
      "Chief Software Quality Control Engineer",
    ],
    tasks: [
      {
        name: "Task1",
        description: "description description description description",
        agent: "Senior Software Engineer",
      },
      {
        name: "Task2",
        description: "description description description description",
        agent: "Chief Software Quality Control Engineer",
      },
    ],
    verbose: true,
    process: "sequential",
    result:
      "result result result result result result result result result result result ",
  },
];
