-- Client portal schema + Row Level Security policies.
--
-- The client-facing app (ClientAuthContext, ClientDashboard, GalleryDetail)
-- talks to Supabase directly with the public anon key, so access control for
-- `clients` and `client_galleries` is enforced ENTIRELY by these policies,
-- not by application code. Run this once in the Supabase SQL editor
-- (Project -> SQL Editor -> New query) for the project referenced by
-- VITE_SUPABASE_URL. Safe to re-run.
--
-- All writes to these tables happen through the /api/admin/* and
-- /api/client/signup serverless functions using the service-role key, which
-- bypasses RLS entirely - so no INSERT/UPDATE/DELETE policy is granted to
-- normal (authenticated) clients below. Clients may only ever read their own
-- data.

create table if not exists public.clients (
    id uuid primary key references auth.users (id) on delete cascade,
    email text not null,
    full_name text not null,
    created_at timestamptz not null default now()
);

-- gallery_id assignments can be made either by client_id (once the client has
-- an account) or by client_email (so a photographer can pre-assign a gallery
-- to someone before they've signed up) - see api/admin/assign-gallery.js.
create table if not exists public.client_galleries (
    id bigint generated always as identity primary key,
    client_id uuid references public.clients (id) on delete cascade,
    client_email text,
    gallery_id text not null,
    created_at timestamptz not null default now()
);

-- Backfill for tables created before client_email existed.
alter table public.client_galleries add column if not exists client_email text;
alter table public.client_galleries alter column client_id drop not null;

alter table public.clients enable row level security;
alter table public.client_galleries enable row level security;

-- A signed-in client may read their own profile row only.
drop policy if exists "clients_select_own" on public.clients;
create policy "clients_select_own"
    on public.clients
    for select
    to authenticated
    using (id = auth.uid());

-- A signed-in client may read only their own gallery assignments, matched by
-- client_id OR by the email on their own JWT. IMPORTANT: use auth.jwt() ->>
-- 'email', never a subquery against auth.users - the `authenticated` role has
-- no SELECT grant on auth.users, so a policy that joins it fails every query
-- with "permission denied for table users" (this was live-broken until this
-- fix - see conversation history for how it was diagnosed).
drop policy if exists "client_galleries_select_own" on public.client_galleries;
create policy "client_galleries_select_own"
    on public.client_galleries
    for select
    to authenticated
    using (
        client_id = auth.uid()
        or client_email = (auth.jwt() ->> 'email')
    );

-- No insert/update/delete policies are defined for `authenticated` or `anon`
-- on either table: only the service-role key (used server-side) can write,
-- and the service role bypasses RLS by design.
