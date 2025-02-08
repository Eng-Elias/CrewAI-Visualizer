
-- Create junction table for crew agents with ordering
create table if not exists public.crew_agents (
    id uuid default gen_random_uuid() primary key,
    crew_id int8 references "public"."Crews"(id) on delete cascade not null,
    agent_id int8 references "public"."Agents"(id) on delete cascade not null,
    agent_order integer not null, -- Maintains the order of agents in the crew
    role text check (role in ('manager', 'worker')) default 'worker',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    -- Ensure unique ordering within each crew
    unique(crew_id, agent_order),
    -- Ensure each agent appears only once in a crew
    unique(crew_id, agent_id)
);

-- Create junction table for crew tasks with ordering
create table if not exists public.crew_tasks (
    id uuid default gen_random_uuid() primary key,
    crew_id int8 references "public"."Crews"(id) on delete cascade not null,
    task_id int8 references "public"."Tasks"(id) on delete cascade not null,
    task_order integer not null, -- Maintains the order of tasks in the crew
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    -- Ensure unique ordering within each crew
    unique(crew_id, task_order),
    -- Ensure each task appears only once in a crew
    unique(crew_id, task_id)
);

-- Create indexes for better query performance
create index crew_agents_order_idx on public.crew_agents(crew_id, agent_order);
create index crew_agents_role_idx on public.crew_agents(crew_id, role);
create index crew_tasks_order_idx on public.crew_tasks(crew_id, task_order);

-- Enable RLS
alter table public.crew_agents enable row level security;
alter table public.crew_tasks enable row level security;

-- Add RLS policies
create policy "Crew agents are viewable by everyone"
    on public.crew_agents for select
    using (true);

create policy "Crew tasks are viewable by everyone"
    on public.crew_tasks for select
    using (true);

-- Add triggers for updated_at timestamps
create trigger handle_updated_at before update on public.crew_agents
    for each row execute procedure moddatetime (updated_at);

create trigger handle_updated_at before update on public.crew_tasks
    for each row execute procedure moddatetime (updated_at);

-- Add helpful comments
comment on table public.crew_agents is 'Junction table maintaining ordered relationship between crews and agents';
comment on table public.crew_tasks is 'Junction table maintaining ordered relationship between crews and tasks';
comment on column public.crew_agents.agent_order is 'Position of the agent in the crew list (1-based index)';
comment on column public.crew_tasks.task_order is 'Position of the task in the crew execution sequence (1-based index)';

-- Function to reorder agents when one is removed
create or replace function public.reorder_crew_agents()
returns trigger as $$
begin
    -- Reorder remaining agents to close any gaps
    update public.crew_agents
    set agent_order = subquery.new_order
    from (
        select id, row_number() over (partition by crew_id order by agent_order) as new_order
        from public.crew_agents
        where crew_id = old.crew_id
    ) as subquery
    where crew_agents.id = subquery.id;
    return old;
end;
$$ language plpgsql;

-- Function to reorder tasks when one is removed
create or replace function public.reorder_crew_tasks()
returns trigger as $$
begin
    -- Reorder remaining tasks to close any gaps
    update public.crew_tasks
    set task_order = subquery.new_order
    from (
        select id, row_number() over (partition by crew_id order by task_order) as new_order
        from public.crew_tasks
        where crew_id = old.crew_id
    ) as subquery
    where crew_tasks.id = subquery.id;
    return old;
end;
$$ language plpgsql;

-- Add triggers for reordering after deletions
create trigger reorder_agents_after_delete
    after delete on public.crew_agents
    for each row execute function public.reorder_crew_agents();

create trigger reorder_tasks_after_delete
    after delete on public.crew_tasks
    for each row execute function public.reorder_crew_tasks();

-- Down migration (in case we need to rollback)
/*
drop trigger if exists reorder_tasks_after_delete on public.crew_tasks;
drop trigger if exists reorder_agents_after_delete on public.crew_agents;
drop function if exists public.reorder_crew_tasks();
drop function if exists public.reorder_crew_agents();
drop table if exists public.crew_tasks;
drop table if exists public.crew_agents;
*/