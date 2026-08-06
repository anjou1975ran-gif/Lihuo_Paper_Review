import { existsSync, readFileSync } from "node:fs";

const required = [
  "app/page.tsx",
  "app/paper-review/page.tsx",
  "app/medical-review/page.tsx",
  "app/about-lihuo/page.tsx",
  "app/robots.ts",
  "app/sitemap.ts",
  "app/cases/page.tsx",
  "app/cases/[slug]/page.tsx",
  "app/en/page.tsx",
  "app/en/cases/page.tsx",
  "app/en/cases/[slug]/page.tsx",
  "app/admin/login/page.tsx",
  "app/admin/(dashboard)/cases/new/page.tsx",
  "app/admin/(dashboard)/cases/[id]/edit/page.tsx",
  "app/admin/(dashboard)/cases/[id]/preview/page.tsx",
  "app/api/admin/cases/route.ts",
  "app/api/admin/cases/[id]/route.ts",
  "app/api/admin/cases/[id]/duplicate/route.ts",
  "app/api/admin/documents/route.ts",
  "app/api/admin/documents/[id]/route.ts",
  "app/api/documents/[id]/download/route.ts",
  "supabase/migrations/202608060001_initial_schema.sql",
  "supabase/seed.sql",
  ".env.example",
  "README.md",
  "docs/TEST_REPORT.md",
  "docs/REQUIREMENTS_MATRIX.md",
  "screenshots/homepage.png",
  "screenshots/admin-dashboard.png",
  "screenshots/empty-cases.png",
];

let failed = false;
for (const file of required) {
  if (!existsSync(file)) {
    console.error(`MISSING ${file}`);
    failed = true;
  }
}

const migration = readFileSync("supabase/migrations/202608060001_initial_schema.sql", "utf8");
for (const token of [
  "enable row level security",
  "create table public.cases",
  "create table public.audit_logs",
  "insert into storage.buckets",
  "public_download_allowed boolean not null default false",
]) {
  if (!migration.toLowerCase().includes(token.toLowerCase())) {
    console.error(`MIGRATION TOKEN MISSING: ${token}`);
    failed = true;
  }
}

const seed = readFileSync("supabase/seed.sql", "utf8");
if (/insert\s+into\s+public\.cases/i.test(seed)) {
  console.error("Seed contains case data; fictional seed data is forbidden.");
  failed = true;
}

if (failed) process.exit(1);
console.log(`Structure verification passed (${required.length} required artifacts).`);
