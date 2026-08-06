import Link from "next/link";

export function EmptyState({ admin = false }: { admin?: boolean }) {
  return (
    <div className="card p-10 text-center">
      <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-blue-50 text-blue-700 text-xl" aria-hidden>⌁</div>
      <h2 className="text-xl font-extrabold text-[var(--navy)]">案例資料尚在整理中。</h2>
      <p className="muted mt-2">資料庫目前沒有可顯示的案例，網站不會自動生成虛構內容。</p>
      {admin && <Link className="btn btn-primary mt-5" href="/admin/cases/new">建立第一個案例</Link>}
    </div>
  );
}
