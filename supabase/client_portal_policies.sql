-- Client portal schema + Row Level Security policies.
--
-- The client-facing app (ClientAuthContext, ClientDashboard, GalleryDetail)
-- talks to Supabase directly with the public anon key, so access control for
-- `clients` and `client_galleries` is enforced ENTIRELY by these policies,
-- not by application code. Run this once in the Supabase SQL editor
-- (Project -> SQL Editor -> New query) for the project referenced by
-- VITE_SUPABASE_URL. Safe to re-run.
--
-- All writes to these tables happen through the /api/admin/* serverless
-- functions using the service-role key, which bypasses RLS entirely - so no
-- INSERT/UPDATE/DELETE policy is granted to normal (authenticated) clients
-- below. That's intentional: clients may only ever read their own data.

create table if not exists public.clients (
    id uuid primary key references auth.users (id) on delete cascade,
    email text not null,
    full_name text not null,
    created_at timestamptz not null default now()
);

create table if not exists public.client_galleries (
    id bigint generated always as identity primary key,
    client_id uuid not null references public.clients (id) on delete cascade,
    gallery_id text not null,
    created_at timestamptz not null default now(),
    unique (client_id, gallery_id)
);

alter table public.clients enable row level security;
alter table public.client_galleries enable row level security;

-- A signed-in client may read their own profile row only.
drop policy if exists "clients_select_own" on public.clients;
create policy "clients_select_own"
    on public.clients
    for select
    to authenticated
    using (id = auth.uid());

-- A signed-in client may read only their own gallery assignments.
drop policy if exists "client_galleries_select_own" on public.client_galleries;
create policy "client_galleries_select_own"
    on public.client_galleries
    for select
    to authenticated
    using (client_id = auth.uid());

-- No insert/update/delete policies are defined for `authenticated` or `anon`
-- on either table: only the service-role key (used server-side in
-- api/admin/*) can write, and the service role bypasses RLS by design.
