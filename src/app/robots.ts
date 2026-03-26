import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/"], // Proíbe o Google de ler seu painel e rotas internas
    },
    sitemap: "https://ipaquiraz.com.br/sitemap.xml",
  };
}