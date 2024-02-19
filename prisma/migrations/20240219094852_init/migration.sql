-- CreateEnum
CREATE TYPE "AgentTool" AS ENUM ('DUCK_DUCK_GO_SEARCH', 'PUBMED', 'PYTHON_REPL', 'SEMANTIC_SCHOLER', 'STACK_EXCHANGE', 'WIKIDATA', 'WIKIPEDIA', 'YAHOO_FINANCE', 'YUOUTUBE_SEARCH');

-- CreateEnum
CREATE TYPE "MissionProcess" AS ENUM ('SEQUENTIAL', 'HIERARCHICAL');

-- CreateTable
CREATE TABLE "Agent" (
    "id" SERIAL NOT NULL,
    "role" TEXT NOT NULL,
    "goal" TEXT NOT NULL,
    "backstory" TEXT,
    "tools" "AgentTool"[] DEFAULT ARRAY[]::"AgentTool"[],
    "allowDelegation" BOOLEAN NOT NULL DEFAULT false,
    "verbose" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mission" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "tasks" JSONB NOT NULL,
    "verbose" BOOLEAN NOT NULL,
    "process" "MissionProcess" NOT NULL,
    "result" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentInMission" (
    "agentId" INTEGER NOT NULL,
    "missionId" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AgentInMission_pkey" PRIMARY KEY ("agentId","missionId")
);

-- AddForeignKey
ALTER TABLE "AgentInMission" ADD CONSTRAINT "AgentInMission_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentInMission" ADD CONSTRAINT "AgentInMission_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "Mission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
