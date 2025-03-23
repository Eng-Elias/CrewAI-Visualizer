-- Create Missions table
CREATE TABLE "public"."Missions" (
    id BIGSERIAL PRIMARY KEY,
    crew_id BIGINT NOT NULL REFERENCES "public"."Crews"(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    default_llm_id BIGINT REFERENCES "public"."LLMs"(id) ON DELETE SET NULL,
    default_llm_model CHARACTER VARYING,
    manager_llm_id BIGINT REFERENCES "public"."LLMs"(id) ON DELETE SET NULL,
    manager_llm_model CHARACTER VARYING,
    function_calling_llm_id BIGINT REFERENCES "public"."LLMs"(id) ON DELETE SET NULL,
    function_calling_llm_model CHARACTER VARYING,
    planning_llm_id BIGINT REFERENCES "public"."LLMs"(id) ON DELETE SET NULL,
    planning_llm_model CHARACTER VARYING,
    input_data JSONB NOT NULL DEFAULT '{"text": ""}'::jsonb,
    result_data JSONB,
    status TEXT NOT NULL DEFAULT 'pending',
    error TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- Add RLS policies
ALTER TABLE "public"."Missions" ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own missions or public missions
CREATE POLICY "Users can view their own missions"
    ON "public"."Missions"
    FOR SELECT
    USING (
        auth.uid() = user_id OR
        user_id IS NULL
    );

-- Policy for users to create missions
CREATE POLICY "Users can create missions"
    ON "public"."Missions"
    FOR INSERT
    WITH CHECK (
        auth.uid() = user_id
    );

-- Policy for users to update their own missions
CREATE POLICY "Users can update their own missions"
    ON "public"."Missions"
    FOR UPDATE
    USING (
        auth.uid() = user_id
    );

-- Policy for users to delete their own missions
CREATE POLICY "Users can delete their own missions"
    ON "public"."Missions"
    FOR DELETE
    USING (
        auth.uid() = user_id
    );

-- Create function to update updated_at
CREATE OR REPLACE FUNCTION update_missions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at
CREATE TRIGGER update_missions_updated_at
    BEFORE UPDATE ON "public"."Missions"
    FOR EACH ROW
    EXECUTE FUNCTION update_missions_updated_at();
