# Vercel deployment

## Deployment source

- Repository: `anjou1975ran-gif/Lihuo_Paper_Review`
- Branch: `main`
- Root Directory: `lihuo-paper-review`
- Framework preset: Next.js
- Node.js: 20.x
- Build command: `npm run build`

## Empty launch policy

The first production deployment must remain empty:

- do not import demonstration cases;
- do not load LIHUO MedReview samples;
- do not add fictional papers or review outputs;
- keep `supabase/seed.sql` empty;
- administrators add real cases manually after deployment.

## 1. Prepare Supabase

1. Create a Supabase project.
2. Run `supabase/migrations/202608060001_initial_schema.sql`.
3. Do not execute any case-data seed script.
4. Create an administrator in Supabase Auth.
5. Insert the user UUID and email into `public.admin_users`.
6. Confirm the private storage bucket and RLS policies.

## 2. Import into Vercel

1. Import `anjou1975ran-gif/Lihuo_Paper_Review` in Vercel.
2. Set Root Directory to `lihuo-paper-review`.
3. Use the default Next.js framework preset.
4. Set environment variables:

```text
NEXT_PUBLIC_SITE_URL=https://your-domain.example
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
SUPABASE_SECRET_KEY=...
ADMIN_EMAILS=admin@example.com
DOCUMENT_BUCKET=case-documents
MAX_UPLOAD_MB=20
```

`SUPABASE_SECRET_KEY` is server-only. Never prefix it with `NEXT_PUBLIC_` and never commit its real value to GitHub.

## 3. Auth URL configuration

In Supabase Auth URL Configuration, add:

- the production site URL;
- Vercel preview URLs that administrators need to use;
- local development URL if applicable.

Public registration should remain disabled. Administrators are created manually.

## 4. Deployment verification

After deployment, verify all of the following with separate browser sessions:

- `/cases` displays the intended empty state before the administrator adds data.
- No fictional or demonstration case is present.
- Anonymous user can read only `PUBLISHED` cases after real cases are added.
- Anonymous user cannot read `DRAFT`, `UNDER_REVIEW`, `ARCHIVED`, or `WITHDRAWN` cases.
- Non-whitelisted authenticated user cannot access `/admin`.
- Whitelisted user without `admin_users` record cannot access `/admin`.
- Administrator can create, edit, preview, duplicate, publish, withdraw, archive, and delete eligible cases.
- Private documents return HTTP 403 to anonymous users.
- Public documents only work for published cases with explicit download permission.
- Medical fields appear only for `MEDICAL_PAPER_REVIEW`.
- English and Traditional Chinese public routes work.
