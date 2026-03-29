"use client";

import { useState } from "react";
import EditorNoticia from "@/components/admin/EditorNoticia";
import { 
  Save, Eye, Globe, Settings, 
  Image as ImageIcon, Share2, Youtube as YoutubeIcon,
  Plus // <-- ADICIONEI ESTA IMPORTAÇÃO AQUI
} from "lucide-react";

export default function NovoPostPage() {
  const [conteudo, setConteudo] = useState("");
  const [seoTitulo, setSeoTitulo] = useState("");
  const [titulo, setTitulo] = useState("");

  // Função fictícia para simular o salvamento (vamos criar a real logo mais)
  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Salvando:", { titulo, conteudo, seoTitulo });
    alert("Pronto para criar a lógica de salvar no Supabase!");
  };

  return (
    <div className="p-10 pb-32 font-sans">
      <form onSubmit={handleSalvar} className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* COLUNA DA ESQUERDA: CONTEÚDO (75%) */}
        <div className="lg:col-span-3 space-y-6">
          <input 
            type="text" 
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Digite o título da notícia aqui..."
            className="w-full text-4xl font-black bg-transparent border-none focus:outline-none focus:ring-0 placeholder:opacity-20 uppercase tracking-tighter text-ipa-escuro"
          />
          
          <EditorNoticia value={conteudo} onChange={setConteudo} />

          {/* CAMPOS DE SEO - BASE PARA O AGENTE DE IA */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-ipa-verde flex items-center gap-2">
              <Globe size={16} /> Otimização para Google (SEO)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Título SEO</label>
                <input 
                  type="text" 
                  value={seoTitulo}
                  onChange={(e) => setSeoTitulo(e.target.value.slice(0, 60))}
                  placeholder="Título que aparece no Google..."
                  className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none text-sm"
                />
                <span className="text-[9px] font-bold text-gray-300">{seoTitulo.length}/60 caracteres</span>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Palavras-Chave (IA)</label>
                <input 
                  type="text" 
                  placeholder="Ex: Reforma, Calvino, Aquiraz..."
                  className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* COLUNA DA DIREITA: SIDEBAR (25%) */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6 sticky top-10">
            
            {/* CARD DE PUBLICAÇÃO */}
            <div className="space-y-4">
               <button type="submit" className="w-full bg-ipa-verde text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-ipa-escuro transition-all shadow-lg shadow-ipa-verde/20 active:scale-95">
                 <Save size={18} /> Publicar Agora
               </button>
               <button type="button" className="w-full border-2 border-gray-100 text-gray-400 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-50 transition-all active:scale-95">
                 Salvar Rascunho
               </button>
            </div>

            <hr className="border-gray-50" />

            {/* IMAGEM DE CAPA */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <ImageIcon size={14} /> Imagem de Capa
              </label>
              {/* O erro estava nesta linha abaixo, agora o Plus está importado */}
              <div className="aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-300 group hover:border-ipa-dourado transition-colors cursor-pointer hover:text-ipa-dourado">
                <Plus size={24} />
                <span className="text-[9px] font-black mt-2 uppercase tracking-widest">LINK DA IMAGEM</span>
              </div>
            </div>

            {/* VÍDEO YOUTUBE */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <YoutubeIcon size={14} /> ID do Vídeo YouTube
              </label>
              <input type="text" placeholder="Ex: dQw4w9WgXcQ" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:outline-none" />
            </div>

            {/* STATUS E DESTAQUE */}
            <div className="space-y-4 pt-4 border-t border-gray-50">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-5 h-5 rounded-lg border-gray-200 text-ipa-verde focus:ring-ipa-verde focus:ring-offset-0" />
                <span className="text-[11px] font-black uppercase tracking-widest text-gray-500 group-hover:text-ipa-verde">Notícia Destaque</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-5 h-5 rounded-lg border-gray-200 text-ipa-verde focus:ring-ipa-verde focus:ring-offset-0" />
                <span className="text-[11px] font-black uppercase tracking-widest text-gray-500 group-hover:text-ipa-verde text-left">Sub Destaque</span>
              </label>
            </div>

          </div>
        </div>

      </form>
    </div>
  );
}