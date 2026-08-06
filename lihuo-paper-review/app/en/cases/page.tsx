import type { Metadata } from "next";
import { CaseCard } from "@/components/case-card";
import { applyCaseFilters } from "@/lib/case-filter";
import { CLINICAL_READINESS, EVIDENCE_GROUNDING, GENERAL_STATUSES } from "@/lib/constants";
import { getPublishedCases } from "@/lib/cases";
import type { PublicCase } from "@/lib/types";

export const metadata: Metadata = { title: "Case Database" };
export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const filters = Object.fromEntries(Object.entries(params).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value])) as Record<string, string | undefined>;
  let data: PublicCase[] = [];
  let loadError = false;
  try {
    const result = await getPublishedCases(filters);
    if (result.error) loadError = true;
    else data = applyCaseFilters((result.data ?? []) as unknown as PublicCase[], filters);
  } catch {
    loadError = true;
  }

  return (
    <div className="container-shell py-14">
      <div><div className="kicker">Case Database</div><h1 className="mt-3 text-4xl font-black text-[var(--navy)]">Published review cases</h1><p className="mt-3 muted">Only published records are shown. No fictional cases are generated.</p></div>
      <form className="card p-4 mt-8 grid md:grid-cols-4 gap-3" role="search">
        <input className="input md:col-span-2" name="q" defaultValue={filters.q} placeholder="Search title, author, journal, DOI" aria-label="Search cases" />
        <select className="select" name="type" defaultValue={filters.type || ""}><option value="">All case types</option><option value="GENERAL_PAPER_REVIEW">General paper</option><option value="MEDICAL_PAPER_REVIEW">Medical paper</option></select>
        <input className="input" name="domain" defaultValue={filters.domain} placeholder="Domain" />
        <input className="input" name="year" type="number" defaultValue={filters.year} placeholder="Publication year" />
        <input className="input" name="keyword" defaultValue={filters.keyword} placeholder="Keyword" />
        <select className="select" name="claim" defaultValue={filters.claim || ""}><option value="">Claim Authority</option>{GENERAL_STATUSES.map(value=><option key={value}>{value}</option>)}</select>
        <select className="select" name="evidence" defaultValue={filters.evidence || ""}><option value="">Evidence Status</option>{[...GENERAL_STATUSES, ...EVIDENCE_GROUNDING].map(value=><option key={value}>{value}</option>)}</select>
        <select className="select" name="readiness" defaultValue={filters.readiness || ""}><option value="">Clinical Readiness</option>{CLINICAL_READINESS.map(value=><option key={value}>{value}</option>)}</select>
        <input className="input" name="review_status" defaultValue={filters.review_status} placeholder="Review status / final judgment" />
        <button className="btn btn-primary" type="submit">Search and filter</button>
      </form>
      {loadError && <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">The database is not connected or environment variables are missing. Complete the Supabase setup described in README.</p>}
      <div className="mt-8">{data.length ? <div className="grid lg:grid-cols-2 gap-6">{data.map(item => <CaseCard key={item.id} item={item} locale="en" />)}</div> : <EmptyStateEnglish />}</div>
    </div>
  );
}

function EmptyStateEnglish() {
  return <div className="card p-10 text-center"><div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-blue-50 text-blue-700 text-xl" aria-hidden>⌁</div><h2 className="text-xl font-extrabold text-[var(--navy)]">Case data is being prepared.</h2><p className="muted mt-2">The database currently has no published cases. The site does not generate fictional records.</p></div>;
}
