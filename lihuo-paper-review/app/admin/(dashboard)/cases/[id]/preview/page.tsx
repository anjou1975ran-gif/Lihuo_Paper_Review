import Link from "next/link";
import { notFound } from "next/navigation";
import { CaseTabs } from "@/components/case-tabs";
import { StatusBadge } from "@/components/status-badge";
import { createClient } from "@/lib/supabase/server";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cases")
    .select("*,review_outputs(*),general_review_states(*),medical_review_states(*),comparison_summaries(*),case_documents(*)")
    .eq("id", id)
    .single();
  if (error || !data) notFound();

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="kicker">Admin Preview</div>
          <h1 className="mt-2 text-3xl font-black text-[var(--navy)]">{data.title}</h1>
          <div className="mt-3"><StatusBadge value={data.publication_status} /></div>
        </div>
        <Link className="btn btn-secondary" href={`/admin/cases/${id}/edit`}>返回編輯</Link>
      </div>
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900 mb-6">
        這是管理員預覽。草稿與撤回案例仍不會出現在公開案例資料庫。
      </div>
      <CaseTabs data={data} />
    </div>
  );
}
