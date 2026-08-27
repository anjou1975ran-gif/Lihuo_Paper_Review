import type { Metadata } from "next";
import { LIHUO_ACTIVE_TOPOLOGY, LIHUO_SYSTEM_PROFILE } from "@/lib/lihuo-system";

export const metadata: Metadata = { title: "About LIHUO" };

const boundaries = [
  "No claim of reading hidden model thoughts",
  "No claim of modifying model weights",
  "No claim of controlling the host system",
  "No claim that this website deploys the full LIHUO Runtime",
  "Documents are not treated as deployment evidence",
  "The LIHUO name is not self-validating proof",
  "Capability requirements are not treated as proof that a provider exists or executed",
  "UNKNOWN is neither automatically CLOSED nor automatically OPEN",
];

export default function Page() {
  return (
    <div className="container-shell py-14 max-w-5xl">
      <div className="kicker">About LIHUO</div>
      <h1 className="mt-3 text-4xl font-black text-[var(--navy)]">A governance system for AI generation</h1>
      <div className="card p-7 md:p-10 mt-8 space-y-5 text-lg leading-8 text-slate-700">
        <p>LIHUO is a governance and operating system aimed at the AI generation layer.</p>
        <p>It does not claim direct access to invisible hidden reasoning, and it does not treat the existence of documents as proof that a Runtime has been deployed. LIHUO builds an auditable understanding of black-box generation through observable outputs, structural modeling, candidate-path governance, evidence qualification, authorization boundaries, and responsibility chains.</p>
        <p>The current paper-review specification is {LIHUO_SYSTEM_PROFILE.paperReview}, aligned to Protocol {LIHUO_SYSTEM_PROFILE.protocol}, Lighter {LIHUO_SYSTEM_PROFILE.lighter}, and Main System {LIHUO_SYSTEM_PROFILE.mainSystem}. DAIL states world, direction, boundaries, responsibilities, and semantic capability requirements first; Lighter then resolves providers according to SAC dependency.</p>
        <p>Main System supplies only capabilities that require SAC to exist under their native definition. Callable is not owned, and bound is not executed. The highest current wiring claim is {LIHUO_SYSTEM_PROFILE.wiringEvidence}; Runtime regression and host enforcement are not claimed.</p>
        <p>This website remains a data, comparison, and public presentation layer for review cases. It is not an automatic review engine and does not simulate hidden reasoning logs.</p>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-extrabold text-[var(--navy)]">Current topology</h2>
        <div className="card mt-4 p-6 space-y-2 text-sm text-slate-700">
          {LIHUO_ACTIVE_TOPOLOGY.map((item, index) => (
            <div key={item}><span className="mr-2 font-black text-blue-700">{index + 1}.</span>{item}</div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-extrabold text-[var(--navy)]">Fixed boundaries</h2>
        <div className="mt-4 grid md:grid-cols-2 gap-3">
          {boundaries.map((item) => <div key={item} className="rounded-xl border border-slate-200 bg-white p-4 font-semibold">✓ {item}</div>)}
        </div>
      </div>
    </div>
  );
}
