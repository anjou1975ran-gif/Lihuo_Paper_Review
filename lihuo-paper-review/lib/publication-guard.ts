import type { CaseFormPayload, DocumentRole } from "@/lib/types";

export type PublicationAssessment = {
  confirmationsMissing: string[];
  contentMissing: string[];
};

export function assessPublication(payload: CaseFormPayload, documentRoles: DocumentRole[] = []): PublicationAssessment {
  const hasDocument = (role: DocumentRole) => documentRoles.includes(role);
  const paperSourceExists = Boolean(payload.paper_source.pasted_text?.trim() || payload.case.source_note?.trim() || hasDocument("PAPER_SOURCE"));
  const ordinaryExists = Boolean(payload.ordinary_review.full_text?.trim() || payload.ordinary_review.short_summary?.trim() || hasDocument("ORDINARY_AI_REVIEW"));
  const lihuoExists = Boolean(payload.lihuo_review.full_text?.trim() || payload.lihuo_review.short_summary?.trim() || hasDocument("LIHUO_REVIEW"));
  const importantStatesComplete = Object.values(payload.general_review_states).every((axis) => axis.status !== "NOT_ASSESSED");

  const confirmationsMissing = [
    !payload.case.permissions_confirmed && "下載與公開權限確認",
    !payload.case.privacy_checked && "個人資料公開風險確認",
  ].filter(Boolean) as string[];

  const contentMissing = [
    !paperSourceExists && "論文來源",
    !ordinaryExists && "普通 AI 審查",
    !lihuoExists && "理火審查",
    !payload.case.summary?.trim() && "案例摘要",
    !payload.case.citation?.trim() && "正式引用",
    !importantStatesComplete && "重要多軸狀態",
  ].filter(Boolean) as string[];

  return { confirmationsMissing, contentMissing };
}
