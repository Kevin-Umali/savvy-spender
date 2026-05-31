import { MetadataRoute } from "next";
import { SITE_URL } from "@/app/_lib/seo";
import { SECONDARY_LINKS, TOOLS, type LiveTool } from "@/app/_lib/tools";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const livePaths = TOOLS.filter((t): t is LiveTool => t.status === "live").map((t) => t.href);
  const paths = ["/", ...livePaths, ...SECONDARY_LINKS.map((l) => l.href)];

  return paths.map((path) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.8,
  }));
}
