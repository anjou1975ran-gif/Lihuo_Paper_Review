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
  "docs/LIHUO_SYSTEM_WIRING_R3.md",
  "docs/LIHUO_PAPER_REVIEW_DAIL_R3.yaml",
  "specs/LIHUO_PAPER_REVIEW_V3.0-EXP-QS-R3.md",
  "lib/lihuo-system.ts",
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

const profile = readFileSync("lib/lihuo-system.ts", "utf8");
for (const token of [
  'paperReview: "V3.0-EXP-QS-R3"',
  'protocol: "V2.3"',
  'lighter: "V3.5-EXP"',
  'mainSystem: "V3.5-EXP"',
  'wiringEvidence: "E5_GRAPH_AUDITED"',
  "runtimeRegressionTested: false",
  "hostEnforced: false",
  "websiteRuntimeExecution: false",
]) {
  if (!profile.includes(token)) {
    console.error(`LIHUO SYSTEM PROFILE TOKEN MISSING: ${token}`);
    failed = true;
  }
}

const dail = readFileSync("docs/LIHUO_PAPER_REVIEW_DAIL_R3.yaml", "utf8");
for (const token of [
  'runtime_id: "LIHUO_PAPER_REVIEW_V3_EXP_QS_R3"',
  'protocol: "LIHUO PROTOCOL V2.3"',
  'lighter: "LIHUO LIGHTER V3.5-EXP"',
  'main_system: "LIHUO AI SYSTEM V3.5-EXP"',
  "MULTI_PATH_RECOMPETITION",
  "ENDLESS_RESCAN",
  "web_export_after_final_gate: true",
  "E5_GRAPH_AUDITED: true",
  "E6_RUNTIME_TESTED: false",
  "E7_HOST_ENFORCED: false",
]) {
  if (!dail.includes(token)) {
    console.error(`R3 DAIL TOKEN MISSING: ${token}`);
    failed = true;
  }
}

const wiring = readFileSync("docs/LIHUO_SYSTEM_WIRING_R3.md", "utf8");
for (const token of [
  "CAPABILITY_PRESENT != CAPABILITY_WIRED",
  "BOUND != EXECUTED",
  "First-touch and ordering",
  "Atomic bundles",
  "Return contract",
  "E5_GRAPH_AUDITED: true",
  "E6_RUNTIME_TESTED: false",
]) {
  if (!wiring.includes(token)) {
    console.error(`R3 WIRING TOKEN MISSING: ${token}`);
    failed = true;
  }
}

if (failed) process.exit(1);
console.log(`Structure verification passed (${required.length} required artifacts + LIHUO R3 wiring invariants).`);
