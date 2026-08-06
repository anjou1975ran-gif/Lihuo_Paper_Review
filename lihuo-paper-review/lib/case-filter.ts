import type { PublicCase } from "@/lib/types";

export function applyCaseFilters(data: PublicCase[], filters: Record<string, string | undefined>): PublicCase[] {
  let result = data;
  if (filters.q) {
    const q = filters.q.toLowerCase();
    result = result.filter((item: any) =>
      [item.title, item.paper_title, item.journal, item.doi, ...(item.authors || []), ...(item.keywords || [])]
        .filter(Boolean)
        .some((value: unknown) => String(value).toLowerCase().includes(q)),
    );
  }
  if (filters.claim) result = result.filter((item: any) => item.general_review_states?.[0]?.claim_authority?.status === filters.claim);
  if (filters.evidence) {
    result = result.filter((item: any) =>
      item.general_review_states?.[0]?.empirical_support?.status === filters.evidence ||
      item.medical_review_states?.[0]?.evidence_grounding_level === filters.evidence,
    );
  }
  if (filters.readiness) result = result.filter((item: any) => item.medical_review_states?.[0]?.clinical_use_readiness === filters.readiness);
  if (filters.keyword) result = result.filter((item: any) => (item.keywords || []).some((keyword: string) => keyword.toLowerCase().includes(filters.keyword!.toLowerCase())));
  if (filters.review_status) {
    const status = filters.review_status.toLowerCase();
    result = result.filter((item) => item.review_outputs?.some((review) =>
      review.review_type === "LIHUO" && String(review.final_judgment || "").toLowerCase().includes(status),
    ));
  }
  return result;
}
