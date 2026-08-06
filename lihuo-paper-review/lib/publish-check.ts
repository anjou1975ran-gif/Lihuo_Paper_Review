export type PublishCheck = { key: string; label: string; ok: boolean; severity: "required" | "warning" };

export function buildPublishChecks(payload: {
  summary?: string | null;
  citation?: string | null;
  paperSourceExists: boolean;
  ordinaryReviewExists: boolean;
  lihuoReviewExists: boolean;
  importantStatesComplete: boolean;
  permissionConfirmed: boolean;
  privacyConfirmed: boolean;
}): PublishCheck[] {
  return [
    { key: "paper", label: "論文來源存在", ok: payload.paperSourceExists, severity: "required" },
    { key: "ordinary", label: "普通 AI 審查存在", ok: payload.ordinaryReviewExists, severity: "required" },
    { key: "lihuo", label: "理火審查存在", ok: payload.lihuoReviewExists, severity: "required" },
    { key: "summary", label: "案例摘要存在", ok: Boolean(payload.summary?.trim()), severity: "required" },
    { key: "citation", label: "引用資料存在", ok: Boolean(payload.citation?.trim()), severity: "warning" },
    { key: "permission", label: "下載權限已確認", ok: payload.permissionConfirmed, severity: "warning" },
    { key: "states", label: "重要狀態已填寫", ok: payload.importantStatesComplete, severity: "warning" },
    { key: "privacy", label: "個資公開風險已確認", ok: payload.privacyConfirmed, severity: "warning" },
  ];
}
