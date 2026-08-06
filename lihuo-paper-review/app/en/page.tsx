import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Home" };
const checks = ["Are the premises valid?", "Does the method authorize the conclusion?", "Does the evidence match the claim?", "What is directly observed?", "What is inferred?", "Which claims must be downgraded?", "Which gaps require HOLD?", "What allows re-review?"];

export default function Page() {
  return <>
    <section className="bg-white border-b border-slate-200">
      <div className="container-shell py-20 md:py-28 grid lg:grid-cols-[1.2fr_.8fr] gap-12 items-center">
        <div><div className="kicker">Evidence Admissibility Platform</div><h1 className="mt-4 text-4xl md:text-6xl font-black tracking-tight text-[var(--navy)]">LIHUO Paper Review System</h1><p className="mt-4 text-2xl font-bold text-blue-700">From Paper Review to Evidence Admissibility</p><p className="mt-7 max-w-3xl text-lg leading-8 text-slate-700">Ordinary AI often compresses a paper into a summary, strengths, weaknesses, and one conclusion. LIHUO additionally audits whether premises, methods, evidence, claims, and responsibility boundaries are aligned.</p><div className="mt-8 flex flex-wrap gap-3"><Link href="/en/cases" className="btn btn-primary">Browse cases</Link><Link href="/en/paper-review" className="btn btn-secondary">Review architecture</Link><Link href="/en/medical-review" className="btn btn-secondary">Medical review</Link></div></div>
        <div className="card p-6 md:p-8"><div className="kicker">What LIHUO audits</div><div className="mt-5 grid sm:grid-cols-2 gap-3">{checks.map((item,i)=><div key={item} className="rounded-xl border border-blue-100 bg-blue-50 p-4 font-semibold"><span className="text-blue-700 mr-2" aria-hidden>{String(i+1).padStart(2,'0')}</span>{item}</div>)}</div></div>
      </div>
    </section>
    <section className="container-shell py-16 grid md:grid-cols-2 gap-6"><article className="card p-8"><div className="kicker">General Paper Review</div><h2 className="mt-2 text-2xl font-extrabold text-[var(--navy)]">General review system</h2><p className="mt-4 leading-7 text-slate-700">Audits structural reviewability, premise integrity, claim authority, formal completeness, empirical support, engineering testability, and failure boundaries.</p><Link href="/en/paper-review" className="btn btn-primary mt-6">View architecture</Link></article><article className="card p-8"><div className="kicker">Medical Paper Review</div><h2 className="mt-2 text-2xl font-extrabold text-[var(--navy)]">Medical review profile</h2><p className="mt-4 leading-7 text-slate-700">Adds medical evidence admissibility, clinical-use readiness, patient safety, external validation, calibration, and regulatory boundaries.</p><Link href="/en/medical-review" className="btn btn-primary mt-6">View MedReview</Link></article></section>
  </>;
}
