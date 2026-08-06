import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/server-api-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;
  const { id } = await params;
  const admin = createAdminClient();

  const source = await admin.from("cases").select("*").eq("id", id).single();
  if (source.error) return NextResponse.json({ error: source.error.message }, { status: 404 });

  const original = source.data;
  const baseSlug = `${original.slug}-copy`;
  let slug = baseSlug;
  let index = 2;
  while ((await admin.from("cases").select("id", { count: "exact", head: true }).eq("slug", slug)).count) {
    slug = `${baseSlug}-${index++}`;
  }

  const {
    id: _id,
    created_at: _created,
    updated_at: _updated,
    published_at: _published,
    ...copyFields
  } = original;
  const inserted = await admin.from("cases").insert({
    ...copyFields,
    title: `${original.title}（副本）`,
    slug,
    publication_status: "DRAFT",
    partial_case: true,
    permissions_confirmed: false,
    privacy_checked: false,
    published_at: null,
    created_by: auth.user.id,
  }).select("id").single();
  if (inserted.error) return NextResponse.json({ error: inserted.error.message }, { status: 400 });
  const newId = inserted.data.id;

  try {
    const outputs = await admin.from("review_outputs").select("*").eq("case_id", id);
    if (outputs.error) throw outputs.error;
    if (outputs.data.length) {
      const copiedOutputs = await admin.from("review_outputs").insert(
        outputs.data.map(({ id: _rowId, case_id: _caseId, created_at: _createdAt, updated_at: _updatedAt, ...row }) => ({
          ...row,
          case_id: newId,
        })),
      );
      if (copiedOutputs.error) throw copiedOutputs.error;
    }

    for (const table of ["general_review_states", "medical_review_states", "comparison_summaries"] as const) {
      const row = await admin.from(table).select("*").eq("case_id", id).maybeSingle();
      if (row.error) throw row.error;
      if (row.data) {
        const {
          id: _rowId,
          case_id: _caseId,
          created_at: _createdAt,
          updated_at: _updatedAt,
          ...fields
        } = row.data as Record<string, unknown>;
        const copiedRow = await admin.from(table).insert({ ...fields, case_id: newId });
        if (copiedRow.error) throw copiedRow.error;
      }
    }
  } catch (error: any) {
    await admin.from("cases").delete().eq("id", newId);
    return NextResponse.json({ error: error.message || "Case copy failed" }, { status: 400 });
  }

  await admin.from("audit_logs").insert({
    actor_id: auth.user.id,
    action: "DUPLICATE_CASE",
    entity_type: "CASE",
    entity_id: newId,
    metadata: { source_case_id: id, files_copied: false },
  });
  return NextResponse.json({ id: newId }, { status: 201 });
}
