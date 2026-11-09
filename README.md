# Wrestle-Nation — Phase 2 invitation-only adult authentication pilot

## What is implemented
- Static `/account/` page with email one-time link sign-in for **existing invited users only** (`shouldCreateUser:false`).
- Supabase session and profile display.
- Adult self-attestation and role selection (athlete/coach/organization admin), backed by RLS insert policy.
- Sign-out and clear separation from paid membership activation.

## Prerequisites and safety
1. In Supabase **Authentication**, keep public **new user signups disabled**. Anonymous sign-in disabled; email confirmation enabled.
2. In the Supabase dashboard, use the administrator-only **Invite user** action for a known adult. Never invite a child. Do not enable public signups to test this flow.
3. Run `supabase/001_invited_adult_profiles.sql` in SQL Editor **once** after reviewing the existing tables. It creates new policies and assumes `profiles` and the account_kind enum exist. If a policy already exists, stop and inspect it rather than dropping anything.
4. Review Supabase **Authentication → URL Configuration**. Add the precise redirect URL `https://jdiamond0005.github.io/Wrestle-Nation/account/` and set Site URL to the root Pages URL. Also ensure Supabase invite confirmation links and email templates work for invited users.
5. Copy `account/config.example.js` to `account/config.js` and replace with your **Project URL** and **publishable key** (NOT a secret key). The publishable key is designed for public client use only with correctly configured RLS.
6. Upload the `account/` directory to the repository root on the `main` branch. Do not upload the SQL file to the publicly served account directory; keeping it in `/supabase` is fine for source control.
7. Visit `https://jdiamond0005.github.io/Wrestle-Nation/account/` and test with an invited adult account.

## Important limitations
- **Not** public registration. No youth accounts, parental consent, or independent age verification. Adults are admitted by manual invitation, and age is self-attested.
- Club/team organization creation and management are **not** implemented.
- Paid membership, Stripe and premium entitlements are **not** implemented.
- Public website has no registration link added by this package; add one only when testing is ready.
- Authentication UI uses a CDN-hosted Supabase JavaScript SDK and requires an internet connection.
- Browser-based auth is not a substitute for backend enforcement. Existing database policies and schema must be reviewed before production.
- Do not store secrets in GitHub Pages, including `service_role`, Stripe secret keys, or database passwords.

## Production prerequisites
Independent age assurance and guardian workflow where legally required; privacy and terms; audit and abuse controls; organization verification; tested recovery and deletion; security review; billing backend and webhooks.
