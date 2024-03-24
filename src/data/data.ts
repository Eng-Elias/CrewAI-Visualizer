import { Agent } from "@/types/agent";
import { Mission } from "@/types/mission";

export const agents: Array<Agent> = [
  {
    role: "Senior Software Engineer",
    goal: "Create software as needed",
    backstory: `
        You are a Senior Software Engineer at a leading tech think tank.
		Your expertise in programming in python. and do your best to
		produce perfect code
    `,
    tools: ["DUCK_DUCK_GO_SEARCH"],
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
    tools: ["DUCK_DUCK_GO_SEARCH"],
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
    tools: ["SEMANTIC_SCHOLER", "WIKIDATA", "YUOUTUBE_SEARCH"],
    allowDelegation: false,
    verbose: true,
    image:
      "https://cdn.pixabay.com/photo/2021/08/04/13/06/software-developer-6521720_1280.jpg",
  },
];

export const tools = [
  { text: "DUCK_DUCK_GO_SEARCH", value: "DUCK_DUCK_GO_SEARCH" },
  { text: "SEMANTIC_SCHOLER", value: "SEMANTIC_SCHOLER" },
  { text: "WIKIDATA", value: "WIKIDATA" },
  { text: "WIKIPEDIA", value: "WIKIPEDIA" },
  { text: "YAHOO_FINANCE", value: "YAHOO_FINANCE" },
  { text: "YUOUTUBE_SEARCH", value: "YUOUTUBE_SEARCH" },
  { text: "ARXIV", value: "ARXIV" },
  { text: "PUBMED", value: "PUBMED" },
];

const game = `
"Chrono Quest: Time Traveler" is a narrative-driven web game where players embark on a thrilling journey through different historical periods to save the fabric of time. As a time-traveling adventurer, players must navigate various eras, from ancient civilizations to futuristic worlds, solving puzzles, interacting with historical figures, and altering events to prevent a catastrophic temporal paradox.
Players will face diverse challenges, from deciphering ancient codes in the Egyptian pyramids to outsmarting futuristic robots in a dystopian metropolis. Each decision impacts the course of history and the outcome of the game, leading to multiple branching storylines and endings.
With stunning visuals, immersive storytelling, and dynamic gameplay mechanics, "Chrono Quest: Time Traveler" offers an unforgettable experience that combines elements of adventure, strategy, and puzzle-solving. Dive into the depths of time and rewrite history in this epic web-based adventure game.
`;

export const missions: Array<Mission> = [
  {
    name: "Game Building",
    crew: agents,
    tasks: [
      {
        name: "Code Task",
        description: `
        You will create a game using python, these are the instructions:

			  Instructions
			  ------------
    	  ${game}
        `,
        expected_output:
          "Your Final answer must be the full python code, only the python code and nothing else.",
        agent: agents[0],
      },
      {
        name: "Review Task",
        description: `
        You are helping create a game using python, these are the instructions:

			  Instructions
			  ------------
        ${game}

        Using the code you got, check for errors. Check for logic errors,
        syntax errors, missing imports, variable declarations, mismatched brackets,
        and security vulnerabilities.
        `,
        expected_output:
          "Your Final answer must be the full python code, only the python code and nothing else.",
        agent: agents[1],
      },
      {
        name: "Evaluate Task",
        description: `
        You are helping create a game using python, these are the instructions:

        Instructions
        ------------
        ${game}

        You will look over the code to insure that it is complete and
        does the job that it is supposed to do.
        `,
        expected_output:
          "Your Final answer must be the full python code, only the python code and nothing else.",
        agent: agents[2],
      },
    ],
    verbose: true,
    process: "SEQUENTIAL",
    result: "",
  },
  {
    name: "Mission1",
    crew: agents,
    tasks: [
      {
        name: "Task1",
        description: "description description description description",
        expected_output: "Expected Output",
        agent: agents[0],
      },
      {
        name: "Task2",
        description: "description description description description",
        expected_output: "Expected Output",
      },
    ],
    verbose: true,
    process: "SEQUENTIAL",
    result: "result",
  },
  {
    name: "Mission1",
    crew: agents,
    tasks: [
      {
        name: "Task1",
        description: "description description description description",
        expected_output: "Expected Output",
        agent: agents[0],
      },
      {
        name: "Task2",
        description: "description description description description",
        expected_output: "Expected Output",
      },
    ],
    verbose: true,
    process: "SEQUENTIAL",
    result: "result",
  },
];
