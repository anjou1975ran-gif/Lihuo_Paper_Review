# Supabase Storage setup

The migration creates a private bucket named `case-documents` with a 20 MB limit and the following allowed MIME types:

- `application/pdf`
- `text/plain`
- `text/markdown`

## Required checks after migration

1. Open Supabase Dashboard → Storage.
2. Confirm `case-documents` exists and `Public bucket` is **off**.
3. Confirm upload size and MIME restrictions match the migration.
4. Confirm only authenticated administrators have direct `storage.objects` policies.
5. Do not add a public SELECT policy to `storage.objects`.
6. Public downloads must continue through `/api/documents/[id]/download`, which checks:
   - the case is `PUBLISHED`;
   - the document has `public_download_allowed = true`;
   - or the requester is an administrator.
7. The route issues a 60-second signed URL. The bucket itself remains private.

## Upload flow and validation

1. The authenticated administrator asks the server for a short-lived signed upload token.
2. The browser uploads directly to the private bucket, so the file body does not pass through a Vercel function request.
3. The browser calls the completion endpoint with the generated storage path.
4. The server downloads the object, verifies it, and only then creates `case_documents` metadata and an audit entry.
5. Failed validation removes the uploaded object.

The application validates:

- case UUID and case existence;
- document role;
- declared MIME type;
- maximum size;
- declared size against the stored object;
- `%PDF-` signature for PDF files;
- absence of NUL bytes in text files;
- randomized UUID storage path and expected case/role prefix.

The original file name is stored only as metadata and is never used as a database key.
