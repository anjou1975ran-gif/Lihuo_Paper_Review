# Administrator operations

## Empty launch

The initial deployment is intentionally empty. No demonstration, fictional, LIHUO MedReview, or other case data is preloaded.

After the site, Supabase project, and administrator account are ready, the administrator may add real cases manually through `/admin/cases/new`.

## Create an administrator

1. Create the user manually in Supabase Auth.
2. Add the email to `ADMIN_EMAILS`.
3. Insert the Auth UUID and email into `public.admin_users`.
4. Sign in at `/admin/login`.

All three checks are required: Auth session, environment allowlist, and database admin record. Public registration should remain disabled.

## Add the first real case

1. Open `/admin/cases/new`.
2. Complete basic metadata, source information, ordinary AI review, LIHUO review, multi-axis state, and comparison summary.
3. For a medical case, select `MEDICAL_PAPER_REVIEW` and complete the medical profile.
4. Save the record. The app redirects to the edit route.
5. Upload only authorized PDF, TXT, or Markdown documents by role.
6. Review each document's public-download permission.
7. Use the preview route before publication.
8. Keep the record as `DRAFT` until it is ready for public release.

## Publish or withdraw

- Set `publication_status` to `PUBLISHED` and save to publish.
- Set it to `WITHDRAWN` to withdraw.
- Set it to `ARCHIVED` to archive.
- Published cases receive `published_at` when first published.
- Incomplete cases may only be published when explicitly marked `PARTIAL CASE / DATA INCOMPLETE`.
- Permission and personal-data checks must be confirmed.

## Duplicate or delete

- Duplicate creates a new `DRAFT` copy without copying storage files.
- Published cases cannot be deleted until withdrawn or archived.
- Deleting a case removes associated storage objects before deleting database records.

## Empty-state verification

Before adding the first real case, verify:

- `/cases` shows the intended empty-state message;
- no case appears in either Chinese or English routes;
- the database contains no seeded case rows;
- anonymous users cannot access `/admin`;
- private document download attempts are denied.
