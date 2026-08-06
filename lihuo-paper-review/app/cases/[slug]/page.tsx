import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseTabs } from "@/components/case-tabs";
import { getPublishedCaseBySlug } from "@/lib/cases";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { data } = await getPublishedCaseBySlug(slug);
    return { title: data?.title || "案例", description: data?.summary || undefined };
  } catch {
    return { title: "案例" };
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let data: any = null;
  try {
    const result = await getPublishedCaseBySlug(slug);
    if (result.error) notFound();
    data = result.data;
  } catch {
    notFound();
  }

  return (
    <div className="container-shell py-12">
      <div className="max-w-5xl">
        <div className="flex flex-wrap gap-2">
          <span className="badge badge-info">{data.case_type === "MEDICAL_PAPER_REVIEW" ? "醫學論文" : "一般論文"}</span>
          {data.partial_case && <span className="badge badge-warn">PARTIAL CASE / DATA INCOMPLETE</span>}
        </div>
        <h1 className="mt-4 text-4xl font-black text-[var(--navy)]">{data.title}</h1>
        <p className="mt-3 text-xl font-bold text-slate-700">{data.paper_title}</p>
        <p className="mt-3 muted">{(data.authors || []).join("、") || "作者未記錄"}</p>
        <p className="mt-5 text-lg leading-8 text-slate-700">{data.summary}</p>

        <dl className="mt-7 grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 md:grid-cols-2">
          <Meta label="期刊／來源" value={[data.journal, data.publication_year].filter(Boolean).join(" · ")} />
          <Meta label="案例類型" value={data.case_type} />
          <Meta label="DOI" value={data.doi} />
          <Meta label="案例語言" value={data.language} />
          <Meta label="原始來源" value={data.original_url} link />
          <Meta label="審查日期" value={data.review_date} />
        </dl>

        <div className="mt-5 flex flex-wrap gap-2">
          {(data.keywords || []).map((keyword: string) => <span key={keyword} className="badge badge-neutral">{keyword}</span>)}
        </div>
      </div>

      <div className="mt-10"><CaseTabs data={data} /></div>
      {data.case_type === "MEDICAL_PAPER_REVIEW" && (
        <p className="mt-8 rounded-xl border border-blue-100 bg-blue-50 p-4 text-blue-900">
          LIHUO MedReview 不提供病人診斷、不建議治療、不核准醫療器材，也不將單篇論文直接轉換為臨床指引。
        </p>
      )}
    </div>
  );
}

function Meta({ label, value, link = false }: { label: string; value?: string | number | null; link?: boolean }) {
  return (
    <div>
      <dt className="text-sm font-bold text-slate-500">{label}</dt>
      <dd className="mt-1 break-words font-semibold">
        {link && value ? <a className="text-blue-700 underline" href={String(value)} target="_blank" rel="noreferrer">{value}</a> : value || "UNKNOWN / NOT RECORDED"}
      </dd>
    </div>
  );
}
