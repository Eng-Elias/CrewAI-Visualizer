/*
  Warnings:

  - The values [PUBMED,PYTHON_REPL,STACK_EXCHANGE] on the enum `AgentTool` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AgentTool_new" AS ENUM ('DUCK_DUCK_GO_SEARCH', 'SEMANTIC_SCHOLER', 'WIKIDATA', 'WIKIPEDIA', 'YAHOO_FINANCE', 'YUOUTUBE_SEARCH');
ALTER TABLE "Agent" ALTER COLUMN "tools" DROP DEFAULT;
ALTER TABLE "Agent" ALTER COLUMN "tools" TYPE "AgentTool_new"[] USING ("tools"::text::"AgentTool_new"[]);
ALTER TYPE "AgentTool" RENAME TO "AgentTool_old";
ALTER TYPE "AgentTool_new" RENAME TO "AgentTool";
DROP TYPE "AgentTool_old";
ALTER TABLE "Agent" ALTER COLUMN "tools" SET DEFAULT ARRAY[]::"AgentTool"[];
COMMIT;
