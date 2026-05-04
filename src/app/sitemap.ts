import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { loadDirectoryData } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const { companies, shortcutGroups } = loadDirectoryData();
  const lastModified = new Date();

  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "daily",
      priority: 1,
    },
    ...companies.map((company) => ({
      url: `${SITE_URL}/companies/${company.slug}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...shortcutGroups.map((group) => ({
      url: `${SITE_URL}/shortcuts/${group.id}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
