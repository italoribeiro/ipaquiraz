"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function BannerSlider({ banners }: { banners: any[] }) {
  const [current, setCurrent] = useState(0);

  // Passar slide automaticamente
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, banners[current]?.tempo_exibicao || 5000);
    return () => clearInterval(timer);
  }, [current, banners]);

  const nextSlide = () => setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrent((prev) => (prev === 0 ? banners.length - 1 : prev - 1));

  // Função para contar clique e redirecionar
  const handleAction = async (banner: any) => {
    // 1. Incrementa o clique no banco (sem travar o usuário)
    supabase.rpc('increment_clique', { row_id: banner.id })
      .then(({ error }) => error && console.error("Erro ao contar clique:", error));

    // 2. Lógica de abertura de link
    if (banner.link_abertura === "modal") {
      alert(banner.texto_aviso_modal || "Você está sendo redirecionado.");
    }

    if (banner.link_destino) {
      if (banner.link_abertura === "_blank") {
        window.open(banner.link_destino, "_blank");
      } else {
        window.location.href = banner.link_destino;
      }
    }
  };

  if (!banners.length) return null;

  return (
    <section className="relative w-full h-[600px] md:h-[700px] lg:h-[850px] overflow-hidden bg-ipa-escuro">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === current ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
          }`}
        >
          {/* Imagem Responsiva (Desktop vs Mobile) */}
          <picture>
            {banner.imagem_mobile_url && (
              <source media="(max-width: 768px)" srcSet={banner.imagem_mobile_url} />
            )}
            <img
              src={banner.imagem_desktop_url}
              alt={banner.seo_alt || banner.titulo}
              className="w-full h-full object-cover"
            />
          </picture>

          {/* Overlay de Opacidade Dinâmico */}
          <div 
            className="absolute inset-0 z-10" 
            style={{ backgroundColor: `rgba(0,0,0, ${banner.overlay_opacidade / 100})` }} 
          />

          {/* Conteúdo do Banner */}
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6">
            <h2 className="text-white text-4xl md:text-7xl font-black uppercase tracking-tighter mb-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
              {banner.titulo}
            </h2>
            {banner.subtitulo && (
              <p className="text-white/90 text-lg md:text-2xl font-medium max-w-3xl mb-10 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                {banner.subtitulo}
              </p>
            )}
            
            {banner.texto_botao && (
              <button
                onClick={() => handleAction(banner)}
                className="bg-ipa-dourado hover:bg-white hover:text-ipa-verde text-white px-10 py-4 rounded-full font-bold text-sm tracking-widest transition-all shadow-2xl transform hover:scale-105 active:scale-95"
              >
                {banner.texto_botao}
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Controles de Navegação (Setas) */}
      {banners.length > 1 && (
        <>
          <button onClick={prevSlide} className="absolute left-6 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/20 text-white hover:bg-ipa-dourado transition-all backdrop-blur-sm">
            <ChevronLeft size={24} />
          </button>
          <button onClick={nextSlide} className="absolute right-6 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/20 text-white hover:bg-ipa-dourado transition-all backdrop-blur-sm">
            <ChevronRight size={24} />
          </button>
          
          {/* Indicadores (Pontinhos) */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-3">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 transition-all rounded-full ${i === current ? "w-10 bg-ipa-dourado" : "w-4 bg-white/40"}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}