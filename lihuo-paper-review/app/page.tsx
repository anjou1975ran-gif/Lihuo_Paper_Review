import Link from "next/link";

const checks = ["前提是否成立", "方法是否授權結論", "證據是否對準主張", "哪些內容是觀察", "哪些內容只是推論", "哪些主張必須降級", "哪些缺口必須 HOLD", "何時能重新審查"];

export default function HomePage() {
  return <>
    <section className="bg-white border-b border-slate-200">
      <div className="container-shell py-20 md:py-28 grid lg:grid-cols-[1.2fr_.8fr] gap-12 items-center">
        <div>
          <div className="kicker">Evidence Admissibility Platform</div>
          <h1 className="mt-4 text-4xl md:text-6xl font-black tracking-tight text-[var(--navy)]">LIHUO Paper Review System</h1>
          <p className="mt-4 text-2xl font-bold text-blue-700">From Paper Review to Evidence Admissibility</p>
          <p className="mt-2 text-xl text-slate-600">從論文審查，到證據資格審查</p>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-700">一般 AI 容易把論文整理成摘要、優缺點與單一結論。理火論文審查系統進一步檢查，前提、方法、證據、主張與責任邊界是否真正對準。</p>
          <div className="mt-8 flex flex-wrap gap-3"><Link href="/cases" className="btn btn-primary">瀏覽案例</Link><Link href="/paper-review" className="btn btn-secondary">查看審查架構</Link><Link href="/medical-review" className="btn btn-secondary">進入醫學論文審查</Link></div>
        </div>
        <div className="card p-6 md:p-8"><div className="kicker">What LIHUO audits</div><div className="mt-5 grid sm:grid-cols-2 gap-3">{checks.map((item,i)=><div key={item} className="rounded-xl border border-blue-100 bg-blue-50 p-4 font-semibold"><span className="text-blue-700 mr-2" aria-hidden>{String(i+1).padStart(2,'0')}</span>{item}</div>)}</div></div>
      </div>
    </section>
    <section className="container-shell py-16 grid md:grid-cols-2 gap-6">
      <article className="card p-8"><div className="kicker">General Paper Review</div><h2 className="mt-2 text-2xl font-extrabold text-[var(--navy)]">通用論文審查系統</h2><p className="mt-4 leading-7 text-slate-700">檢查結構可審查性、前提完整性、主張權限、形式完成度、實證支持、工程可測性與失效邊界。</p><Link href="/paper-review" className="btn btn-primary mt-6">查看系統架構</Link></article>
      <article className="card p-8"><div className="kicker">Medical Paper Review</div><h2 className="mt-2 text-2xl font-extrabold text-[var(--navy)]">醫學論文審查強化版</h2><p className="mt-4 leading-7 text-slate-700">在通用審查上增加醫療證據准入、臨床使用就緒度、病人安全、外部驗證、校準與法規邊界。</p><Link href="/medical-review" className="btn btn-primary mt-6">查看醫學分支</Link></article>
    </section>
  </>;
}
