-- Run after the initial Phase 2 tables and RLS policies exist.
-- Adds only an invited adult's ability to create/read/update their own profile.
-- Existing account_kind enum and tables are preserved.
-- IMPORTANT: Supabase Auth public signups must remain DISABLED.

-- A signed-in user may create only their own profile. A Supabase Auth invite
-- must have been sent by an administrator to the adult before login.
create policy "Invited adult creates own profile"
on public.profiles for insert to authenticated
with check (
  user_id = (select auth.uid())
  and country_code = 'US'
  and adult_attested_at <= now()
  and adult_attested_at > now() - interval '1 hour'
);

-- Permit editing display name only via restricted column-level privilege.
-- Do not create a broad UPDATE policy: roles and age attestations are immutable.
revoke update on public.profiles from authenticated;
grant update (display_name) on public.profiles to authenticated;
create policy "Update own display name"
on public.profiles for update to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

-- No client INSERT/UPDATE policies on organizations or memberships.
-- An authorized backend must create organizations and manage invitations.
