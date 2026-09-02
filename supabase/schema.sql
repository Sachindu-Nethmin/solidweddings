-- Full database schema for the SolidWeddings Supabase project.
--
-- Run this against a fresh project (Project -> SQL Editor -> New query) after
-- pointing VITE_SUPABASE_URL at it. Safe to re-run: every statement is
-- idempotent. This is the superset of supabase/client_portal_policies.sql,
-- which stays as the narrower client-portal-only reference.
--
-- Table ownership:
--   clients          - one row per client portal account, keyed to auth.users
--   client_galleries - which gallery ids a client may view
--   bookings         - booking requests from the public /booking form
--
-- Writes go through the /api/* serverless functions using the service-role
-- key (which bypasses RLS). The policies below only ever grant SELECT.

-- ---------------------------------------------------------------- clients --
create table if not exists public.clients (
    id uuid primary key references auth.users (id) on delete cascade,
    email text not null,
    full_name text not null,
    created_at timestamptz not null default now()
);

-- ------------------------------------------------------- client_galleries --
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

create index if not exists client_galleries_client_email_idx
    on public.client_galleries (client_email);
create index if not exists client_galleries_client_id_idx
    on public.client_galleries (client_id);

-- --------------------------------------------------------------- bookings --
-- Created by POST /api/bookings from the public booking form; status is moved
-- through pending -> confirmed/cancelled by PATCH /api/admin/manage-booking.
-- client_email is NOT a foreign key: anyone can request a booking without
-- holding a portal account, and the account may be created afterwards.
create table if not exists public.bookings (
    id bigint generated always as identity primary key,
    client_name text not null,
    client_email text not null,
    client_phone text not null,
    package_name text not null,
    wedding_date date not null,
    venue text,
    message text,
    status text not null default 'pending'
        check (status in ('pending', 'confirmed', 'cancelled')),
    created_at timestamptz not null default now()
);

create index if not exists bookings_client_email_idx
    on public.bookings (client_email);
create index if not exists bookings_wedding_date_idx
    on public.bookings (wedding_date);

-- ------------------------------------------------------------------- RLS --
alter table public.clients enable row level security;
alter table public.client_galleries enable row level security;
alter table public.bookings enable row level security;

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
-- with "permission denied for table users".
drop policy if exists "client_galleries_select_own" on public.client_galleries;
create policy "client_galleries_select_own"
    on public.client_galleries
    for select
    to authenticated
    using (
        client_id = auth.uid()
        or client_email = (auth.jwt() ->> 'email')
    );

-- A signed-in client may read only the bookings made under their own email
-- (ClientDashboard reads this table directly with the publishable key).
drop policy if exists "bookings_select_own" on public.bookings;
create policy "bookings_select_own"
    on public.bookings
    for select
    to authenticated
    using (client_email = (auth.jwt() ->> 'email'));

-- No insert/update/delete policies are defined for `authenticated` or `anon`
-- on any of these tables: only the service-role key (used server-side) can
-- write, and the service role bypasses RLS by design.
