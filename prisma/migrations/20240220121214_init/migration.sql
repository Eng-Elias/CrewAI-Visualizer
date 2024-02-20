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
    "tasks" JSONB[] DEFAULT ARRAY[]::JSONB[],
    "verbose" BOOLEAN NOT NULL DEFAULT false,
    "process" "MissionProcess" NOT NULL DEFAULT 'SEQUENTIAL',
    "result" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AgentToMission" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AgentToMission_AB_unique" ON "_AgentToMission"("A", "B");

-- CreateIndex
CREATE INDEX "_AgentToMission_B_index" ON "_AgentToMission"("B");

-- AddForeignKey
ALTER TABLE "_AgentToMission" ADD CONSTRAINT "_AgentToMission_A_fkey" FOREIGN KEY ("A") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AgentToMission" ADD CONSTRAINT "_AgentToMission_B_fkey" FOREIGN KEY ("B") REFERENCES "Mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
