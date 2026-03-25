// src/components/ui/StoryGenerator.tsx
"use client";

import { useRef, useState, useEffect } from "react";
import { toJpeg } from "html-to-image";
import { Instagram, Download, Loader2 } from "lucide-react";

interface StoryGeneratorProps {
  frase: string;
  passagem: string;
}

export default function StoryGenerator({ frase, passagem }: StoryGeneratorProps) {
  const storyRef = useRef<HTMLDivElement>(null);
  const [gerando, setGerando] = useState(false);
  const [urlSite, setUrlSite] = useState("");

  useEffect(function() {
    setUrlSite(window.location.origin);
  }, []);

  if (!frase) return null;

  async function baixarStory() {
    if (!storyRef.current) return;
    try {
      setGerando(true);
      
      // Pequeno atraso para garantir que a fonte Inter foi renderizada na div invisível
      await new Promise(resolve => setTimeout(resolve, 500));

      const dataUrl = await toJpeg(storyRef.current, { 
        quality: 0.95,
        pixelRatio: 1,
        // MUDANÇA AQUI: Tiramos o skipFonts (que bloqueava a Inter) 
        // e deixamos o cacheBust para evitar erros de segurança.
        cacheBust: true,
        useCORS: true,
        // Forçamos a biblioteca a esperar um pouco mais pelas fontes
        fontEmbedCSS: `@import url('https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,700;1,300;1,700&display=swap');`
      });
      
      const link = document.createElement("a");
      link.download = `story-ipaquiraz-${new Date().getTime()}.jpg`;
      link.href = dataUrl;
      link.click();
      
    } catch (err: any) {
      console.error("Erro ao gerar a imagem:", err);
      // Se o erro "trim" voltar por causa do Turbopack, o usuário será avisado, 
      // mas essa configuração com fontEmbedCSS costuma blindar o componente.
      alert("Houve um problema ao processar as fontes. Tente clicar novamente.");
    } finally {
      setGerando(false);
    }
  }

  return (
    <div className="my-12 p-8 bg-ipa-creme rounded-3xl border border-ipa-bege/30 flex flex-col items-center text-center relative overflow-hidden">
      
      {/* Link da fonte para o navegador carregar ela ANTES de clicarmos no botão */}
      <link href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,700;1,300;1,700&display=swap" rel="stylesheet" />

      <div className="w-16 h-16 bg-ipa-verde text-white rounded-full flex items-center justify-center mb-4 shadow-lg">
        <Instagram size={28} />
      </div>
      <h3 className="text-xl font-black text-ipa-verde uppercase tracking-widest mb-2 font-sans">Compartilhe no Instagram</h3>
      <p className="text-ipa-escuro/70 font-medium mb-8 max-w-md mx-auto text-sm">
        Baixe o destaque desta mensagem formatado perfeitamente para você postar nos seus Stories com a fonte Inter.
      </p>

      <button 
        onClick={baixarStory}
        disabled={gerando || !urlSite}
        className="bg-ipa-dourado hover:bg-yellow-600 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-sm flex items-center gap-3 transition-colors shadow-xl disabled:opacity-70 cursor-pointer z-10"
      >
        {gerando ? <><Loader2 size={18} className="animate-spin" /> Processando...</> : <><Download size={18} /> Baixar para Stories</>}
      </button>

      {/* ÁREA DE CAPTURA (FANTASMA) */}
      <div className="absolute pointer-events-none" style={{ top: '-20000px', left: '-20000px' }}>
        <div 
          ref={storyRef}
          className="relative flex flex-col items-center justify-center text-center bg-white"
          style={{ 
            width: '1080px', 
            height: '1920px', 
            // Usamos a Inter como principal aqui
            fontFamily: "'Inter', sans-serif",
            backgroundImage: urlSite ? `url(${urlSite}/template/template_social1.png)` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="relative z-10 px-24 flex flex-col items-center justify-center h-full">
            <div className="flex flex-col items-center">
              
              {/* Frase: Inter Bold Italic (700 + italic) */}
              <h1 
                style={{ 
                    color: '#4a533b',
                    fontSize: '65px', 
                    lineHeight: '1.4', 
                    fontWeight: 700,
                    fontStyle: 'italic',
                    fontFamily: "'Inter', sans-serif",
                    marginBottom: '35px'
                }}
              >
                "{frase}"
              </h1>

              {/* Versículo: Inter Light Italic (300 + italic) */}
              {passagem && (
                <p 
                  style={{ 
                      color: '#4a533b',
                      fontSize: '38px', 
                      lineHeight: '1.2', 
                      fontWeight: 300,
                      fontStyle: 'italic',
                      fontFamily: "'Inter', sans-serif"
                  }}
                >
                  — {passagem} — 
                </p>
              )}
            </div>
          </div>

          {/* Rodapé: Inter Bold (700) */}
          <div className="absolute bottom-40 w-full flex justify-center z-10">
            <div 
                 style={{ 
                     backgroundColor: '#6b6b54',
                     color: 'white',
                     letterSpacing: '0.2em',
                     borderRadius: '1rem',
                     fontSize: '36px', 
                     padding: '24px 60px',
                     fontWeight: 700,
                     fontStyle: 'normal',
                     fontFamily: "'Inter', sans-serif"
                 }}
            >
              IPAQUIRAZ.COM.BR
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}