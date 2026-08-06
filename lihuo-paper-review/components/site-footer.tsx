"use client";

import { usePathname } from "next/navigation";

export function SiteFooter() {
  const pathname = usePathname();
  const english = pathname.startsWith("/en");
  const medical = pathname.includes("medical-review");

  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="container-shell py-10 text-sm leading-7 text-slate-600">
        {english ? (
          <>
            <p>LIHUO Paper Review System audits paper structure, evidence admissibility, and claim boundaries. Its outputs do not replace journal editors, peer reviewers, academic institutions, clinicians, statisticians, regulators, or other qualified professionals.</p>
            {medical && <p className="mt-3">LIHUO MedReview does not diagnose patients, recommend treatment, approve medical devices, or convert a single paper directly into clinical guidance.</p>}
          </>
        ) : (
          <>
            <p>LIHUO Paper Review System 是論文結構、證據資格與主張邊界審查系統。網站呈現的案例不取代期刊編輯、同行審查、學術機構、醫師、統計專家、主管機關或其他具資格專業人士的正式判斷。</p>
            {medical && <p className="mt-3">LIHUO MedReview 不提供病人診斷、不建議治療、不核准醫療器材，也不將單篇論文直接轉換為臨床指引。</p>}
            <p className="mt-3">LIHUO Paper Review System audits paper structure, evidence admissibility, and claim boundaries. Its outputs do not replace journal editors, peer reviewers, academic institutions, clinicians, statisticians, regulators, or other qualified professionals.</p>
          </>
        )}
      </div>
    </footer>
  );
}
