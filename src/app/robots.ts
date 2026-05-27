import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/owner", "/dashboard", "/api/", "/settings"],
      },
    ],
    sitemap: "https://staynest.in/sitemap.xml",
  };
}
