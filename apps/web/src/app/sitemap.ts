import type { MetadataRoute } from "next";

import { URLS } from "@/lib/urls";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: URLS.SITE,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${URLS.SITE}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${URLS.SITE}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${URLS.SITE}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];
}
