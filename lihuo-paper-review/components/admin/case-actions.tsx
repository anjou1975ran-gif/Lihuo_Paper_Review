"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function CaseActions({ caseId, publicationStatus }: { caseId: string; publicationStatus: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function duplicate() {
    setBusy(true);
    const response = await fetch(`/api/admin/cases/${caseId}/duplicate`, { method: "POST" });
    const body = await response.json();
    setBusy(false);
    if (!response.ok) return alert(body.error || "複製失敗");
    router.push(`/admin/cases/${body.id}/edit`);
  }

  async function remove() {
    if (publicationStatus === "PUBLISHED") {
      alert("已發布案例必須先撤回或封存，才能刪除。");
      return;
    }
    if (!confirm("確定刪除此案例？此操作不可復原。")) return;
    setBusy(true);
    const response = await fetch(`/api/admin/cases/${caseId}`, { method: "DELETE" });
    const body = await response.json();
    setBusy(false);
    if (!response.ok) return alert(body.error || "刪除失敗");
    router.push("/admin/cases");
    router.refresh();
  }

  return (
    <div className="card p-4 mb-6 flex flex-wrap gap-3 items-center">
      <Link className="btn btn-secondary" href={`/admin/cases/${caseId}/preview`}>預覽案例</Link>
      <button type="button" className="btn btn-secondary" onClick={duplicate} disabled={busy}>複製案例</button>
      <button type="button" className="btn btn-danger" onClick={remove} disabled={busy}>刪除案例</button>
      <span className="muted text-sm">發布／撤回／封存請在案例表單的「發布狀態」變更後儲存。複製不會複製儲存檔案，且會重設公開確認。</span>
    </div>
  );
}
