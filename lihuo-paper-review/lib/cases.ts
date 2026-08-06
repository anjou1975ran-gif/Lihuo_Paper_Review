import { createClient } from "@/lib/supabase/server";

export async function getPublishedCases(filters: Record<string, string | undefined>) {
  const supabase = await createClient();
  let query = supabase
    .from("cases")
    .select("id,title,slug,summary,paper_title,authors,journal,publication_year,doi,domain,keywords,case_type,publication_status,published_at,review_outputs(review_type,short_summary,final_judgment),general_review_states(claim_authority,empirical_support),medical_review_states(clinical_use_readiness,evidence_grounding_level),comparison_summaries(strongest_difference)")
    .eq("publication_status", "PUBLISHED")
    .order("published_at", { ascending: false });

  if (filters.type) query = query.eq("case_type", filters.type);
  if (filters.domain) query = query.eq("domain", filters.domain);
  if (filters.year) query = query.eq("publication_year", Number(filters.year));
  return query;
}

export async function getPublishedCaseBySlug(slug: string) {
  const supabase = await createClient();
  return supabase
    .from("cases")
    .select(`
      *,
      review_outputs(*),
      general_review_states(*),
      medical_review_states(*),
      comparison_summaries(*),
      case_documents(id,document_role,file_name,mime_type,pasted_text,public_download_allowed,metadata,created_at)
    `)
    .eq("slug", slug)
    .eq("publication_status", "PUBLISHED")
    .single();
}
