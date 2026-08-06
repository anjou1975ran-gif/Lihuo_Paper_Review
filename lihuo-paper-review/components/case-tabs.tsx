"use client";

import { useState } from "react";
import { MarkdownContent } from "@/components/markdown-content";
import { StatusBadge } from "@/components/status-badge";

const TAB_ITEMS_ZH = [
  ["paper", "論文來源"],
  ["ordinary", "普通 AI 審查"],
  ["lihuo", "理火審查"],
  ["compare", "比較"],
] as const;
const TAB_ITEMS_EN = [
  ["paper", "Paper source"],
  ["ordinary", "Ordinary AI review"],
  ["lihuo", "LIHUO review"],
  ["compare", "Comparison"],
] as const;

export function CaseTabs({ data, locale = "zh" }: { data: any; locale?: "zh" | "en" }) {
  const english = locale === "en";
  const tabItems = english ? TAB_ITEMS_EN : TAB_ITEMS_ZH;
  const [tab, setTab] = useState<(typeof TAB_ITEMS_ZH)[number][0]>("paper");
  const ordinary = data.review_outputs?.find((row: any) => row.review_type === "ORDINARY_AI");
  const lihuo = data.review_outputs?.find((row: any) => row.review_type === "LIHUO");
  const general = data.general_review_states?.[0];
  const medical = data.medical_review_states?.[0];
  const comparison = data.comparison_summaries?.[0];
  const paperDoc = data.case_documents?.find((row: any) => row.document_role === "PAPER_SOURCE");
  const ordinaryDoc = data.case_documents?.find((row: any) => row.document_role === "ORDINARY_AI_REVIEW");
  const lihuoDoc = data.case_documents?.find((row: any) => row.document_role === "LIHUO_REVIEW");
  const paperText = paperDoc?.pasted_text || data.paper_source_text || data.paper_abstract || data.source_note;

  return (
    <div className="card overflow-hidden">
      <div className="flex overflow-x-auto border-b border-slate-200 bg-slate-50 p-2" role="tablist" aria-label={english ? "Case content" : "案例內容"}>
        {tabItems.map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-lg font-bold whitespace-nowrap ${tab === key ? "bg-white text-blue-700 shadow-sm" : "text-slate-600"}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="p-6 md:p-8">
        {tab === "paper" && (
          <div className="space-y-6">
            <Info label={english ? "Citation" : "正式引用"} value={data.citation} />
            <Info label="DOI" value={data.doi} />
            <Info label={english ? "Original source URL" : "原始網址"} value={data.original_url} link />
            <Info label={english ? "Source type" : "來源類型"} value={data.paper_source_type} />
            <div>
              <h3 className="text-lg font-extrabold text-[var(--navy)]">{english ? "Paper abstract / source text" : "論文摘要／來源文字"}</h3>
              <div className="mt-3"><MarkdownContent content={paperText} /></div>
            </div>
            <DocumentPanel document={paperDoc} label={english ? "Original paper file" : "論文原始檔"} hasTextPreview={Boolean(paperText)} english={english} />
          </div>
        )}

        {tab === "ordinary" && <ReviewPanel review={ordinary} document={ordinaryDoc} ordinary english={english} />}

        {tab === "lihuo" && (
          <div className="space-y-8">
            <ReviewPanel review={lihuo} document={lihuoDoc} english={english} />
            {general && <StateGrid title={english ? "Multi-axis qualification state" : "多軸資格狀態"} data={general} />}
            {medical && <StateGrid title={english ? "Medical review-specific results" : "醫學論文專屬結果"} data={medical} medical />}
          </div>
        )}

        {tab === "compare" && (
          <div className="space-y-8">
            <ComparisonMatrix ordinary={ordinary} lihuo={lihuo} general={general} english={english} />
            {comparison && <ComparisonSummary data={comparison} english={english} />}
            <p className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-amber-900">
              {english
                ? "This comparison only presents uploaded content and administrator-supplied structured differences. It does not automatically claim that LIHUO is more correct than ordinary AI."
                : "比較頁僅呈現已上傳內容與管理員提供的結構化差異，不自動宣稱理火一定比普通 AI 正確。"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Info({ label, value, link = false }: { label: string; value?: string | null; link?: boolean }) {
  return (
    <div>
      <div className="text-sm font-bold text-slate-500">{label}</div>
      {link && value ? (
        <a className="text-blue-700 underline break-all" href={value} target="_blank" rel="noreferrer">{value}</a>
      ) : (
        <p className="mt-1 break-words">{value || "UNKNOWN / NOT RECORDED"}</p>
      )}
    </div>
  );
}

function DocumentPanel({ document, label, hasTextPreview, english = false }: { document?: any; label: string; hasTextPreview: boolean; english?: boolean }) {
  if (!document?.file_name) return null;
  const canDownload = Boolean(document.public_download_allowed);
  const isPdf = document.mime_type === "application/pdf";

  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="font-bold">{label}：{document.file_name}</div>
      <p className="muted mt-1 text-sm">{document.mime_type || "MIME UNKNOWN"}</p>
      {!hasTextPreview && !(isPdf && canDownload) && (
        <p className="mt-3 badge badge-warn">PREVIEW_UNAVAILABLE</p>
      )}
      {isPdf && canDownload && (
        <object
          className="mt-4 h-[620px] w-full rounded-xl border border-slate-200"
          data={`/api/documents/${document.id}/download`}
          type="application/pdf"
          aria-label={`${label} PDF preview`}
        >
          <p>PREVIEW_UNAVAILABLE</p>
        </object>
      )}
      {canDownload ? (
        <a className="btn btn-secondary mt-3" href={`/api/documents/${document.id}/download`}>{english ? "Download file" : "下載文件"}</a>
      ) : (
        <p className="muted mt-2">{english ? "Public download is not enabled by the administrator." : "管理員未開放公開下載。"}</p>
      )}
    </div>
  );
}

function ReviewPanel({ review, document, ordinary = false, english = false }: { review: any; document?: any; ordinary?: boolean; english?: boolean }) {
  const fullText = review?.full_text;
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <Info label={ordinary ? (english ? "Model name" : "模型名稱") : (english ? "Review system" : "審查系統")} value={review?.system_name} />
        <Info label={english ? "Version" : "版本"} value={review?.system_version} />
        <Info label={english ? "Reasoning / review mode" : "推理／審查模式"} value={review?.reasoning_mode} />
        <Info label={english ? "Review date" : "審查日期"} value={review?.review_date} />
      </div>
      <div>
        <h3 className="font-extrabold text-[var(--navy)]">{english ? "Summary" : "摘要"}</h3>
        <p className="mt-2 leading-7">{review?.short_summary || "UNKNOWN / NOT RECORDED"}</p>
      </div>
      <div>
        <h3 className="font-extrabold text-[var(--navy)]">{english ? "Final judgment" : "最終判斷"}</h3>
        <div className="mt-2"><StatusBadge value={review?.final_judgment} /></div>
      </div>
      {!ordinary && (
        <>
          <Info label={english ? "Source scope" : "審查範圍"} value={review?.source_scope} />
          <Info label={english ? "Evidence boundary" : "證據邊界"} value={review?.evidence_boundary} />
          <Info label={english ? "Missing evidence" : "缺失證據"} value={review?.missing_evidence} />
          <Info label={english ? "Required revision" : "修訂要求"} value={review?.required_revision} />
        </>
      )}
      <div>
        <h3 className="font-extrabold text-[var(--navy)]">{english ? "Full review content" : "完整審查內容"}</h3>
        <div className="mt-3"><MarkdownContent content={fullText} /></div>
      </div>
      <DocumentPanel document={document} label={ordinary ? (english ? "Ordinary AI review file" : "普通 AI 審查檔") : (english ? "LIHUO review file" : "理火審查檔")} hasTextPreview={Boolean(fullText)} english={english} />
    </div>
  );
}

function StateGrid({ title, data, medical = false }: { title: string; data: Record<string, any>; medical?: boolean }) {
  return (
    <div>
      <h3 className="text-lg font-extrabold text-[var(--navy)] mb-4">{title}</h3>
      <div className="grid md:grid-cols-2 gap-3">
        {Object.entries(data)
          .filter(([key]) => !["id", "case_id", "created_at", "updated_at"].includes(key))
          .map(([key, value]) => (
            <div key={key} className={`rounded-xl border p-4 ${medical ? "border-blue-100 bg-blue-50/50" : "border-slate-200"}`}>
              <div className={`font-bold text-sm ${medical ? "text-blue-800" : "text-slate-600"}`}>{key}</div>
              <div className="mt-2">
                {typeof value === "string" ? (
                  <StatusBadge value={value} />
                ) : value && typeof value === "object" && "status" in value ? (
                  <>
                    <StatusBadge value={value.status} />
                    {value.reason && <p className="mt-2 text-sm leading-6">{value.reason}</p>}
                    {value.evidence_anchor && <Info label="Evidence Anchor" value={value.evidence_anchor} />}
                    {value.missing_evidence && <Info label="Missing Evidence" value={value.missing_evidence} />}
                  </>
                ) : (
                  <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(value, null, 2)}</pre>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

function ComparisonMatrix({ ordinary, lihuo, general, english = false }: { ordinary: any; lihuo: any; general: any; english?: boolean }) {
  const claimAuthority = general?.claim_authority;
  const rows = [
    [english ? "Problem framing" : "問題如何被定義", ordinary?.review_prompt_summary, lihuo?.review_prompt_summary || lihuo?.source_scope],
    [english ? "Claims extracted" : "抽取了哪些主張", ordinary?.short_summary, lihuo?.short_summary],
    [english ? "Evidence used" : "使用了哪些證據", ordinary?.source_scope, lihuo?.source_scope],
    [english ? "Uncertainty retained" : "哪些不確定性被保留", ordinary?.missing_evidence, lihuo?.missing_evidence],
    [english ? "Observation vs inference" : "是否區分觀察與推論", ordinary?.notes, lihuo?.notes],
    [english ? "Failure conditions" : "是否提出失效條件", ordinary?.evidence_boundary, lihuo?.evidence_boundary],
    [english ? "Claim authority control" : "是否控制 Claim Authority", null, claimAuthority ? `${claimAuthority.status || ""}${claimAuthority.reason ? ` — ${claimAuthority.reason}` : ""}` : null],
    [english ? "HOLD retained" : "是否保留 HOLD", holdLabel(ordinary?.final_judgment, english), holdLabel(lihuo?.final_judgment, english)],
    [english ? "Data gaps marked" : "是否標記資料缺口", ordinary?.missing_evidence, lihuo?.missing_evidence],
    [english ? "Final conclusion" : "最終結論", ordinary?.final_judgment, lihuo?.final_judgment],
    [english ? "Scope of conclusion" : "結論成立範圍", ordinary?.evidence_boundary || ordinary?.source_scope, lihuo?.evidence_boundary || lihuo?.source_scope],
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200">
      <div className="hidden bg-slate-50 font-extrabold text-[var(--navy)] md:grid md:grid-cols-[220px_1fr_1fr]">
        <div className="p-4">{english ? "Comparison item" : "比較欄位"}</div>
        <div className="border-l border-slate-200 p-4">Ordinary AI Review</div>
        <div className="border-l border-blue-100 bg-blue-50/70 p-4">LIHUO Review</div>
      </div>
      {rows.map(([label, ordinaryValue, lihuoValue]) => (
        <div key={String(label)} className="grid border-t border-slate-200 md:grid-cols-[220px_1fr_1fr] first:border-t-0 md:first:border-t">
          <div className="bg-slate-50 p-4 font-bold text-slate-700">{label}</div>
          <ComparisonCell title="Ordinary AI Review" value={ordinaryValue} />
          <ComparisonCell title="LIHUO Review" value={lihuoValue} lihuo />
        </div>
      ))}
    </div>
  );
}

function ComparisonCell({ title, value, lihuo = false }: { title: string; value: unknown; lihuo?: boolean }) {
  return (
    <div className={`border-t border-slate-200 p-4 md:border-l md:border-t-0 ${lihuo ? "bg-blue-50/35 md:border-blue-100" : ""}`}>
      <div className="mb-2 text-xs font-bold uppercase text-slate-500 md:hidden">{title}</div>
      <p className="whitespace-pre-wrap leading-7">{String(value || "UNKNOWN / NOT RECORDED")}</p>
    </div>
  );
}

function holdLabel(value: unknown, english: boolean) {
  if (!value) return "UNKNOWN / NOT RECORDED";
  return String(value).toUpperCase().includes("HOLD")
    ? english ? "YES — HOLD is explicit" : "是 — 明確標示 HOLD"
    : english ? "NOT EXPLICITLY RECORDED" : "未明確記錄";
}

function ComparisonSummary({ data, english = false }: { data: Record<string, unknown>; english?: boolean }) {
  return (
    <div>
      <h3 className="text-lg font-extrabold text-[var(--navy)] mb-4">{english ? "Structured difference summary" : "結構化差異摘要"}</h3>
      <div className="grid md:grid-cols-2 gap-3">
        {Object.entries(data)
          .filter(([key]) => !["id", "case_id", "created_at", "updated_at"].includes(key))
          .map(([key, value]) => (
            <div key={key} className="rounded-xl border border-slate-200 p-4">
              <div className="font-bold text-sm text-slate-600">{key}</div>
              <p className="mt-2 leading-6">{String(value || "UNKNOWN / NOT RECORDED")}</p>
            </div>
          ))}
      </div>
    </div>
  );
}
