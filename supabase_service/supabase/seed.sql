SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8
-- Dumped by pg_dump version 15.8

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") VALUES
	('00000000-0000-0000-0000-000000000000', '0efdaca0-f850-417d-8794-64ab5331e2e1', '{"action":"user_signedup","actor_id":"8ddb5f8a-b1a0-468d-86ca-fc77c5706ffc","actor_username":"a@a.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}', '2025-02-03 20:18:25.420696+00', ''),
	('00000000-0000-0000-0000-000000000000', '57524d8d-6e08-42a0-8dec-9e0d8a207c4f', '{"action":"login","actor_id":"8ddb5f8a-b1a0-468d-86ca-fc77c5706ffc","actor_username":"a@a.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-02-03 20:18:25.43578+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cffe12f1-be11-49c8-a24c-8b65bef188d3', '{"action":"user_repeated_signup","actor_id":"8ddb5f8a-b1a0-468d-86ca-fc77c5706ffc","actor_username":"a@a.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-02-04 17:42:06.413209+00', ''),
	('00000000-0000-0000-0000-000000000000', '5591a454-cb25-46d7-a0dd-fa57711d2f23', '{"action":"login","actor_id":"8ddb5f8a-b1a0-468d-86ca-fc77c5706ffc","actor_username":"a@a.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-02-04 17:42:13.916102+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bdf7bb3d-f014-4958-8aba-36f3dab8ba82', '{"action":"user_repeated_signup","actor_id":"8ddb5f8a-b1a0-468d-86ca-fc77c5706ffc","actor_username":"a@a.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-02-04 18:02:02.258046+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd8c759eb-62f2-4020-bcb8-78f908c191a9', '{"action":"login","actor_id":"8ddb5f8a-b1a0-468d-86ca-fc77c5706ffc","actor_username":"a@a.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-02-04 18:02:11.998497+00', ''),
	('00000000-0000-0000-0000-000000000000', '3af775a7-9e3f-4540-9064-447b38a99589', '{"action":"logout","actor_id":"8ddb5f8a-b1a0-468d-86ca-fc77c5706ffc","actor_username":"a@a.com","actor_via_sso":false,"log_type":"account"}', '2025-02-04 18:02:16.152027+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '8ddb5f8a-b1a0-468d-86ca-fc77c5706ffc', 'authenticated', 'authenticated', 'a@a.com', '$2a$10$qSclMa7XrEv4e3u3ZCjAJulb4UCjQV7f0zN33y4VL/AzNrYnBrS5S', '2025-02-03 20:18:25.423837+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-02-04 18:02:11.999331+00', '{"provider": "email", "providers": ["email"]}', '{"sub": "8ddb5f8a-b1a0-468d-86ca-fc77c5706ffc", "email": "a@a.com", "email_verified": true, "phone_verified": false}', NULL, '2025-02-03 20:18:25.384855+00', '2025-02-04 18:02:12.00199+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('8ddb5f8a-b1a0-468d-86ca-fc77c5706ffc', '8ddb5f8a-b1a0-468d-86ca-fc77c5706ffc', '{"sub": "8ddb5f8a-b1a0-468d-86ca-fc77c5706ffc", "email": "a@a.com", "email_verified": false, "phone_verified": false}', 'email', '2025-02-03 20:18:25.412464+00', '2025-02-03 20:18:25.412519+00', '2025-02-03 20:18:25.412519+00', 'b5d8eb42-dfd4-4021-8735-30ff1973fbd8');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: key; Type: TABLE DATA; Schema: pgsodium; Owner: supabase_admin
--



--
-- Data for Name: Agents; Type: TABLE DATA; Schema: public; Owner: postgres
--

ALTER ROLE postgres SET search_path TO public;
SET search_path TO public;

-- Clean up existing data
TRUNCATE TABLE "public"."crew_tasks" CASCADE;
TRUNCATE TABLE "public"."crew_agents" CASCADE;
TRUNCATE TABLE "public"."Crews" CASCADE;
TRUNCATE TABLE "public"."Tasks" CASCADE;
TRUNCATE TABLE "public"."Agents" CASCADE;
TRUNCATE TABLE "public"."LLMs" CASCADE;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'process_type') THEN
        CREATE TYPE "public"."process_type" AS ENUM ('sequential', 'hierarchical');
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'agent_role_type') THEN
        CREATE TYPE "public"."agent_role_type" AS ENUM ('manager', 'worker');
    END IF;
END $$;

-- Seed built-in LLMs
INSERT INTO "public"."LLMs" (id, name, provider, models, config)
VALUES
  (1, 'OpenAI GPT-4', 'OpenAI', ARRAY['gpt-4'], '{"temperature": 0.7}'),
  (2, 'OpenAI GPT-3.5', 'OpenAI', ARRAY['gpt-3.5-turbo'], '{"temperature": 0.7}');

-- Seed built-in agent templates
INSERT INTO "public"."Agents" (id, name, role, goal, backstory, memory_enabled, "verbose", allow_delegation, max_iterations, is_template, is_builtin)
VALUES
  (1, 'Research Analyst', 'Researcher', 'Conduct thorough research and analysis on given topics', 'Expert in gathering and analyzing information from various sources', true, true, true, 5, true, true),
  (2, 'Data Scientist', 'Analyst', 'Process and analyze data to extract meaningful insights', 'Specialized in data analysis and statistical modeling', true, true, true, 5, true, true),
  (3, 'Content Writer', 'Writer', 'Create engaging and informative content', 'Professional writer with expertise in various content formats', true, true, false, 3, true, true),
  (4, 'Editor', 'Editor', 'Review and improve content for clarity and accuracy', 'Experienced editor with attention to detail', true, true, false, 2, true, true),
  (5, 'Project Manager', 'Manager', 'Coordinate tasks and ensure project success', 'Experienced in managing complex projects and teams', true, true, true, 5, true, true),
  (6, 'Quality Assurance', 'Reviewer', 'Ensure quality and accuracy of deliverables', 'Detail-oriented professional focused on quality control', true, true, false, 3, true, true);

-- Seed built-in task templates
INSERT INTO "public"."Tasks" (id, name, description, expected_output, async_execution, is_template, is_builtin)
VALUES
  -- Research Tasks
  (1, 'Research Topic', 'Conduct comprehensive research on a given topic', 'Detailed research report with key findings and sources', false, true, true),
  (2, 'Analyze Data', 'Analyze provided data and extract insights', 'Data analysis report with visualizations and recommendations', false, true, true),
  
  -- Content Tasks
  (3, 'Write Article', 'Write an informative article on the researched topic', 'Well-structured article with proper citations', false, true, true),
  (4, 'Edit Content', 'Review and improve the written content', 'Polished content with editorial improvements', false, true, true),
  
  -- Management Tasks
  (5, 'Create Project Plan', 'Develop a detailed project plan', 'Project plan with timeline and resource allocation', false, true, true),
  (6, 'Quality Review', 'Review deliverables for quality assurance', 'Quality assessment report with recommendations', false, true, true);

-- Seed built-in crew templates
INSERT INTO "public"."Crews" (
  id, name, description, process,
  "verbose", memory, planning, is_template, is_builtin, config, memory_config, embedder
)
VALUES
  (1, 'Content Creation Team', 'A team focused on creating high-quality content', 
   'hierarchical'::process_type, true, true, true, true, true, '{}'::jsonb, '{}'::jsonb, '{}'::jsonb),
   
  (2, 'Research Team', 'A team specialized in research and analysis', 
   'sequential'::process_type, true, true, true, true, true, '{}'::jsonb, '{}'::jsonb, '{}'::jsonb);

-- Add agents to Content Creation Crew
INSERT INTO "public"."crew_agents" (crew_id, agent_id, agent_order, role)
VALUES
  (1, 5, 1, 'manager'::agent_role_type),  -- Project Manager as manager
  (1, 1, 2, 'worker'::agent_role_type),   -- Research Analyst as worker
  (1, 3, 3, 'worker'::agent_role_type),   -- Content Writer as worker
  (1, 4, 4, 'worker'::agent_role_type);   -- Editor as worker

-- Add tasks to Content Creation Crew
INSERT INTO "public"."crew_tasks" (crew_id, task_id, task_order, assigned_agent_id)
VALUES
  (1, 5, 1, 5),  -- Create Project Plan assigned to Project Manager
  (1, 1, 2, 1),  -- Research Topic assigned to Research Analyst
  (1, 3, 3, 3),  -- Write Article assigned to Content Writer
  (1, 4, 4, 4);  -- Edit Content assigned to Editor

-- Add agents to Research Team
INSERT INTO "public"."crew_agents" (crew_id, agent_id, agent_order, role)
VALUES
  (2, 1, 1, 'worker'::agent_role_type),   -- Research Analyst as worker
  (2, 2, 2, 'worker'::agent_role_type),   -- Data Scientist as worker
  (2, 6, 3, 'worker'::agent_role_type);   -- Quality Assurance as worker

-- Add tasks to Research Team
INSERT INTO "public"."crew_tasks" (crew_id, task_id, task_order, assigned_agent_id)
VALUES
  (2, 1, 1, 1),  -- Research Topic assigned to Research Analyst
  (2, 2, 2, 2),  -- Analyze Data assigned to Data Scientist
  (2, 6, 3, 6);  -- Quality Review assigned to Quality Assurance


--
-- Data for Name: Crews; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: Tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: crew_agents; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: crew_tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--



--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 3, true);


--
-- Name: key_key_id_seq; Type: SEQUENCE SET; Schema: pgsodium; Owner: supabase_admin
--

SELECT pg_catalog.setval('"pgsodium"."key_key_id_seq"', 1, false);


--
-- Name: Agents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."Agents_id_seq"', 1, false);


--
-- Name: Crews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."Crews_id_seq"', 1, false);


--
-- Name: Tasks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."Tasks_id_seq"', 1, false);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

RESET ALL;
