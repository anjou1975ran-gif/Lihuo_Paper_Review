import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { ALLOWED_MIME_TYPES, DEFAULT_BUCKET, DOCUMENT_ROLES } from "@/lib/constants";
import { requireAdminApi } from "@/lib/server-api-auth";
import { createAdminClient } from "@/lib/supabase/admin";

function safeName(name: string) {
  return name.normalize("NFKC").replace(/[^a-zA-Z0-9._-]/g, "_").slice(-160) || "document";
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function validateMetadata(body: Record<string, unknown>) {
  const caseId = String(body.case_id || "");
  const role = String(body.document_role || "");
  const fileName = String(body.file_name || "");
  const mimeType = String(body.mime_type || "");
  const fileSize = Number(body.file_size || 0);

  if (!isUuid(caseId)) throw new Error("Invalid case ID");
  if (!DOCUMENT_ROLES.includes(role as (typeof DOCUMENT_ROLES)[number])) throw new Error("Invalid document role");
  if (!ALLOWED_MIME_TYPES.includes(mimeType as (typeof ALLOWED_MIME_TYPES)[number])) throw new Error("Unsupported MIME type");
  if (!fileName || fileName.length > 255) throw new Error("Invalid file name");

  const maxMb = Number(process.env.MAX_UPLOAD_MB || 20);
  if (!Number.isFinite(maxMb) || maxMb <= 0) throw new Error("Invalid MAX_UPLOAD_MB configuration");
  if (!Number.isFinite(fileSize) || fileSize <= 0 || fileSize > maxMb * 1024 * 1024) {
    throw new Error(`File must be between 1 byte and ${maxMb} MB`);
  }
  return { caseId, role, fileName, mimeType, fileSize };
}

function inspectContent(bytes: Uint8Array, mimeType: string) {
  if (mimeType === "application/pdf") {
    const signature = new TextDecoder("ascii").decode(bytes.slice(0, 5));
    if (signature !== "%PDF-") throw new Error("PDF signature validation failed");
    return;
  }
  if (bytes.slice(0, Math.min(bytes.length, 8192)).includes(0)) {
    throw new Error("Text files may not contain NUL bytes");
  }
}

/**
 * Create a short-lived signed upload token. The browser uploads directly to
 * the private Supabase bucket, avoiding Vercel request-body limits.
 */
export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const metadata = validateMetadata(body);
    const admin = createAdminClient();
    const caseRecord = await admin.from("cases").select("id").eq("id", metadata.caseId).maybeSingle();
    if (caseRecord.error) throw caseRecord.error;
    if (!caseRecord.data) throw new Error("Case not found");

    const bucket = process.env.DOCUMENT_BUCKET || DEFAULT_BUCKET;
    const path = `${metadata.caseId}/${metadata.role}/${randomUUID()}-${safeName(metadata.fileName)}`;
    const signed = await admin.storage.from(bucket).createSignedUploadUrl(path);
    if (signed.error) throw signed.error;

    await admin.from("audit_logs").insert({
      actor_id: auth.user.id,
      action: "CREATE_DOCUMENT_UPLOAD_INTENT",
      entity_type: "CASE",
      entity_id: metadata.caseId,
      metadata: { path, role: metadata.role, mime_type: metadata.mimeType, file_size: metadata.fileSize },
    });

    return NextResponse.json({ path, token: signed.data.token, bucket });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Upload intent failed" }, { status: 400 });
  }
}

/**
 * Verify the uploaded object before registering it in case_documents.
 */
export async function PUT(request: Request) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  let uploadedPath = "";
  try {
    const body = await request.json();
    const metadata = validateMetadata(body);
    uploadedPath = String(body.file_path || "");
    const expectedPrefix = `${metadata.caseId}/${metadata.role}/`;
    if (!uploadedPath.startsWith(expectedPrefix) || uploadedPath.includes("..")) throw new Error("Invalid storage path");

    const admin = createAdminClient();
    const bucket = process.env.DOCUMENT_BUCKET || DEFAULT_BUCKET;
    const downloaded = await admin.storage.from(bucket).download(uploadedPath);
    if (downloaded.error) throw downloaded.error;

    const bytes = new Uint8Array(await downloaded.data.arrayBuffer());
    if (bytes.byteLength !== metadata.fileSize) throw new Error("Uploaded file size does not match the declared size");
    inspectContent(bytes, metadata.mimeType);

    const inserted = await admin.from("case_documents").insert({
      case_id: metadata.caseId,
      document_role: metadata.role,
      file_path: uploadedPath,
      file_name: metadata.fileName,
      mime_type: metadata.mimeType,
      file_size: metadata.fileSize,
      public_download_allowed: body.public_download_allowed === true,
      created_by: auth.user.id,
    }).select("id").single();
    if (inserted.error) throw inserted.error;

    await admin.from("audit_logs").insert({
      actor_id: auth.user.id,
      action: "UPLOAD_DOCUMENT",
      entity_type: "CASE_DOCUMENT",
      entity_id: inserted.data.id,
      metadata: {
        case_id: metadata.caseId,
        role: metadata.role,
        path: uploadedPath,
        mime_type: metadata.mimeType,
        file_size: metadata.fileSize,
      },
    });

    return NextResponse.json({ id: inserted.data.id }, { status: 201 });
  } catch (error: any) {
    if (uploadedPath) {
      const admin = createAdminClient();
      const bucket = process.env.DOCUMENT_BUCKET || DEFAULT_BUCKET;
      await admin.storage.from(bucket).remove([uploadedPath]);
    }
    return NextResponse.json({ error: error.message || "Upload completion failed" }, { status: 400 });
  }
}
