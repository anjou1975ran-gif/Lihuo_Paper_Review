# Requirements matrix

This matrix maps the supplied product specification to repository artifacts. It reports source implementation separately from environment-dependent execution.

## P0

| Requirement | Implementation | Verification state |
|---|---|---|
| Administrator login | Supabase password auth, `ADMIN_EMAILS`, `admin_users`, RLS | Source implemented; live Auth not executed |
| Case upload/edit | `/admin/cases/new`, `/admin/cases/[id]/edit` | Source implemented |
| Publish/withdraw/archive | `publication_status`, publication guard, admin form | Logic smoke passed; live DB not executed |
| Public case list/detail | `/cases`, `/cases/[slug]`, English equivalents | Source implemented; empty-state capture created |
| Ordinary AI vs LIHUO comparison | Four-tab case detail and structured comparison matrix | Source implemented |
| General/medical modes | Conditional medical fields and public medical results | Source implemented |
| Real database/storage | Supabase migration, private bucket, signed direct upload, RLS | Migration not executed externally |
| Vercel deployability | Next.js App Router project, `vercel.json`, deployment guide | Build/deploy not completed in this container |
| No fake backend/data | Empty seed and no static case source | Security smoke passed |

## P1

| Requirement | Implementation |
|---|---|
| Search/filter | Title, author, journal, DOI, keyword, domain, year, type, claim, evidence, readiness, review result |
| Traditional Chinese/English | Public route trees under `/` and `/en` |
| Responsive design | Responsive grids, mobile navigation, stacked comparison |
| SEO | Metadata, Open Graph, robots, sitemap |
| Accessibility | Skip link, semantic labels, tab roles, text/icon/color status indicators |
| Download control | Per-document flag; server-authorized signed download URL |

## Explicitly excluded in this release

No AI API, automatic review generation, hidden reasoning simulation, fake Runtime logs, public registration, payments, or claim that the full LIHUO Runtime is deployed.
