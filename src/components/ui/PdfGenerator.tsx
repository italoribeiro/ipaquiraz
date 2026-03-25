// src/components/ui/PdfGenerator.tsx
"use client";

import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { FileText, Download } from "lucide-react";

interface PdfProps {
  titulo: string;
  autor: string;
  data: string;
  conteudo: string; 
}

export default function PdfGenerator(props: PdfProps) {
  // Criamos a referência para a div que será o PDF
  const componenteRef = useRef<HTMLDivElement>(null);

  // MUDANÇA AQUI: Na versão 3.x usamos 'contentRef' passando a referência direto
  const handlePrint = useReactToPrint({
    contentRef: componenteRef,
    documentTitle: `Sermão - ${props.titulo}`,
  });

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
      <div className="flex items-center gap-3 text-ipa-verde">
        <FileText size={24} />
        <h3 className="font-black uppercase tracking-widest text-sm">Material de Estudo</h3>
      </div>
      
      <p className="text-gray-500 text-xs leading-relaxed">
        Deseja estudar offline? Baixe a versão em PDF formatada para leitura e impressão.
      </p>

      <button 
        type="button"
        onClick={function() { handlePrint(); }}
        className="flex items-center justify-center gap-2 w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-xs uppercase tracking-widest transition-colors cursor-pointer"
      >
        <Download size={16} /> Baixar PDF do Sermão
      </button>

      {/* ÁREA DE IMPRESSÃO (Escondida da tela, mas visível para o gerador) */}
      <div style={{ display: "none" }}>
        <div 
          ref={componenteRef} 
          className="p-16 text-black bg-white"
          style={{ width: "210mm", fontFamily: "sans-serif" }}
        >
          {/* Cabeçalho do PDF */}
          <div style={{ borderBottom: "2px solid #e5e7eb", paddingBottom: "2rem", marginBottom: "2rem" }}>
            <h1 style={{ fontSize: "2.25rem", fontWeight: "bold", marginBottom: "0.5rem", textTransform: "uppercase" }}>
              {props.titulo}
            </h1>
            <div style={{ fontSize: "0.875rem", color: "#4b5563", fontWeight: "bold", textTransform: "uppercase", display: "flex", gap: "1.5rem" }}>
              <span>Pregador: {props.autor}</span>
              <span>•</span>
              <span>Data: {props.data}</span>
            </div>
            <p style={{ marginTop: "1rem", fontSize: "0.75rem", color: "#4a533b", fontWeight: "bold" }}>
              Igreja Presbiteriana de Aquiraz — ipaquiraz.com.br
            </p>
          </div>

          {/* Conteúdo do Sermão */}
          <div 
            style={{ lineHeight: "1.6", fontSize: "1.1rem" }}
            className="pdf-content-body [&>p]:mb-4 [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mt-8 [&>h2]:text-xl [&>h2]:font-bold [&>blockquote]:border-l-4 [&>blockquote]:border-gray-200 [&>blockquote]:pl-4"
            dangerouslySetInnerHTML={{ __html: props.conteudo }}
          />

          {/* Rodapé do PDF */}
          <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid #f3f4f6", textAlign: "center", fontSize: "0.7rem", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Documento gerado em ipaquiraz.com.br para fins de estudo pessoal.
          </div>
        </div>
      </div>
    </div>
  );
}