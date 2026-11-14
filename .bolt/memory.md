# Project memory

## Product intent & audience

- Workforce/roster management system: companies → branches → teams → members hierarchy.
- Admins can reset user passwords; users can change their own passwords.
- Includes notifications, password change/reset flows, and custom ranks.

## Brand personality & voice

- User communicates in Arabic; assistant responses in English.
- User prefers methodical, phased workflows (setup first, code changes later).

## Visual design & UX direction

- Not yet inferred; no UI changes reviewed this turn.

## Decisions, constraints & rationale

- **Framework:** Vite + React (frontend).
- **Backend:** Supabase Postgres (database + RLS) and Supabase Edge Functions.
- **Auth:** Firebase Authentication; server-side password operations require Firebase Admin SDK via edge function.
- **Edge function "roster"** is the single deployed function handling roster, auth, password reset, notifications, and company management.
- **Database:** 14 migrations applied; tables include companies, branches, teams, members, custom_ranks, password_change_requests, password_reset_tokens, notifications. RLS enabled on all tables.
- **Secrets configured:** SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_DB_URL, SUPABASE_PUBLISHABLE_KEYS, SUPABASE_SECRET_KEYS, SUPABASE_JWKS.
- **Secret still missing:** `FIREBASE_SERVICE_ACCOUNT` (full JSON key). Without it, password changes/resets fail with "service not configured". User was asked to add it.
- Edge function redeploy may require a source file change to trigger; deploy tool reports no-op when content unchanged.

## Open questions & assumptions

- UI/visual design direction not yet established (no UI work done).
- No `.bolt/prompt` provided yet; global instructions may arrive later.
- Awaiting user confirmation that `FIREBASE_SERVICE_ACCOUNT` secret is added before proceeding with any code changes.
- Exact feature scope beyond roster/auth/notifications not yet confirmed.