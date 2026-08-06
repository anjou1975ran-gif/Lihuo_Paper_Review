import type { Metadata } from "next";
import { CaseCard } from "@/components/case-card";
import { EmptyState } from "@/components/empty-state";
import { getPublishedCases } from "@/lib/cases";
import type { PublicCase } from "@/lib/types";
import { applyCaseFilters } from "@/lib/case-filter";
import { CLINICAL_READINESS, EVIDENCE_GROUNDING, GENERAL_STATUSES } from "@/lib/constants";

export const metadata: Metadata = { title: "案例資料庫" };
export const dynamic = "force-dynamic";

export default async function CasesPage({ searchParams }: { searchParams: Promise<Record<string,string|string[]|undefined>> }) {
  const params = await searchParams;
  const filters = Object.fromEntries(Object.entries(params).map(([k,v])=>[k,Array.isArray(v)?v[0]:v])) as Record<string,string|undefined>;
  let data: PublicCase[] = [];
  let loadError = false;
  try {
    const result = await getPublishedCases(filters);
    if (result.error) loadError = true; else {
      data = (result.data ?? []) as unknown as PublicCase[];
      data = applyCaseFilters(data, filters);
    }
  } catch { loadError = true; }
  return <div className="container-shell py-14"><div className="flex flex-col md:flex-row md:items-end justify-between gap-5"><div><div className="kicker">Case Database</div><h1 className="mt-3 text-4xl font-black text-[var(--navy)]">案例資料庫</h1><p className="mt-3 muted">只顯示已發布案例；不建立或補入虛構資料。</p></div></div>
    <form className="card p-4 mt-8 grid md:grid-cols-4 gap-3" role="search">
      <input className="input md:col-span-2" name="q" defaultValue={filters.q} placeholder="搜尋標題、作者、期刊、DOI" aria-label="搜尋案例"/>
      <select className="select" name="type" defaultValue={filters.type||""}><option value="">全部類型</option><option value="GENERAL_PAPER_REVIEW">一般論文</option><option value="MEDICAL_PAPER_REVIEW">醫學論文</option></select>
      <input className="input" name="domain" defaultValue={filters.domain} placeholder="學科領域"/>
      <input className="input" name="year" type="number" defaultValue={filters.year} placeholder="發表年份"/>
      <input className="input" name="keyword" defaultValue={filters.keyword} placeholder="關鍵字"/>
      <select className="select" name="claim" defaultValue={filters.claim||""}><option value="">Claim Authority</option>{GENERAL_STATUSES.map(v=><option key={v}>{v}</option>)}</select>
      <select className="select" name="evidence" defaultValue={filters.evidence||""}><option value="">Evidence Status</option>{[...GENERAL_STATUSES, ...EVIDENCE_GROUNDING].map(v=><option key={v}>{v}</option>)}</select>
      <select className="select" name="readiness" defaultValue={filters.readiness||""}><option value="">Clinical Readiness</option>{CLINICAL_READINESS.map(v=><option key={v}>{v}</option>)}</select>
      <input className="input" name="review_status" defaultValue={filters.review_status} placeholder="審查狀態／最終判斷"/>
      <button className="btn btn-primary" type="submit">搜尋與篩選</button>
    </form>
    {loadError && <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">資料庫尚未連線或環境變數未設定。部署後請依 README 完成 Supabase 設定。</p>}
    <div className="mt-8">{data.length ? <div className="grid lg:grid-cols-2 gap-6">{data.map(item=><CaseCard key={item.id} item={item}/>)}</div> : <EmptyState />}</div>
  </div>;
}
