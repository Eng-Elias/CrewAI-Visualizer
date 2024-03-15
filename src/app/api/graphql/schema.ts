const typeDefs = `#graphql
    enum AgentTool {
        DUCK_DUCK_GO_SEARCH
        SEMANTIC_SCHOLER
        WIKIDATA
        WIKIPEDIA
        YAHOO_FINANCE
        YUOUTUBE_SEARCH
    }

    type Agent {
        id: ID!
        role: String!
        goal: String!
        backstory: String
        tools: [AgentTool!]!
        allowDelegation: Boolean!
        verbose: Boolean!
        image: String
        missions: [Mission!]
    }

    input AgentInput {
        id: ID!
    }

    type DeleteOutput {
        deleted: Boolean!
    }

    type Task {
        name: String!
        description: String!
        agent: Agent
    }

    input TaskInput {
        name: String!
        description: String!
        agent: Int
    }

    type Mission {
        id: ID!
        name: String!
        crew: [Agent!]
        tasks: [Task]
        verbose: Boolean
        process: MissionProcess
        result: String
    }

    type RunMissionResult {
        result: String
        error: Boolean
        message: String
    }

    enum MissionProcess {
        SEQUENTIAL
        HIERARCHICAL
    }

    type Query {
        agents(filter: String): [Agent!]!
        agent(id: Int!): Agent
        missions(filter: String): [Mission!]!
        mission(id: Int!): Mission
    }

    type Mutation {
        createAgent(
            role: String!
            goal: String!
            backstory: String
            tools: [AgentTool!] = []
            allowDelegation: Boolean = false
            verbose: Boolean = false
        ): Agent!

        updateAgent(
            id: Int!
            role: String
            goal: String
            backstory: String
            tools: [AgentTool!]
            allowDelegation: Boolean
            verbose: Boolean
        ): Agent!

        deleteAgent(id: Int!): DeleteOutput

        createMission(
            name: String!
            crew: [Int!] = []
            tasks: [TaskInput!] = []
            verbose: Boolean = false
            process: MissionProcess =  "SEQUENTIAL"
        ): Mission!

        updateMission(
            id: Int!
            name: String
            crew: [Int!]
            tasks: [TaskInput!]
            verbose: Boolean
            process: MissionProcess
        ): Mission

        deleteMission(id: Int!): DeleteOutput

        runMission(id: Int!): RunMissionResult
    }
`;

export default typeDefs;
