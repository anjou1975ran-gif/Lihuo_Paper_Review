import { NextResponse } from "next/server";
import { DEFAULT_BUCKET } from "@/lib/constants";
import { requireAdminApi } from "@/lib/server-api-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  if (typeof body.public_download_allowed !== "boolean") {
    return NextResponse.json({ error: "public_download_allowed must be boolean" }, { status: 400 });
  }

  const admin = createAdminClient();
  const updated = await admin
    .from("case_documents")
    .update({ public_download_allowed: body.public_download_allowed })
    .eq("id", id)
    .select("id")
    .single();
  if (updated.error) return NextResponse.json({ error: updated.error.message }, { status: 404 });

  await admin.from("audit_logs").insert({
    actor_id: auth.user.id,
    action: "UPDATE_DOCUMENT_PERMISSION",
    entity_type: "CASE_DOCUMENT",
    entity_id: id,
    metadata: { public_download_allowed: body.public_download_allowed },
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;
  const { id } = await params;
  const admin = createAdminClient();

  const row = await admin.from("case_documents").select("file_path").eq("id", id).single();
  if (row.error) return NextResponse.json({ error: row.error.message }, { status: 404 });

  const bucket = process.env.DOCUMENT_BUCKET || DEFAULT_BUCKET;
  const storage = await admin.storage.from(bucket).remove([row.data.file_path]);
  if (storage.error) return NextResponse.json({ error: storage.error.message }, { status: 400 });

  const deleted = await admin.from("case_documents").delete().eq("id", id).select("id").single();
  if (deleted.error) {
    return NextResponse.json(
      { error: `Storage object was removed but metadata deletion failed: ${deleted.error.message}` },
      { status: 500 },
    );
  }

  await admin.from("audit_logs").insert({
    actor_id: auth.user.id,
    action: "DELETE_DOCUMENT",
    entity_type: "CASE_DOCUMENT",
    entity_id: id,
    metadata: { path: row.data.file_path },
  });
  return NextResponse.json({ ok: true });
}
