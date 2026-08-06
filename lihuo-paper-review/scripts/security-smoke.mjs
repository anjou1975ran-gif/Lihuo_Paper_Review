import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const failures = [];
const migration = readFileSync("supabase/migrations/202608060001_initial_schema.sql", "utf8");
if (!/public_download_allowed boolean not null default false/i.test(migration)) failures.push("document downloads are not default-private");
if (!/values \('case-documents','case-documents',false/i.test(migration)) failures.push("storage bucket is not private");
if (!/enable row level security/gi.test(migration)) failures.push("RLS is missing");
if (!/create table public\.audit_logs/i.test(migration)) failures.push("audit logs table is missing");

const browserFiles = walk("components").concat(walk("app")).filter((path) => /\.(ts|tsx)$/.test(path));
for (const path of browserFiles) {
  const source = readFileSync(path, "utf8");
  if (source.includes("SUPABASE_SECRET_KEY")) failures.push(`secret key referenced from browser/application module: ${path}`);
}


const uploadRoute = readFileSync("app/api/admin/documents/route.ts", "utf8");
if (!uploadRoute.includes("createSignedUploadUrl")) failures.push("signed direct-upload intent is missing");
if (!uploadRoute.includes("inspectContent(bytes")) failures.push("server-side uploaded-object validation is missing");
if (uploadRoute.includes("request.formData()")) failures.push("file body still passes through the Vercel API request");
const uploader = readFileSync("components/admin/document-uploader.tsx", "utf8");
if (!uploader.includes("uploadToSignedUrl")) failures.push("browser direct-to-storage upload is missing");

const seed = readFileSync("supabase/seed.sql", "utf8");
if (/insert\s+into\s+public\.cases/i.test(seed)) failures.push("fictional case seed detected");

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log("Security smoke checks passed.");
