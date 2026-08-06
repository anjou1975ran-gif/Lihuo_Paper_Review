import { NextResponse } from "next/server";
import { persistCaseBundle } from "@/lib/persist-case";
import { assessPublication } from "@/lib/publication-guard";
import { requireAdminApi } from "@/lib/server-api-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { casePayloadSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  try {
    const payload = casePayloadSchema.parse(await request.json());

    if (payload.case.publication_status === "PUBLISHED") {
      const assessment = assessPublication(payload);
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

    const admin = createAdminClient();
    const caseRow = {
      ...payload.case,
      review_date: payload.case.review_date || null,
      published_at: payload.case.publication_status === "PUBLISHED" ? new Date().toISOString() : null,
      created_by: auth.user.id,
      paper_source_type: payload.paper_source.source_type,
      paper_source_text: payload.paper_source.pasted_text,
      copyright_note: payload.paper_source.copyright_note,
    };

    const inserted = await admin.from("cases").insert(caseRow).select("id").single();
    if (inserted.error) throw inserted.error;

    try {
      await persistCaseBundle(admin, inserted.data.id, payload, auth.user.id, "CREATE");
    } catch (bundleError) {
      // A newly created case must not remain as a silent partial record when its related rows fail.
      await admin.from("cases").delete().eq("id", inserted.data.id);
      throw bundleError;
    }

    return NextResponse.json({ id: inserted.data.id }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Invalid request" }, { status: 400 });
  }
}
