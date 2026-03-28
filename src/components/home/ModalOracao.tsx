"use client";

import React, { useState, useEffect } from "react";
import { X, Heart } from "lucide-react";

export default function ModalOracao() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Truque de UX: Verifica se o modal já foi aberto nesta sessão do navegador
    const modalJaAberto = sessionStorage.getItem("modalOracaoVisto");

    if (!modalJaAberto) {
      // Abre o modal após 1.5 segundos para não ser agressivo
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem("modalOracaoVisto", "true"); // Marca que já viu
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, []);

  // Se estiver fechado, não renderiza nada
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Fundo escuro com desfoque (Clica fora para fechar) */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Caixa do Modal */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300">
        
        {/* Cabeçalho do Modal */}
        <div className="bg-ipa-verde p-4 flex justify-between items-center text-white shrink-0">
          <div className="flex items-center gap-2">
            <Heart size={18} className="text-ipa-dourado animate-pulse" />
            <h3 className="font-black tracking-widest uppercase text-xs">
              Pedidos de Oração
            </h3>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Fechar"
          >
            <X size={16} />
          </button>
        </div>

        {/* Corpo do Modal com Iframe (Scroll Vertical ativado) */}
        <div className="w-full h-[65vh] max-h-[600px] overflow-y-auto bg-gray-50 relative">
          {/* Iframe da sua aplicação Base44 */}
          <iframe 
            src="https://igrejaemaquiraz-oracao.base44.app/"
            className="w-full h-full border-none absolute inset-0"
            title="Formulário de Pedido de Oração"
            loading="lazy"
          />
        </div>
        
        {/* Rodapé discreto */}
        <div className="bg-white p-3 text-center border-t border-gray-100 shrink-0">
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">
            A Igreja Presbiteriana de Aquiraz ora por você
          </p>
        </div>

      </div>
    </div>
  );
}