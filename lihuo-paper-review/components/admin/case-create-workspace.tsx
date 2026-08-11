"use client";

import { useState } from "react";
import { CaseForm, createBlankPayload } from "@/components/admin/case-form";
import { parseWebCaseUploadPacket } from "@/lib/web-case-packet";

function mergeDraft(base: any, patch: any) {
  return {
    ...base,
    ...patch,
    case: { ...base.case, ...(patch.case || {}) },
    paper_source: { ...base.paper_source, ...(patch.paper_source || {}) },
    ordinary_review: { ...base.ordinary_review, ...(patch.ordinary_review || {}) },
    lihuo_review: { ...base.lihuo_review, ...(patch.lihuo_review || {}) },
    general_review_states: {
      ...base.general_review_states,
      ...(patch.general_review_states || {}),
    },
    medical_review_state: {
      ...base.medical_review_state,
      ...(patch.medical_review_state || {}),
    },
    comparison_summary: {
      ...base.comparison_summary,
      ...(patch.comparison_summary || {}),
    },
  };
}

export function CaseCreateWorkspace() {
  const [mode, setMode] = useState<"packet" | "plain">("packet");
  const [draft, setDraft] = useState(() => createBlankPayload());
  const [formVersion, setFormVersion] = useState(0);
  const [message, setMessage] = useState("");
  const [warnings, setWarnings] = useState<string[]>([]);
  const [plainText, setPlainText] = useState("");
  const [plainFileName, setPlainFileName] = useState("");

  function applyPatch(patch: any) {
    setDraft(mergeDraft(createBlankPayload(), patch));
    setFormVersion((v) => v + 1);
  }

  async function importPacketFile(file?: File) {
    if (!file) return;
    setMessage("");
    setWarnings([]);
    if (!/\.(txt|md|markdown)$/i.test(file.name)) {
      setMessage("標準回報包請使用 TXT 或 Markdown 檔案。");
      return;
    }
    const text = await file.text();
    const parsed = parseWebCaseUploadPacket(text);
    if (!parsed.detected) {
      setMessage("這份文件不是可辨識的 WEB CASE UPLOAD PACKET；你可以改用「普通文件／純文字」模式。");
      setWarnings(parsed.warnings);
      return;
    }
    applyPatch(parsed.patch);
    setWarnings(parsed.warnings);
    setMessage(`已解析標準回報包，帶入約 ${parsed.importedFields} 個欄位。請檢查後再儲存；目前仍為 DRAFT。`);
  }

  async function loadPlainFile(file?: File) {
    if (!file) return;
    setMessage("");
    setWarnings([]);
    if (!/\.(txt|md|markdown)$/i.test(file.name)) {
      setMessage("普通文件的人類可閱讀空間目前接受 TXT 或 Markdown。");
      return;
    }
    const text = await file.text();
    setPlainText(text);
    setPlainFileName(file.name);
    setMessage(`已載入 ${file.name}，尚未寫入案例草稿。你可以先閱讀／修改，再按「放入案例表單」。`);
  }

  function sendPlainTextToForm() {
    if (!plainText.trim()) {
      setMessage("請先上傳或貼上純文字內容。");
      return;
    }
    const base = createBlankPayload();
    applyPatch({
      case: {
        case_type: "GENERAL_PAPER_REVIEW",
        source_note: plainFileName ? `普通文件純文字來源：${plainFileName}` : "普通文件純文字貼上內容。",
      },
      paper_source: {
        source_type: "PASTED_TEXT",
        pasted_text: plainText,
        public_download_allowed: false,
      },
    });
    setWarnings([
      "普通文件模式不會自動推論標題、作者、結論或審查狀態；請在人類可閱讀文字下方的案例表單自行填寫需要的欄位。",
    ]);
    setMessage("純文字已放入「論文來源／貼上文字」欄位。案例維持 DRAFT，不會自動發布。");
  }

  return (
    <div className="space-y-6">
      <section className="card p-5 md:p-6">
        <div className="kicker">Case Intake</div>
        <h1 className="mt-2 text-3xl font-black text-[var(--navy)]">資料上傳方式</h1>
        <p className="mt-3 muted max-w-4xl">
          選擇標準回報包時，網站只把 R1 的 WEB CASE UPLOAD PACKET 投影到既有欄位；不重新審查、不補造缺失資料，也不自動發布。
          普通文件模式則保留一個單純、可閱讀、可編輯的純文字空間。
        </p>

        <div className="mt-5 grid md:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setMode("packet")}
            className={`rounded-2xl border p-5 text-left transition ${mode === "packet" ? "border-[var(--accent)] bg-orange-50" : "border-slate-200 bg-white"}`}
          >
            <div className="font-black text-lg text-[var(--navy)]">A｜標準回報包自動匯入</div>
            <div className="mt-2 text-sm muted">上傳包含 WEB CASE UPLOAD PACKET 的 TXT／Markdown，自動帶入案例、理火審查、多軸與醫療欄位。</div>
          </button>
          <button
            type="button"
            onClick={() => setMode("plain")}
            className={`rounded-2xl border p-5 text-left transition ${mode === "plain" ? "border-[var(--accent)] bg-orange-50" : "border-slate-200 bg-white"}`}
          >
            <div className="font-black text-lg text-[var(--navy)]">B｜普通文件／純文字審查</div>
            <div className="mt-2 text-sm muted">不解析格式、不自動判斷，只保留人類可閱讀與編輯的純文字內容，再由你補案例資料。</div>
          </button>
        </div>

        {mode === "packet" ? (
          <div className="mt-5 rounded-2xl border border-slate-200 p-5 bg-slate-50">
            <label className="font-extrabold text-[var(--navy)]">上傳 R1 標準回報檔</label>
            <input
              className="input mt-3"
              type="file"
              accept=".txt,.md,.markdown,text/plain,text/markdown"
              onChange={(e) => importPacketFile(e.target.files?.[0])}
            />
            <div className="mt-3 text-sm muted">
              必須包含 <code>WEB CASE UPLOAD PACKET</code>。若回報前段含完整理火審查，會把前段原文放入理火審查全文；來源 PDF 只做檔名參照，不會假裝已上傳二進位檔。
            </div>
          </div>
        ) : (
          <div className="mt-5 rounded-2xl border border-slate-200 p-5 bg-slate-50 space-y-4">
            <div>
              <label className="font-extrabold text-[var(--navy)]">上傳普通 TXT／Markdown</label>
              <input
                className="input mt-3"
                type="file"
                accept=".txt,.md,.markdown,text/plain,text/markdown"
                onChange={(e) => loadPlainFile(e.target.files?.[0])}
              />
            </div>
            <div>
              <label className="font-extrabold text-[var(--navy)]">人類可閱讀純文字空間</label>
              <textarea
                className="textarea min-h-72 mt-3 font-mono text-sm"
                value={plainText}
                onChange={(e) => setPlainText(e.target.value)}
                placeholder="可直接貼上普通論文、文章、報告或 Markdown 文字。此模式不會自動生成審查結論。"
              />
            </div>
            <button type="button" className="btn btn-primary" onClick={sendPlainTextToForm}>放入案例表單</button>
          </div>
        )}

        {message && <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm font-bold text-blue-900">{message}</div>}
        {warnings.length > 0 && (
          <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
            <div className="font-extrabold mb-2">匯入提醒</div>
            <ul className="list-disc pl-5 space-y-1">{warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul>
          </div>
        )}
      </section>

      <CaseForm key={formVersion} initial={draft} />
    </div>
  );
}
