import { gql } from "@apollo/client";

export const GET_AGENTS = gql`
  query GetAgents {
    agents {
      id
      role
      goal
      backstory
      tools
      allowDelegation
      verbose
      memory
      image
    }
  }
`;

export const GET_AGENT_BY_ID = gql`
  query GetAgentById($id: Int!) {
    agent(id: $id) {
      id
      role
      goal
      backstory
      tools
      allowDelegation
      verbose
      memory
      image
      missions {
        id
        name
      }
    }
  }
`;

export const CREATE_AGENT = gql`
  mutation CreateAgent(
    $role: String!
    $goal: String!
    $backstory: String
    $tools: [AgentTool!]
    $allowDelegation: Boolean!
    $verbose: Boolean!
    $memory: Boolean
  ) {
    createAgent(
      role: $role
      goal: $goal
      backstory: $backstory
      tools: $tools
      allowDelegation: $allowDelegation
      verbose: $verbose
      memory: $memory
    ) {
      id
      role
      goal
      backstory
      tools
      allowDelegation
      verbose
      memory
      image
    }
  }
`;

export const UPDATE_AGENT = gql`
  mutation UpdateAgent(
    $id: Int!
    $role: String
    $goal: String
    $backstory: String
    $tools: [AgentTool!]
    $allowDelegation: Boolean
    $verbose: Boolean
    $memory: Boolean
  ) {
    updateAgent(
      id: $id
      role: $role
      goal: $goal
      backstory: $backstory
      tools: $tools
      allowDelegation: $allowDelegation
      verbose: $verbose
      memory: $memory
    ) {
      id
      role
      goal
      backstory
      tools
      allowDelegation
      verbose
      memory
      image
    }
  }
`;

export const DELETE_AGENT = gql`
  mutation DeleteAgent($id: Int!) {
    deleteAgent(id: $id) {
      deleted
    }
  }
`;

export const GET_MISSIONS = gql`
  query GetMissions {
    missions {
      id
      name
      crew {
        id
        role
        goal
        backstory
        tools
        allowDelegation
        verbose
        memory
        image
      }
      tasks {
        name
        description
        expected_output
        agent {
          id
          role
        }
      }
      verbose
      process
      result
    }
  }
`;

export const GET_MISSION_BY_ID = gql`
  query GetMissionById($id: Int!) {
    mission(id: $id) {
      id
      name
      crew {
        id
        role
        goal
        backstory
        tools
        allowDelegation
        verbose
        memory
        image
      }
      tasks {
        name
        description
        expected_output
        agent {
          id
          role
        }
      }
      verbose
      process
      result
    }
  }
`;

export const CREATE_MISSION = gql`
  mutation CreateMission(
    $name: String!
    $crew: [Int!]
    $verbose: Boolean
    $process: MissionProcess
  ) {
    createMission(
      name: $name
      crew: $crew
      verbose: $verbose
      process: $process
    ) {
      id
      name
      crew {
        id
        role
        goal
        backstory
        tools
        allowDelegation
        verbose
        memory
        image
      }
      tasks {
        name
        description
        expected_output
        agent {
          id
          role
        }
      }
      verbose
      process
      result
    }
  }
`;

export const UPDATE_MISSION = gql`
  mutation UpdateMission(
    $id: Int!
    $name: String
    $crew: [Int!]
    $tasks: [TaskInput!]
    $verbose: Boolean
    $process: MissionProcess
  ) {
    updateMission(
      id: $id
      name: $name
      crew: $crew
      tasks: $tasks
      verbose: $verbose
      process: $process
    ) {
      id
      name
      crew {
        id
        role
        goal
        backstory
        tools
        allowDelegation
        verbose
        memory
        image
      }
      tasks {
        name
        description
        expected_output
        agent {
          id
          role
        }
      }
      verbose
      process
      result
    }
  }
`;

export const DELETE_MISSION = gql`
  mutation DeleteMission($id: Int!) {
    deleteMission(id: $id) {
      deleted
    }
  }
`;

export const RUN_MISSION = gql`
  mutation RunMission($id: Int!) {
    runMission(id: $id) {
      result
      error
      message
    }
  }
`;
