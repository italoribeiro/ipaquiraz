// src/app/admin/posts/novo/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import EditorNoticia from "@/components/admin/EditorNoticia";
import Autocomplete from "@/components/admin/Autocomplete";
import { Save, Globe, Image as ImageIcon, Youtube as YoutubeIcon, ArrowLeft, Loader2, Calendar, LayoutList } from "lucide-react";
import Link from "next/link";
import { POST_STATUS } from "@/lib/constants";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function NovoPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [autores, setAutores] = useState([]);

  // Campos
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [autorId, setAutorId] = useState("");
  const [statusManual, setStatusManual] = useState(4); // Default Rascunho
  const [dataPublicacao, setDataPublicacao] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    async function carregar() {
      const { data: c } = await supabase.from("site_post_categories").select("*").order("nome");
      const { data: a } = await supabase.from("site_post_authors").select("*").order("nome");
      if (c) setCategorias(c as any);
      if (a) setAutores(a as any);
    }
    carregar();
  }, []);

  return (
    <div className="w-full bg-gray-50/30 min-h-screen">
      <form className="w-full px-6 py-10 lg:px-10 flex flex-col lg:flex-row gap-8">
        
        {/* LADO ESQUERDO: CONTEÚDO (Full width on mobile, auto on desktop) */}
        <div className="flex-1 space-y-6">
          <div className="flex justify-between items-center">
            <Link href="/admin/posts" className="flex items-center gap-2 text-gray-400 hover:text-ipa-verde font-black uppercase text-[10px] tracking-widest transition-all">
              <ArrowLeft size={16} /> Voltar
            </Link>
          </div>

          <input 
            type="text" 
            placeholder="TÍTULO DA NOTÍCIA..."
            className="w-full text-3xl lg:text-5xl font-black bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-gray-200 uppercase tracking-tighter text-ipa-escuro"
            onChange={(e) => setTitulo(e.target.value)}
          />
          
          <EditorNoticia value={conteudo} onChange={setConteudo} />

          {/* SEO SECTION */}
          <div className="bg-white p-6 lg:p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-8">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-ipa-verde flex items-center gap-2"><Globe size={16} /> SEO / Google</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Meta Descrição</label>
                <textarea className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm resize-none" rows={4} placeholder="Resumo para o Google..." />
              </div>
            </div>
          </div>
        </div>

        {/* LADO DIREITO: CONFIGS (Barra Lateral) */}
        <div className="w-full lg:w-96 space-y-6">
          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-xl space-y-8 sticky top-10">
            
            <button className="w-full bg-ipa-verde text-white py-5 rounded-3xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2 shadow-lg shadow-ipa-verde/30 hover:bg-ipa-escuro transition-all">
              <Save size={18} /> Publicar
            </button>

            {/* STATUS MANUAL (Sem IA) */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-2"><LayoutList size={14} /> Status</label>
              <select 
                value={statusManual} 
                onChange={(e) => setStatusManual(Number(e.target.value))}
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black uppercase"
              >
                <option value={4}>Rascunho</option>
                <option value={1}>Publicado</option>
                <option value={0}>Arquivado / Não Publicado</option>
              </select>
            </div>

            {/* DATA DE PUBLICAÇÃO */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-2"><Calendar size={14} /> Data da Postagem</label>
              <input 
                type="date" 
                value={dataPublicacao} 
                onChange={(e) => setDataPublicacao(e.target.value)}
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black"
              />
            </div>

            {/* AUTOCOMPLETES */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Categoria</label>
                <Autocomplete items={categorias} value={categoriaId} onChange={setCategoriaId} placeholder="PESQUISAR CATEGORIA..." />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Autor</label>
                <Autocomplete items={autores} value={autorId} onChange={setAutorId} placeholder="PESQUISAR AUTOR..." />
              </div>
            </div>

          </div>
        </div>
      </form>
    </div>
  );
}