import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const paths = [
    "",
    "/paper-review",
    "/medical-review",
    "/cases",
    "/about-lihuo",
    "/en",
    "/en/paper-review",
    "/en/medical-review",
    "/en/cases",
    "/en/about-lihuo",
  ];
  return paths.map((path) => ({ url: `${baseUrl}${path}`, changeFrequency: "weekly" as const, priority: path === "" ? 1 : 0.7 }));
}
