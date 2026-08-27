import type { Metadata } from "next";
import Link from "next/link";
import { LIHUO_SYSTEM_PROFILE } from "@/lib/lihuo-system";

export const metadata: Metadata = { title: "Review System" };

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
      <h1 className="mt-3 text-4xl font-black text-[var(--navy)]">General paper review system</h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-700">
        The system does not prematurely compress a paper into one accept/reject identity. It audits distinct qualification axes and supports PASS, LIMIT, HOLD, PARTIAL, and UNAUDITABLE states.
      </p>

      <div className="card mt-8 p-6 max-w-4xl">
        <div className="text-sm font-black uppercase tracking-wider text-blue-700">Current specification wiring</div>
        <div className="mt-3 grid gap-2 text-sm text-slate-700 md:grid-cols-2">
          <div>Paper Review: <strong>{LIHUO_SYSTEM_PROFILE.paperReview}</strong></div>
          <div>Protocol: <strong>{LIHUO_SYSTEM_PROFILE.protocol}</strong></div>
          <div>Lighter: <strong>{LIHUO_SYSTEM_PROFILE.lighter}</strong></div>
          <div>Main System: <strong>{LIHUO_SYSTEM_PROFILE.mainSystem}</strong></div>
          <div>DAIL: <strong>{LIHUO_SYSTEM_PROFILE.dail}</strong></div>
          <div>Wiring evidence: <strong>{LIHUO_SYSTEM_PROFILE.wiringEvidence}</strong></div>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          These labels describe the review specification and its wiring contract. They do not claim that this website deploys or executes the full LIHUO Runtime; the website remains a case storage and presentation layer.
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
        <Link className="btn btn-primary" href="/en/cases?type=GENERAL_PAPER_REVIEW">Browse general cases</Link>
      </div>
    </div>
  );
}
