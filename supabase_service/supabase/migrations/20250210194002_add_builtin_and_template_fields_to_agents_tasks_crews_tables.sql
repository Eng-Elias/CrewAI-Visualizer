
-- Add template-related fields to Agents table
ALTER TABLE "public"."Agents" 
ADD COLUMN "is_template" boolean DEFAULT false,
ADD COLUMN "is_builtin" boolean DEFAULT false,
ADD COLUMN "template_id" bigint REFERENCES "public"."Agents"(id),
ADD COLUMN "template_version" integer DEFAULT 1;

-- Add template-related fields to Tasks table
ALTER TABLE "public"."Tasks" 
ADD COLUMN "is_template" boolean DEFAULT false,
ADD COLUMN "is_builtin" boolean DEFAULT false,
ADD COLUMN "template_id" bigint REFERENCES "public"."Tasks"(id),
ADD COLUMN "template_version" integer DEFAULT 1;

-- Add template-related fields to Crews table
ALTER TABLE "public"."Crews" 
ADD COLUMN "is_template" boolean DEFAULT false,
ADD COLUMN "is_builtin" boolean DEFAULT false,
ADD COLUMN "template_id" bigint REFERENCES "public"."Crews"(id),
ADD COLUMN "template_version" integer DEFAULT 1;

-- Add indexes for better query performance
CREATE INDEX idx_agents_is_template ON "public"."Agents" (is_template);
CREATE INDEX idx_tasks_is_template ON "public"."Tasks" (is_template);
CREATE INDEX idx_crews_is_template ON "public"."Crews" (is_template);

-- Add comments to template-related fields
COMMENT ON COLUMN "public"."Agents"."is_template" IS 'Indicates if this record is a template';
COMMENT ON COLUMN "public"."Agents"."is_builtin" IS 'Indicates if this is a built-in template that should not be modified';
COMMENT ON COLUMN "public"."Agents"."template_id" IS 'Reference to the template this instance was created from';
COMMENT ON COLUMN "public"."Agents"."template_version" IS 'Version number of the template';

COMMENT ON COLUMN "public"."Tasks"."is_template" IS 'Indicates if this record is a template';
COMMENT ON COLUMN "public"."Tasks"."is_builtin" IS 'Indicates if this is a built-in template that should not be modified';
COMMENT ON COLUMN "public"."Tasks"."template_id" IS 'Reference to the template this instance was created from';
COMMENT ON COLUMN "public"."Tasks"."template_version" IS 'Version number of the template';

COMMENT ON COLUMN "public"."Crews"."is_template" IS 'Indicates if this record is a template';
COMMENT ON COLUMN "public"."Crews"."is_builtin" IS 'Indicates if this is a built-in template that should not be modified';
COMMENT ON COLUMN "public"."Crews"."template_id" IS 'Reference to the template this instance was created from';
COMMENT ON COLUMN "public"."Crews"."template_version" IS 'Version number of the template';