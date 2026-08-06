import { NextResponse } from "next/server";
import { DEFAULT_BUCKET } from "@/lib/constants";
import { persistCaseBundle } from "@/lib/persist-case";
import { assessPublication } from "@/lib/publication-guard";
import { requireAdminApi } from "@/lib/server-api-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { casePayloadSchema } from "@/lib/validators";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;
  const { id } = await params;

  try {
    const payload = casePayloadSchema.parse(await request.json());
    const admin = createAdminClient();

    if (payload.case.publication_status === "PUBLISHED") {
      const documents = await admin.from("case_documents").select("document_role").eq("case_id", id);
      if (documents.error) throw documents.error;
      const assessment = assessPublication(
        payload,
        (documents.data || []).map((row: any) => row.document_role),
      );
      if (assessment.confirmationsMissing.length) {
        return NextResponse.json(
          { error: `Publication confirmations missing: ${assessment.confirmationsMissing.join(", ")}` },
          { status: 409 },
        );
      }
      if (assessment.contentMissing.length && !payload.case.partial_case) {
        return NextResponse.json(
          { error: `Incomplete publication requires PARTIAL CASE: ${assessment.contentMissing.join(", ")}` },
          { status: 409 },
        );
      }
    }

    const current = await admin.from("cases").select("publication_status,published_at").eq("id", id).single();
    if (current.error) throw current.error;

    const updates: Record<string, unknown> = {
      ...payload.case,
      review_date: payload.case.review_date || null,
      paper_source_type: payload.paper_source.source_type,
      paper_source_text: payload.paper_source.pasted_text,
      copyright_note: payload.paper_source.copyright_note,
    };
    if (payload.case.publication_status === "PUBLISHED" && !current.data.published_at) {
      updates.published_at = new Date().toISOString();
    }

    const updated = await admin.from("cases").update(updates).eq("id", id).select("id").single();
    if (updated.error) throw updated.error;

    await persistCaseBundle(admin, id, payload, auth.user.id, "UPDATE");
    return NextResponse.json({ id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;
  const { id } = await params;
  const admin = createAdminClient();

  const current = await admin.from("cases").select("publication_status").eq("id", id).single();
  if (current.error) return NextResponse.json({ error: current.error.message }, { status: 404 });
  if (current.data.publication_status === "PUBLISHED") {
    return NextResponse.json({ error: "Published cases must be withdrawn before deletion." }, { status: 409 });
  }

  const documents = await admin.from("case_documents").select("file_path").eq("case_id", id);
  if (documents.error) return NextResponse.json({ error: documents.error.message }, { status: 400 });
  if (documents.data.length) {
    const bucket = process.env.DOCUMENT_BUCKET || DEFAULT_BUCKET;
    const removal = await admin.storage.from(bucket).remove(documents.data.map((row) => row.file_path));
    if (removal.error) return NextResponse.json({ error: removal.error.message }, { status: 400 });
  }

  const deleted = await admin.from("cases").delete().eq("id", id).select("id").single();
  if (deleted.error) return NextResponse.json({ error: deleted.error.message }, { status: 400 });

  await admin.from("audit_logs").insert({
    actor_id: auth.user.id,
    action: "DELETE_CASE",
    entity_type: "CASE",
    entity_id: id,
  });
  return NextResponse.json({ ok: true });
}
