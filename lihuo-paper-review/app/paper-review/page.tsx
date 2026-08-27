import type { Metadata } from "next";
import Link from "next/link";
import { LIHUO_SYSTEM_PROFILE } from "@/lib/lihuo-system";

export const metadata: Metadata = { title: "論文審查系統" };

const axes = [
  "Structural Reviewability",
  "Premise Integrity",
  "Claim Authority",
  "Formal Completeness",
  "Empirical Support",
  "Ontology Status",
  "Engineering Testability",
  "Failure Boundary Quality",
  "Review Completion",
];

export default function Page() {
  return (
    <div className="container-shell py-14">
      <div className="kicker">General Review Architecture</div>
      <h1 className="mt-3 text-4xl font-black text-[var(--navy)]">通用論文審查系統</h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-700">
        系統不把整篇論文過早壓成單一接受或拒絕，而是分別檢查不同資格軸，標記 PASS、LIMIT、HOLD、PARTIAL、UNAUDITABLE 等狀態。
      </p>

      <div className="card mt-8 p-6 max-w-4xl">
        <div className="text-sm font-black uppercase tracking-wider text-blue-700">Current specification wiring</div>
        <div className="mt-3 grid gap-2 text-sm text-slate-700 md:grid-cols-2">
          <div>Paper Review：<strong>{LIHUO_SYSTEM_PROFILE.paperReview}</strong></div>
          <div>Protocol：<strong>{LIHUO_SYSTEM_PROFILE.protocol}</strong></div>
          <div>Lighter：<strong>{LIHUO_SYSTEM_PROFILE.lighter}</strong></div>
          <div>Main System：<strong>{LIHUO_SYSTEM_PROFILE.mainSystem}</strong></div>
          <div>DAIL：<strong>{LIHUO_SYSTEM_PROFILE.dail}</strong></div>
          <div>Wiring evidence：<strong>{LIHUO_SYSTEM_PROFILE.wiringEvidence}</strong></div>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          這裡顯示的是審查規格與接線版本，不代表網站本身部署或執行完整 LIHUO Runtime。網站仍只保存與展示審查案例資料。
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {axes.map((axis, index) => (
          <div className="card p-5" key={axis}>
            <div className="font-black text-blue-700">{String(index + 1).padStart(2, "0")}</div>
            <div className="mt-2 font-extrabold text-[var(--navy)]">{axis}</div>
          </div>
        ))}
      </div>
      <div className="mt-10">
        <Link className="btn btn-primary" href="/cases?type=GENERAL_PAPER_REVIEW">瀏覽一般論文案例</Link>
      </div>
    </div>
  );
}
