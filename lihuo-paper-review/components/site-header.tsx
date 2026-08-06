"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const zhLinks = [
  ["/", "首頁"],
  ["/paper-review", "論文審查系統"],
  ["/medical-review", "醫學論文審查"],
  ["/cases", "案例資料庫"],
  ["/about-lihuo", "理火介紹"],
] as const;

const enLinks = [
  ["/en", "Home"],
  ["/en/paper-review", "Review System"],
  ["/en/medical-review", "MedReview"],
  ["/en/cases", "Case Database"],
  ["/en/about-lihuo", "About LIHUO"],
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const english = pathname.startsWith("/en");
  const links = english ? enLinks : zhLinks;
  const alternate = pathname.startsWith("/admin")
    ? english ? "/" : "/en"
    : english ? pathname.replace(/^\/en/, "") || "/"
    : `/en${pathname === "/" ? "" : pathname}`;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="container-shell flex min-h-16 items-center justify-between gap-3">
        <Link href={english ? "/en" : "/"} className="font-extrabold leading-tight text-[var(--navy)]">
          LIHUO Paper Review System
          <span className="block text-xs font-semibold text-slate-500">理火論文審查系統</span>
        </Link>

        <nav aria-label={english ? "Main navigation" : "主要導覽"} className="hidden items-center gap-1 xl:flex">
          {links.map(([href, label]) => (
            <Link key={href} href={href} className="rounded-lg px-3 py-2 text-sm font-semibold hover:bg-slate-100">
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href={alternate} className="btn btn-secondary text-sm" aria-label={english ? "切換至繁體中文" : "Switch to English"}>
            {english ? "繁中" : "EN"}
          </Link>
          <Link href="/admin/login" className="btn btn-secondary hidden text-sm sm:inline-flex">
            {english ? "Admin" : "管理員登入"}
          </Link>
          <details className="relative xl:hidden">
            <summary className="btn btn-secondary list-none text-sm" aria-label={english ? "Open navigation" : "開啟導覽"}>
              {english ? "Menu" : "選單"}
            </summary>
            <nav
              aria-label={english ? "Mobile navigation" : "行動版導覽"}
              className="absolute right-0 mt-2 grid min-w-56 gap-1 rounded-xl border border-slate-200 bg-white p-2 shadow-xl"
            >
              {links.map(([href, label]) => (
                <Link key={href} href={href} className="rounded-lg px-3 py-2 text-sm font-semibold hover:bg-slate-100">
                  {label}
                </Link>
              ))}
              <Link href="/admin/login" className="rounded-lg px-3 py-2 text-sm font-semibold hover:bg-slate-100 sm:hidden">
                {english ? "Admin login" : "管理員登入"}
              </Link>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
