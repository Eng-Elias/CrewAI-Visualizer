alter table "public"."Tasks" drop constraint "Tasks_user_fkey";

alter table "public"."Agents" drop constraint "Agents_user_fkey";

alter table "public"."Crews" drop constraint "Crews_user_fkey";

alter table "public"."Agents" drop column "user";

alter table "public"."Agents" add column "user_id" uuid default auth.uid();

alter table "public"."Crews" drop column "user";

alter table "public"."Crews" add column "user_id" uuid default auth.uid();

alter table "public"."LLMs" add column "user_id" uuid default auth.uid();

alter table "public"."Tasks" drop column "user";

alter table "public"."Tasks" add column "user_id" uuid default auth.uid();

alter table "public"."LLMs" add constraint "LLMs_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."LLMs" validate constraint "LLMs_user_id_fkey";

alter table "public"."Tasks" add constraint "Tasks_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."Tasks" validate constraint "Tasks_user_id_fkey";

alter table "public"."Agents" add constraint "Agents_user_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."Agents" validate constraint "Agents_user_fkey";

alter table "public"."Crews" add constraint "Crews_user_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."Crews" validate constraint "Crews_user_fkey";

CREATE POLICY "Users can access their own agents and public agents"
ON "public"."Agents"
AS PERMISSIVE
FOR ALL
TO authenticated
USING (
    auth.uid() = user_id  -- User's own agents
    OR 
    user_id IS NULL       -- Public agents
)
WITH CHECK (
    auth.uid() = user_id  -- Can only create/update their own agents
    OR 
    user_id IS NULL       -- Or create/update public agents
);

GRANT SELECT, INSERT, UPDATE, DELETE ON "public"."Agents" TO authenticated;

CREATE POLICY "Users can access their own tasks and public tasks"
ON "public"."Tasks"
AS PERMISSIVE
FOR ALL
TO authenticated
USING (
    auth.uid() = user_id  -- User's own tasks
    OR 
    user_id IS NULL       -- Public tasks
)
WITH CHECK (
    auth.uid() = user_id  -- Can only create/update their own tasks
    OR 
    user_id IS NULL       -- Or create/update public tasks
);

GRANT SELECT, INSERT, UPDATE, DELETE ON "public"."Tasks" TO authenticated;

CREATE POLICY "Users can access their own crews and public crews"
ON "public"."Crews"
AS PERMISSIVE
FOR ALL
TO authenticated
USING (
    auth.uid() = user_id  -- User's own crews
    OR 
    user_id IS NULL       -- Public crews
)
WITH CHECK (
    auth.uid() = user_id  -- Can only create/update their own crews
    OR 
    user_id IS NULL       -- Or create/update public crews
);

GRANT SELECT, INSERT, UPDATE, DELETE ON "public"."Crews" TO authenticated;

CREATE POLICY "Users can access their own LLMs"
ON "public"."LLMs"
AS PERMISSIVE
FOR ALL
TO authenticated
USING (
    auth.uid() = user_id  -- User's own LLMs
)
WITH CHECK (
    auth.uid() = user_id  -- Can only create/update their own LLMs
);

GRANT SELECT, INSERT, UPDATE, DELETE ON "public"."LLMs" TO authenticated;
