# Vercel deployment

## 1. Prepare Supabase

1. Create a Supabase project.
2. Run `supabase/migrations/202608060001_initial_schema.sql`.
3. Create an administrator in Supabase Auth.
4. Insert the user UUID and email into `public.admin_users`.
5. Confirm the private storage bucket and RLS policies.

## 2. Import into Vercel

1. Push this folder to a Git repository.
2. Import the repository in Vercel.
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

`SUPABASE_SECRET_KEY` is server-only. Never prefix it with `NEXT_PUBLIC_`.

## 3. Auth URL configuration

In Supabase Auth URL Configuration, add:

- the production site URL;
- Vercel preview URLs that administrators need to use;
- local development URL if applicable.

Public registration should remain disabled. Administrators are created manually.

## 4. Deployment verification

After deployment, verify all of the following with separate browser sessions:

- Anonymous user can read only `PUBLISHED` cases.
- Anonymous user cannot read `DRAFT`, `UNDER_REVIEW`, `ARCHIVED`, or `WITHDRAWN` cases.
- Non-whitelisted authenticated user cannot access `/admin`.
- Whitelisted user without `admin_users` record cannot access `/admin`.
- Administrator can create, edit, preview, duplicate, publish, withdraw, archive, and delete eligible cases.
- Private documents return HTTP 403 to anonymous users.
- Public documents only work for published cases with explicit download permission.
- Empty database renders the clean empty state.
- Medical fields appear only for `MEDICAL_PAPER_REVIEW`.
- English and Traditional Chinese public routes work.
