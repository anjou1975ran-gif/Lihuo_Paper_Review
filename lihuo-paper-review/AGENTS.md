# Agent notes

- Framework: Next.js 16 App Router.
- Auth: Supabase SSR via `@supabase/ssr`.
- Session refresh entry point: `proxy.ts`.
- Do not expose `SUPABASE_SECRET_KEY` to browser code.
- Keep the storage bucket private; issue short-lived signed URLs only after authorization checks.
- Do not add AI-generation features or simulated reasoning logs.
