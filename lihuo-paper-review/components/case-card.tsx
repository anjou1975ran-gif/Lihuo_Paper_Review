import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";
import type { PublicCase } from "@/lib/types";

export function CaseCard({ item, locale = "zh" }: { item: PublicCase; locale?: "zh" | "en" }) {
  const english = locale === "en";
  const ordinary = item.review_outputs?.find((review) => review.review_type === "ORDINARY_AI");
  const lihuo = item.review_outputs?.find((review) => review.review_type === "LIHUO");
  const difference = (item.comparison_summaries?.[0] as any)?.strongest_difference;
  const href = `${english ? "/en" : ""}/cases/${item.slug}`;

  return (
    <article className="card p-6 flex flex-col gap-5">
      <div className="flex flex-wrap gap-2">
        <span className="badge badge-info">
          {item.case_type === "MEDICAL_PAPER_REVIEW"
            ? english ? "Medical paper" : "醫學論文"
            : english ? "General paper" : "一般論文"}
        </span>
        {item.domain && <span className="badge badge-neutral">{item.domain}</span>}
      </div>
      <div>
        <h2 className="text-xl font-extrabold text-[var(--navy)]">
          <Link href={href} className="hover:underline">{item.title}</Link>
        </h2>
        <p className="mt-1 font-semibold text-slate-700">{item.paper_title}</p>
        <p className="muted mt-1 text-sm">
          {[item.journal, item.publication_year].filter(Boolean).join(" · ") || (english ? "Source not recorded" : "來源未記錄")}
        </p>
      </div>
      <p className="leading-7 text-slate-700 line-clamp-3">{item.summary}</p>
      {difference && (
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-xs font-bold uppercase text-slate-500">{english ? "Main difference" : "主要差異"}</div>
          <p className="mt-2 text-sm leading-6">{difference}</p>
        </div>
      )}
      <div className="grid md:grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
          <div className="text-xs font-bold uppercase text-slate-500">{english ? "Ordinary AI conclusion" : "普通 AI 結論"}</div>
          <div className="mt-2"><StatusBadge value={ordinary?.final_judgment} /></div>
        </div>
        <div className="rounded-xl bg-blue-50 p-4 border border-blue-100">
          <div className="text-xs font-bold uppercase text-blue-700">{english ? "LIHUO conclusion" : "理火審查結論"}</div>
          <div className="mt-2"><StatusBadge value={lihuo?.final_judgment} /></div>
        </div>
      </div>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
        <span className="muted text-sm">
          {english ? "Published: " : "發布日期："}
          {item.published_at ? new Date(item.published_at).toLocaleDateString(english ? "en-US" : "zh-TW") : (english ? "Not recorded" : "未記錄")}
        </span>
        <Link className="btn btn-primary" href={href}>{english ? "View case →" : "查看完整案例 →"}</Link>
      </div>
    </article>
  );
}
