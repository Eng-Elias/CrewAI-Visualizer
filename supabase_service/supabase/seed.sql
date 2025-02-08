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
