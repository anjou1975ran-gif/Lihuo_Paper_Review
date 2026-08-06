import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "論文審查系統" };
const axes = ["Structural Reviewability", "Premise Integrity", "Claim Authority", "Formal Completeness", "Empirical Support", "Ontology Status", "Engineering Testability", "Failure Boundary Quality", "Review Completion"];
export default function Page(){ return <div className="container-shell py-14"><div className="kicker">General Review Architecture</div><h1 className="mt-3 text-4xl font-black text-[var(--navy)]">通用論文審查系統</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-slate-700">系統不把整篇論文過早壓成單一接受或拒絕，而是分別檢查不同資格軸，標記 PASS、LIMIT、HOLD、PARTIAL、UNAUDITABLE 等狀態。</p><div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{axes.map((a,i)=><div className="card p-5" key={a}><div className="text-blue-700 font-black">{String(i+1).padStart(2,'0')}</div><div className="mt-2 font-extrabold text-[var(--navy)]">{a}</div></div>)}</div><div className="mt-10"><Link className="btn btn-primary" href="/cases?type=GENERAL_PAPER_REVIEW">瀏覽一般論文案例</Link></div></div> }
