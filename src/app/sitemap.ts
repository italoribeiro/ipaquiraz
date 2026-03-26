// src/app/sitemap.ts
import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

// Conecta com o Supabase para buscar os sermões
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://ipaquiraz.com.br";

  // 1. PÁGINAS ESTÁTICAS (Fixas do site)
  const rotasEstaticas = [
    "",
    "/quem-somos",
    "/programacao",
    "/ensino",
    "/ensino/biblioteca",
    "/sermoes",
    "/dizimos",
    "/visita",
  ].map((rota) => ({
    url: `${baseUrl}${rota}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: rota === "" ? 1.0 : 0.8,
  }));

  // 2. PÁGINAS DINÂMICAS (Buscando sermões do banco de dados)
  const { data: sermoes } = await supabase
    .from("site_sermoes_mensagens") // <--- Tabela corrigida!
    .select("slug, created_at")
    .order("created_at", { ascending: false });

  // Cria as URLs para cada sermão dinâmico
  const rotasSermoes = (sermoes || []).map((sermao) => ({
    url: `${baseUrl}/sermoes/${sermao.slug}`, // <--- Verifique se o caminho é esse mesmo
    lastModified: new Date(sermao.created_at),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // 3. JUNTA TUDO E ENTREGA PRO GOOGLE
  return [...rotasEstaticas, ...rotasSermoes];
}