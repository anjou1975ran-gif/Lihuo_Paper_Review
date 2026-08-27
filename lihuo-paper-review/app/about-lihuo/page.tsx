import type { Metadata } from "next";
import { LIHUO_ACTIVE_TOPOLOGY, LIHUO_SYSTEM_PROFILE } from "@/lib/lihuo-system";

export const metadata: Metadata = { title: "理火介紹" };

const boundaries = [
  "不宣稱讀取模型隱藏思維",
  "不宣稱修改模型權重",
  "不宣稱控制宿主系統",
  "不宣稱網站已部署完整理火 Runtime",
  "不把理火文件當成工程部署證據",
  "不以『理火』名稱替自己證明正確",
  "不把能力需求冒充 Provider 已存在或已執行",
  "UNKNOWN 不自動等於 CLOSED，也不自動等於 OPEN",
];

export default function Page() {
  return (
    <div className="container-shell py-14 max-w-5xl">
      <div className="kicker">About LIHUO</div>
      <h1 className="mt-3 text-4xl font-black text-[var(--navy)]">理火介紹</h1>
      <div className="card p-7 md:p-10 mt-8 space-y-5 text-lg leading-8 text-slate-700">
        <p>理火是一套面向 AI 生成層的治理與運作體系。</p>
        <p>它不宣稱直接讀取模型不可見的隱藏思維，也不把文件存在冒充 Runtime 已部署。理火透過可觀察輸出、生成結構建模、候選路徑治理、證據資格、授權邊界與責任鏈，建立對 AI 黑箱生成行為的可審計理解。</p>
        <p>現行論文審查規格採 {LIHUO_SYSTEM_PROFILE.paperReview}，對標 Protocol {LIHUO_SYSTEM_PROFILE.protocol}、Lighter {LIHUO_SYSTEM_PROFILE.lighter} 與 Main System {LIHUO_SYSTEM_PROFILE.mainSystem}。DAIL 先描述世界、方向、邊界、責任與能力需求；Lighter 再依 SAC dependency 解析並綁定合法 Provider。</p>
        <p>主系統只提供需要 SAC 才能以原定義成立的能力；可調用不等於擁有，接線也不等於已執行。現行規格的最高接線證據是 {LIHUO_SYSTEM_PROFILE.wiringEvidence}，尚不宣稱 Runtime regression 或 host enforcement。</p>
        <p>網站是論文審查案例的資料、比較與公開呈現層，不是自動審查引擎，也不模擬隱藏推理日誌。</p>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-extrabold text-[var(--navy)]">現行拓撲</h2>
        <div className="card mt-4 p-6 space-y-2 text-sm text-slate-700">
          {LIHUO_ACTIVE_TOPOLOGY.map((item, index) => (
            <div key={item}><span className="mr-2 font-black text-blue-700">{index + 1}.</span>{item}</div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-extrabold text-[var(--navy)]">固定邊界</h2>
        <div className="mt-4 grid md:grid-cols-2 gap-3">
          {boundaries.map((boundary) => <div key={boundary} className="rounded-xl border border-slate-200 bg-white p-4 font-semibold">✓ {boundary}</div>)}
        </div>
      </div>
    </div>
  );
}
