"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function BannerSlider({ banners }: { banners: any[] }) {
  const [current, setCurrent] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  }, [banners.length]);

  const prevSlide = () => setCurrent((prev) => (prev === 0 ? banners.length - 1 : prev - 1));

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, banners[current]?.tempo_exibicao || 5000);
    return () => clearInterval(timer);
  }, [current, banners, nextSlide]);

  const handleAction = async (banner: any) => {
    // 1. Registro de métricas (RPC no Supabase)
    // Refatorado para evitar o erro de TypeScript com .catch()
    const { error } = await supabase.rpc('increment_clique', { row_id: banner.id });
    
    if (error) {
      console.error("Erro SEO Tracking:", error.message);
    }

    // 2. Comportamento do link
    if (banner.link_abertura === "modal" && banner.texto_aviso_modal) {
      alert(banner.texto_aviso_modal);
    }

    if (banner.link_destino) {
      if (banner.link_abertura === "_blank") {
        window.open(banner.link_destino, "_blank", "noopener,noreferrer");
      } else {
        window.location.href = banner.link_destino;
      }
    }
  };

  if (!banners.length) return null;

  return (
    <section 
      className="relative w-full h-[600px] md:h-[700px] lg:h-[850px] overflow-hidden bg-ipa-escuro"
      aria-roledescription="carousel"
      aria-label="Destaques da Igreja"
    >
      {banners.map((banner, index) => {
        const isCurrent = index === current;
        // Prioridade para a primeira imagem (LCP)
        const isPriority = index === 0;

        return (
          <div
            key={banner.id}
            aria-hidden={!isCurrent}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              isCurrent ? "opacity-100 scale-100 z-10" : "opacity-0 scale-105 pointer-events-none z-0"
            }`}
          >
            {/* Otimização de Imagens Responsivas */}
            <picture>
              {banner.imagem_mobile_url && (
                <source media="(max-width: 768px)" srcSet={banner.imagem_mobile_url} />
              )}
              <img
                src={banner.imagem_desktop_url}
                alt={banner.seo_alt || banner.titulo}
                loading={isPriority ? "eager" : "lazy"}
                // fetchPriority é uma feature moderna do Chrome para SEO/LCP
                {...({ fetchpriority: isPriority ? "high" : "low" } as any)}
                decoding="async"
                className="w-full h-full object-cover"
              />
            </picture>

            {/* Máscara de Opacidade */}
            <div 
              className="absolute inset-0 z-10" 
              style={{ backgroundColor: `rgba(0,0,0, ${banner.overlay_opacidade / 100})` }} 
            />

            {/* Conteúdo flutuante */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6">
              {/* Hierarquia Semântica: H1 apenas no primeiro banner */}
              {index === 0 ? (
                <h1 className="text-white text-4xl md:text-7xl font-black uppercase tracking-tighter mb-4 drop-shadow-lg">
                  {banner.titulo}
                </h1>
              ) : (
                <h2 className="text-white text-4xl md:text-7xl font-black uppercase tracking-tighter mb-4 drop-shadow-lg">
                  {banner.titulo}
                </h2>
              )}

              {banner.subtitulo && (
                <p className="text-white/90 text-lg md:text-2xl font-medium max-w-3xl mb-10 drop-shadow-md">
                  {banner.subtitulo}
                </p>
              )}
              
              {banner.texto_botao && (
                <button
                  onClick={() => handleAction(banner)}
                  className="bg-ipa-dourado hover:bg-white hover:text-ipa-verde text-white px-10 py-4 rounded-full font-bold text-sm tracking-widest transition-all shadow-2xl transform hover:scale-105 active:scale-95"
                  aria-label={`${banner.texto_botao} sobre ${banner.titulo}`}
                >
                  {banner.texto_botao}
                </button>
              )}
            </div>
          </div>
        );
      })}

      {/* Controles do Carrossel */}
      {banners.length > 1 && (
        <>
          <button 
            onClick={prevSlide} 
            aria-label="Slide anterior"
            className="absolute left-6 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/20 text-white hover:bg-ipa-dourado transition-all backdrop-blur-sm"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={nextSlide} 
            aria-label="Próximo slide"
            className="absolute right-6 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/20 text-white hover:bg-ipa-dourado transition-all backdrop-blur-sm"
          >
            <ChevronRight size={24} />
          </button>
          
          {/* Pontos de Navegação */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-3" role="tablist">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                role="tab"
                aria-selected={i === current}
                aria-label={`Ir para slide ${i + 1}`}
                className={`h-1.5 transition-all rounded-full ${i === current ? "w-10 bg-ipa-dourado" : "w-4 bg-white/40"}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}