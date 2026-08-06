import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: "LIHUO Paper Review System", template: "%s | LIHUO Paper Review System" },
  description: "從論文審查，到證據資格審查。",
  openGraph: { title: "LIHUO Paper Review System", description: "From Paper Review to Evidence Admissibility", type: "website" },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const requestHeaders = await headers();
  const locale = requestHeaders.get("x-lihuo-locale") === "en" ? "en" : "zh-Hant";
  return (
    <html lang={locale}>
      <body>
        <a className="skip-link" href="#main-content">跳至主要內容</a>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
