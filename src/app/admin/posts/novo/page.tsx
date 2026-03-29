"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import EditorNoticia from "@/components/admin/EditorNoticia";
import Autocomplete from "@/components/admin/Autocomplete";
import { 
  Save, Globe, Image as ImageIcon, Youtube as YoutubeIcon, 
  Plus, ArrowLeft, Loader2, Calendar, LayoutList 
} from "lucide-react";
import Link from "next/link";
import { POST_STATUS } from "@/lib/constants";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function NovoPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [autores, setAutores] = useState([]);

  // Estados do Formulário
  const [titulo, setTitulo] = useState("");
  const [slug, setSlug] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [imagemCapa, setImagemCapa] = useState("");
  const [youtubeId, setYoutubeId] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [autorId, setAutorId] = useState("");
  const [statusManual, setStatusManual] = useState(4);
  const [dataPublicacao, setDataPublicacao] = useState(new Date().toISOString().split('T')[0]);
  const [isDestaque, setIsDestaque] = useState(false);
  const [isSubDestaque, setIsSubDestaque] = useState(false);
  const [seoTitle, setSeoTitle] = useState("");

  useEffect(() => {
    async function carregar() {
      const { data: c } = await supabase.from("site_post_categories").select("*").order("nome");
      const { data: a } = await supabase.from("site_post_authors").select("*").order("nome");
      if (c) setCategorias(c as any);
      if (a) setAutores(a as any);
    }
    carregar();
  }, []);

  const gerarSlug = (texto: string) => {
    const s = texto.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
    setSlug(s);
    if (!seoTitle) setSeoTitle(texto);
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Lógica do insert aqui... (conforme fizemos anteriormente)
    alert("Salvando post: " + titulo);
    setLoading(false);
  };

  return (
    <div className="w-full bg-gray-50/30 min-h-screen font-sans">
      <form onSubmit={handleSalvar} className="w-full px-6 py-10 lg:px-10 flex flex-col lg:flex-row gap-8">
        
        {/* COLUNA PRINCIPAL (75%) */}
        <div className="flex-1 space-y-6">
          <div className="flex justify-between items-center">
            <Link href="/admin/posts" className="flex items-center gap-2 text-gray-400 hover:text-ipa-verde font-black uppercase text-[10px] tracking-widest transition-all">
              <ArrowLeft size={16} /> Voltar para lista
            </Link>
          </div>

          <div className="space-y-2">
            <input 
              type="text" 
              value={titulo}
              onChange={(e) => { setTitulo(e.target.value); gerarSlug(e.target.value); }}
              placeholder="TÍTULO DA NOTÍCIA..."
              className="w-full text-3xl lg:text-5xl font-black bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-gray-200 uppercase tracking-tighter text-ipa-escuro"
            />
            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 ml-1">
              <Globe size={12} /> ipaquiraz.com.br/noticias/<span className="text-ipa-verde">{slug || 'seu-link-aqui'}</span>
            </div>
          </div>
          
          <EditorNoticia value={conteudo} onChange={setConteudo} />

          {/* SEO SECTION */}
          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-8">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-ipa-verde flex items-center gap-2"><Globe size={16} /> Otimização SEO</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Título SEO</label>
                  <input type="text" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Meta Descrição</label>
                <textarea rows={4} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm resize-none" placeholder="Resumo para o Google..." />
              </div>
            </div>
          </div>
        </div>

        {/* SIDEBAR (Barra Lateral) */}
        <div className="w-full lg:w-96 space-y-6">
          <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-xl space-y-8 sticky top-10">
            
            <button type="submit" className="w-full bg-ipa-verde text-white py-5 rounded-3xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2 shadow-lg shadow-ipa-verde/30 hover:bg-ipa-escuro transition-all active:scale-95">
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Publicar Agora
            </button>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-2"><LayoutList size={14} /> Status</label>
                <select value={statusManual} onChange={(e) => setStatusManual(Number(e.target.value))} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black uppercase">
                  <option value={4}>Rascunho</option>
                  <option value={1}>Publicado</option>
                  <option value={0}>Arquivado</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-2"><Calendar size={14} /> Data da Postagem</label>
                <input type="date" value={dataPublicacao} onChange={(e) => setDataPublicacao(e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Categoria</label>
                <Autocomplete items={categorias} value={categoriaId} onChange={setCategoriaId} placeholder="PESQUISAR CATEGORIA..." />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Autor</label>
                <Autocomplete items={autores} value={autorId} onChange={setAutorId} placeholder="PESQUISAR AUTOR..." />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2"><ImageIcon size={14} /> Link da Capa</label>
              <input type="text" value={imagemCapa} onChange={(e) => setImagemCapa(e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-[10px]" placeholder="https://..." />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2"><YoutubeIcon size={14} /> ID YouTube</label>
              <input type="text" value={youtubeId} onChange={(e) => setYoutubeId(e.target.value)} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs" placeholder="dQw4w9WgXcQ" />
            </div>

            <div className="pt-6 border-t border-gray-50 space-y-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" checked={isDestaque} onChange={(e) => setIsDestaque(e.target.checked)} className="w-5 h-5 rounded-lg border-gray-200 text-ipa-verde" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-ipa-verde">Notícia Destaque</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" checked={isSubDestaque} onChange={(e) => setIsSubDestaque(e.target.checked)} className="w-5 h-5 rounded-lg border-gray-200 text-ipa-verde" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-ipa-verde">Sub-Destaque</span>
              </label>
            </div>

          </div>
        </div>
      </form>
    </div>
  );
}