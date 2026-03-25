// src/components/ui/ShareSermon.tsx
"use client";

import { useState, useEffect } from "react";
import { Link as LinkIcon, Check, Share2 } from "lucide-react";

// Define que o componente precisa receber o título do sermão
interface ShareProps {
  titulo: string;
}

export default function ShareSermon(props: ShareProps) {
  const [urlAtual, setUrlAtual] = useState("");
  const [copiado, setCopiado] = useState(false);

  // Assim que o componente aparece na tela, ele captura a URL do navegador
  useEffect(function() {
    setUrlAtual(window.location.href);
  }, []);

  // Função normal para copiar o link para a área de transferência
  async function copiarLink() {
    try {
      await navigator.clipboard.writeText(urlAtual);
      setCopiado(true);
      // Volta o ícone ao normal depois de 2 segundos
      setTimeout(function() {
        setCopiado(false);
      }, 2000); 
    } catch (err) {
      console.error("Falha ao copiar o link: ", err);
    }
  }

  // Função normal para abrir o menu de compartilhamento nativo do celular (WhatsApp, Instagram, etc)
  async function compartilharNativo() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: props.titulo,
          text: `Fui muito edificado por esta mensagem da IP Aquiraz: "${props.titulo}". Recomendo a leitura!`,
          url: urlAtual,
        });
      } catch (err) {
        console.error("Erro no compartilhamento nativo:", err);
      }
    } else {
      copiarLink(); // Se for PC e não tiver menu nativo, ele apenas copia o link
    }
  }

  // Se a URL ainda não foi capturada, retorna vazio para não quebrar o layout
  if (!urlAtual) return null;

  // Prepara os textos para enviar nas redes sociais (converte espaços em códigos de URL)
  const textoCodificado = encodeURIComponent(`Fui muito edificado por esta mensagem da IP Aquiraz: "${props.titulo}". Recomendo a leitura!`);
  const urlCodificada = encodeURIComponent(urlAtual);

  const linkWhatsapp = `https://api.whatsapp.com/send?text=${textoCodificado} ${urlCodificada}`;
  const linkFacebook = `https://www.facebook.com/sharer/sharer.php?u=${urlCodificada}`;
  const linkTwitter = `https://twitter.com/intent/tweet?url=${urlCodificada}&text=${textoCodificado}`;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 py-8 border-t border-b border-gray-100 my-8">
      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
        Compartilhe:
      </span>
      
      <div className="flex items-center gap-3">
        {/* Botão WhatsApp */}
        <a 
          href={linkWhatsapp} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center w-10 h-10 rounded-full bg-[#25D366] text-white hover:bg-[#1da851] transition-transform hover:scale-105 shadow-sm"
          title="Compartilhar no WhatsApp"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
        </a>

        {/* Botão Facebook */}
        <a 
          href={linkFacebook} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1877F2] text-white hover:bg-[#145dbf] transition-transform hover:scale-105 shadow-sm"
          title="Compartilhar no Facebook"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
        </a>

        {/* Botão X (Twitter) */}
        <a 
          href={linkTwitter} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center w-10 h-10 rounded-full bg-black text-white hover:bg-gray-800 transition-transform hover:scale-105 shadow-sm"
          title="Compartilhar no X"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z"></path><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path></svg>
        </a>

        <div className="w-px h-6 bg-gray-200 mx-2 hidden sm:block"></div>

        {/* Botão Copiar Link (Visível no PC) */}
        <button 
          onClick={copiarLink}
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors text-xs font-bold uppercase tracking-wider"
        >
          {copiado ? <><Check size={16} className="text-ipa-verde" /> Copiado</> : <><LinkIcon size={16} /> Copiar Link</>}
        </button>

        {/* Botão Enviar Nativo (Aparece mais em Celulares) */}
        <button 
          onClick={compartilharNativo}
          className="sm:hidden flex items-center gap-2 px-4 py-2 rounded-full bg-ipa-verde text-white hover:bg-green-800 transition-colors text-xs font-bold uppercase tracking-wider"
        >
          <Share2 size={16} /> Compartilhar
        </button>
      </div>
    </div>
  );
}