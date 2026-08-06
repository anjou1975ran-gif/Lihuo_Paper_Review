# LIHUO Paper Review System — Delivery Report

Date: 2026-08-06

## Pages created

### Traditional Chinese public pages

- `/`
- `/paper-review`
- `/medical-review`
- `/cases`
- `/cases/[slug]`
- `/about-lihuo`

### English public pages

- `/en`
- `/en/paper-review`
- `/en/medical-review`
- `/en/cases`
- `/en/cases/[slug]`
- `/en/about-lihuo`

### Administrator pages

- `/admin/login`
- `/admin`
- `/admin/cases`
- `/admin/cases/new`
- `/admin/cases/[id]/edit`
- `/admin/cases/[id]/preview`

## Database tables created

- `admin_users`
- `cases`
- `case_documents`
- `review_outputs`
- `general_review_states`
- `medical_review_states`
- `comparison_summaries`
- `case_tags`
- `audit_logs`

## Environment variables

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY`
- `ADMIN_EMAILS`
- `DOCUMENT_BUCKET`
- `MAX_UPLOAD_MB`

## Administrator creation

1. Create the user manually in Supabase Auth.
2. Add the email to `ADMIN_EMAILS`.
3. Insert the Auth UUID and email into `public.admin_users`.
4. Sign in at `/admin/login`.

The administrator must pass all three controls: Supabase Auth, environment email allowlist, and database RLS admin record.

## Case creation

1. Open `/admin/cases/new`.
2. Enter metadata, paper source, ordinary AI review, LIHUO review, general multi-axis states, medical fields when applicable, and comparison summary.
3. Save to create the record.
4. Upload PDF, TXT, or Markdown documents on the edit page.
5. Preview before publication.

## File upload

- Supported MIME types: PDF, TXT, Markdown.
- Maximum size is configured by `MAX_UPLOAD_MB`.
- Files use a short-lived signed upload token and upload directly to a private Supabase bucket.
- The server downloads the completed object, verifies declared size, PDF signature, and basic text-file safety, and only then creates the database row.
- Each document's download permission can be changed independently.
- Public download uses a short-lived signed URL only after server authorization.

## Publish and withdraw

- Publish by setting status to `PUBLISHED`.
- Withdraw by setting status to `WITHDRAWN`.
- Archive by setting status to `ARCHIVED`.
- Incomplete publication requires the explicit `PARTIAL CASE / DATA INCOMPLETE` flag.
- Permission and personal-data checks are required before publication.
- Published cases must be withdrawn or archived before deletion.

## Test status

### Passed

- Project structure verification.
- Security smoke checks.
- Case filter and publish-check logic tests.
- TypeScript syntactic parsing of all application source files.
- Stub-assisted semantic/no-unused TypeScript pass for local project code (not a substitute for framework typecheck).
- Empty seed verification.
- Static visual capture generation.

### Not completed

- `npm install`: failed because the execution environment's internal npm registry returned HTTP 404 for `@supabase/ssr`; the direct public registry was not DNS-resolvable from the container.
- `npm run build`: not completed because Next.js dependencies were not installed.
- `npm run lint`: not completed because ESLint dependencies were not installed.
- Full `npm run typecheck`: not completed because framework and React type packages were not installed.
- Supabase migration execution: no external Supabase project was provided.
- Vercel deployment: no external Vercel project or credentials were provided.
- Live end-to-end testing: requires a configured Supabase backend and installed dependencies.

No unavailable test or deployment step is reported as PASS.
