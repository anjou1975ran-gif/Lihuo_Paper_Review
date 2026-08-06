"use client";

import { useState } from "react";
import { DOCUMENT_ROLES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";

export function DocumentUploader({ caseId, documents }: { caseId: string; documents: any[] }) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function upload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("建立安全上傳通道…");

    try {
      const form = new FormData(event.currentTarget);
      const file = form.get("file");
      const role = String(form.get("document_role") || "");
      const publicDownloadAllowed = form.get("public_download_allowed") === "true";
      if (!(file instanceof File)) throw new Error("請選擇檔案");

      const mimeType = inferMimeType(file);
      const metadata = {
        case_id: caseId,
        document_role: role,
        file_name: file.name,
        mime_type: mimeType,
        file_size: file.size,
        public_download_allowed: publicDownloadAllowed,
      };

      const intentResponse = await fetch("/api/admin/documents", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(metadata),
      });
      const intent = await intentResponse.json();
      if (!intentResponse.ok) throw new Error(intent.error || "無法建立上傳通道");

      setMessage("檔案上傳中…");
      const supabase = createClient();
      const uploaded = await supabase.storage
        .from(intent.bucket)
        .uploadToSignedUrl(intent.path, intent.token, file, { contentType: mimeType });
      if (uploaded.error) throw uploaded.error;

      setMessage("驗證檔案並建立紀錄…");
      const completeResponse = await fetch("/api/admin/documents", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...metadata, file_path: intent.path }),
      });
      const completed = await completeResponse.json();
      if (!completeResponse.ok) throw new Error(completed.error || "上傳驗證失敗");

      setMessage("上傳完成");
      window.location.reload();
    } catch (error: any) {
      setMessage(error.message || "上傳失敗");
    } finally {
      setBusy(false);
    }
  }

  async function setPermission(id: string, value: boolean) {
    setBusy(true);
    const response = await fetch(`/api/admin/documents/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ public_download_allowed: value }),
    });
    if (response.ok) window.location.reload();
    else setMessage((await response.json()).error || "權限更新失敗");
    setBusy(false);
  }

  async function remove(id: string) {
    if (!confirm("確定刪除這份文件？")) return;
    setBusy(true);
    const response = await fetch(`/api/admin/documents/${id}`, { method: "DELETE" });
    if (response.ok) window.location.reload();
    else setMessage((await response.json()).error || "刪除失敗");
    setBusy(false);
  }

  return (
    <section className="card mt-6 p-6">
      <h2 className="text-xl font-extrabold text-[var(--navy)]">文件上傳</h2>
      <p className="muted mt-2">
        支援 PDF、TXT、Markdown；瀏覽器直接上傳至私有 Supabase bucket，完成後由伺服器驗證內容與建立資料庫紀錄。公開下載必須由管理員明示開啟。
      </p>

      <form onSubmit={upload} className="mt-5 grid items-end gap-3 md:grid-cols-[1fr_1fr_auto]">
        <label className="field">
          <span className="text-sm font-bold text-slate-700">文件角色</span>
          <select className="select" name="document_role">
            {DOCUMENT_ROLES.map((value) => <option key={value}>{value}</option>)}
          </select>
        </label>
        <label className="field">
          <span className="text-sm font-bold text-slate-700">選擇檔案</span>
          <input className="input" name="file" type="file" accept="application/pdf,text/plain,text/markdown,.md,.txt,.pdf" required />
        </label>
        <button className="btn btn-primary" disabled={busy}>{busy ? "處理中…" : "上傳"}</button>
        <label className="flex items-center gap-2 font-bold">
          <input type="checkbox" name="public_download_allowed" value="true" />允許公開下載
        </label>
        {message && <div className="text-sm font-bold md:col-span-3" role="status">{message}</div>}
      </form>

      <div className="mt-6 space-y-3">
        {documents?.length ? documents.map((document) => (
          <div className="flex flex-wrap justify-between gap-3 rounded-xl border border-slate-200 p-4" key={document.id}>
            <div>
              <div className="font-bold">{document.document_role} · {document.file_name}</div>
              <div className="muted text-sm">{document.mime_type} · {document.public_download_allowed ? "公開下載已開啟" : "私有"}</div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="btn btn-secondary" onClick={() => setPermission(document.id, !document.public_download_allowed)} disabled={busy}>
                {document.public_download_allowed ? "關閉公開下載" : "開啟公開下載"}
              </button>
              <button type="button" className="btn btn-danger" onClick={() => remove(document.id)} disabled={busy}>刪除</button>
            </div>
          </div>
        )) : <p className="muted">尚未上傳文件。</p>}
      </div>
    </section>
  );
}

function inferMimeType(file: File) {
  if (file.type) return file.type;
  const lower = file.name.toLowerCase();
  if (lower.endsWith(".pdf")) return "application/pdf";
  if (lower.endsWith(".md") || lower.endsWith(".markdown")) return "text/markdown";
  if (lower.endsWith(".txt")) return "text/plain";
  return "";
}
