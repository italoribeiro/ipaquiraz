"use client";

import React, { useState, useEffect } from "react";
import { X, Heart } from "lucide-react";

export default function ModalOracao() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const modalJaAberto = sessionStorage.getItem("modalOracaoVisto");

    if (!modalJaAberto) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem("modalOracaoVisto", "true");
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      
      {/* Fundo escuro com desfoque */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Caixa do Modal (AQUI MUDOU O TAMANHO: de max-w-md para max-w-xl) */}
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300">
        
        {/* Cabeçalho */}
        <div className="bg-ipa-verde p-5 flex justify-between items-center text-white shrink-0">
          <div className="flex items-center gap-3">
            <Heart size={20} className="text-ipa-dourado animate-pulse" />
            <h3 className="font-black tracking-widest uppercase text-sm">
              Pedidos de Oração
            </h3>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Corpo do Modal (Aumentei a altura de 65vh para 75vh para caber mais do formulário) */}
        <div className="w-full h-[75vh] max-h-[700px] overflow-y-auto bg-gray-50 relative">
          <iframe 
            src="https://igrejaemaquiraz-oracao.base44.app/"
            className="w-full h-full border-none absolute inset-0"
            title="Formulário de Pedido de Oração"
            loading="lazy"
          />
        </div>
        
        {/* Rodapé */}
        <div className="bg-white p-4 text-center border-t border-gray-100 shrink-0">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
            A IP Aquiraz ora por você
          </p>
        </div>

      </div>
    </div>
  );
}