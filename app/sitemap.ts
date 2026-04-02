import type { MetadataRoute } from "next";
import { getExercises } from "@/lib/exercises";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://lab.andromed.fr";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPaths = ["", "/playground", "/exercices"];

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((path, i) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: i === 0 ? 1 : 0.85,
  }));

  const exerciseEntries: MetadataRoute.Sitemap = getExercises().map((e) => ({
    url: `${baseUrl}/exercices/${encodeURIComponent(e.id)}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.65,
  }));

  return [...staticEntries, ...exerciseEntries];
}
