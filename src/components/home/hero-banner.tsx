import { createClient } from "@supabase/supabase-js";
import BannerSlider from "./BannerSlider";

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function HeroBanner() {
  const agora = new Date().toISOString();

  // Busca banners ativos e dentro da validade
  const { data: banners } = await supabase
    .from("site_banners")
    .select("*")
    .eq("ativo", true)
    .or(`data_inicio.is.null,data_inicio.lte.${agora}`)
    .or(`data_fim.is.null,data_fim.gte.${agora}`)
    .order("ordem", { ascending: true });

  if (!banners || banners.length === 0) {
    return (
      <section className="w-full h-[600px] bg-ipa-verde flex items-center justify-center text-white">
        <p className="font-bold tracking-widest uppercase opacity-50">Igreja Presbiteriana de Aquiraz</p>
      </section>
    );
  }

  return <BannerSlider banners={banners} />;
}