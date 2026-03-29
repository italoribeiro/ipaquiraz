"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import EditorNoticia from "@/components/admin/EditorNoticia";
import { 
  Save, Globe, Image as ImageIcon, Youtube as YoutubeIcon, 
  Plus, ArrowLeft, Loader2, CheckCircle2 
} from "lucide-react";
import Link from "next/link";
import { POST_STATUS } from "@/lib/constants";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function NovoPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Dados vindos do Banco
  const [categorias, setCategorias] = useState<any[]>([]);
  const [autores, setAutores] = useState<any[]>([]);

  // Estados do Formulário
  const [titulo, setTitulo] = useState("");
  const [slug, setSlug] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [resumo, setResumo] = useState("");
  const [imagemCapa, setImagemCapa] = useState("");
  const [youtubeId, setYoutubeId] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [autorId, setAutorId] = useState("");
  const [isDestaque, setIsDestaque] = useState(false);
  const [isSubDestaque, setIsSubDestaque] = useState(false);
  
  // SEO
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDesc, setSeoDesc] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");

  // 1. Carregar Categorias e Autores ao Abrir
  useEffect(() => {
    async function carregarDados() {
      const { data: cat } = await supabase.from("site_post_categories").select("*").order("nome");
      const { data: aut } = await supabase.from("site_post_authors").select("*").order("nome");
      if (cat) setCategorias(cat);
      if (aut) setAutores(aut);
    }
    carregarDados();
  }, []);

  // 2. Gerador de Slug Automático
  const gerarSlug = (texto: string) => {
    const s = texto
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, "") // Remove acentos
      .replace(/[^\w\s-]/g, "") // Remove caracteres especiais
      .replace(/[\s_-]+/g, "-") // Troca espaços por hifen
      .replace(/^-+|-+$/g, ""); // Remove hifens no início/fim
    setSlug(s);
    if (!seoTitle) setSeoTitle(texto); // Sugere o título SEO também
  };

  // 3. Função para Salvar
  const handleSalvar = async (e: React.FormEvent, statusDesejado: number) => {
    e.preventDefault();
    if (!titulo || !categoriaId || !autorId) {
      alert("Título, Categoria e Autor são obrigatórios!");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("site_posts").insert([{
      titulo,
      slug,
      conteudo,
      resumo,
      imagem_capa_url: imagemCapa,
      youtube_id: youtubeId,
      status: statusDesejado,
      categoria_id: categoriaId,
      autor_id: autorId,
      is_destaque: isDestaque,
      is_sub_destaque: isSubDestaque,
      seo_title: seoTitle,
      seo_description: seoDesc,
      seo_keywords: seoKeywords.split(",").map(k => k.trim()), // Transforma em Array para o Postgres
      publicado_em: statusDesejado === POST_STATUS.PUBLICADO ? new Date() : null
    }]);

    if (error) {
      console.error(error);
      alert("Erro ao salvar: " + error.message);
      setLoading(false);
    } else {
      router.push("/admin/posts?success=true");
    }
  };

  return (
    <div className="p-10 pb-32 font-sans bg-gray-50/30 min-h-screen">
      <form className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* HEADER DE AÇÕES */}
        <div className="lg:col-span-4 flex justify-between items-center mb-4">
          <Link href="/admin/posts" className="flex items-center gap-2 text-gray-400 hover:text-ipa-verde font-black uppercase text-[10px] tracking-widest transition-all">
            <ArrowLeft size={16} /> Voltar para lista
          </Link>
          <div className="flex gap-3">
             <button 
                type="button"
                onClick={(e) => handleSalvar(e, POST_STATUS.RASCUNHO)}
                disabled={loading}
                className="px-6 py-3 bg-white border border-gray-200 text-gray-500 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-gray-50 transition-all disabled:opacity-50"
             >
               Salvar Rascunho
             </button>
             <button 
                type="button"
                onClick={(e) => handleSalvar(e, POST_STATUS.PUBLICADO)}
                disabled={loading}
                className="px-8 py-3 bg-ipa-verde text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-ipa-escuro transition-all shadow-lg shadow-ipa-verde/20 flex items-center gap-2 disabled:opacity-50"
             >
               {loading ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
               Publicar Notícia
             </button>
          </div>
        </div>

        {/* COLUNA ESQUERDA: EDITOR (75%) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="space-y-2">
            <input 
              type="text" 
              value={titulo}
              onChange={(e) => { setTitulo(e.target.value); gerarSlug(e.target.value); }}
              placeholder="TÍTULO DA NOTÍCIA..."
              className="w-full text-4xl font-black bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-gray-200 uppercase tracking-tighter text-ipa-escuro"
            />
            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 ml-1">
              <Globe size={12} /> ipaquiraz.com.br/noticias/<span className="text-ipa-verde">{slug || 'seu-link-aqui'}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Resumo Curto (Para os Cards)</label>
            <textarea 
              rows={2}
              value={resumo}
              onChange={(e) => setResumo(e.target.value)}
              placeholder="Uma breve frase que resume a notícia..."
              className="w-full p-4 bg-white border border-gray-100 rounded-2xl focus:outline-none text-sm font-medium resize-none shadow-sm"
            />
          </div>
          
          <EditorNoticia value={conteudo} onChange={setConteudo} />

          {/* SEO SECTION */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-ipa-verde flex items-center gap-2">
              <Globe size={16} /> SEO & Metadados para o Google
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Título SEO</label>
                  <input type="text" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Palavras-Chave (Separadas por vírgula)</label>
                  <input type="text" value={seoKeywords} onChange={(e) => setSeoKeywords(e.target.value)} placeholder="ex: reforma, igreja, aquiraz" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Descrição SEO (Meta Description)</label>
                <textarea rows={5} value={seoDesc} onChange={(e) => setSeoDesc(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm resize-none" />
              </div>
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA: CONFIGS (25%) */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-8 sticky top-10">
            
            {/* CATEGORIA E AUTOR */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Categoria</label>
                <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold uppercase">
                  <option value="">Selecione...</option>
                  {categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Autor</label>
                <select value={autorId} onChange={(e) => setAutorId(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold uppercase">
                  <option value="">Selecione...</option>
                  {autores.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
                </select>
              </div>
            </div>

            {/* IMAGEM DE CAPA */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <ImageIcon size={14} /> URL da Imagem de Capa
              </label>
              <input 
                type="text" 
                value={imagemCapa} 
                onChange={(e) => setImagemCapa(e.target.value)} 
                placeholder="https://unsplash.com/..."
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs" 
              />
              {imagemCapa && (
                <div className="mt-2 rounded-xl overflow-hidden border border-gray-100 aspect-video">
                  <img src={imagemCapa} className="w-full h-full object-cover" alt="Preview" />
                </div>
              )}
            </div>

            {/* YOUTUBE */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <YoutubeIcon size={14} /> ID do Vídeo (YouTube)
              </label>
              <input type="text" value={youtubeId} onChange={(e) => setYoutubeId(e.target.value)} placeholder="ex: dQw4w9WgXcQ" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs" />
            </div>

            {/* DESTAQUES */}
            <div className="pt-6 border-t border-gray-50 space-y-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" checked={isDestaque} onChange={(e) => setIsDestaque(e.target.checked)} className="w-5 h-5 rounded-lg border-gray-200 text-ipa-verde focus:ring-0" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-ipa-verde">Notícia Destaque</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" checked={isSubDestaque} onChange={(e) => setIsSubDestaque(e.target.checked)} className="w-5 h-5 rounded-lg border-gray-200 text-ipa-verde focus:ring-0" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-ipa-verde">Sub-Destaque</span>
              </label>
            </div>

          </div>
        </div>

      </form>
    </div>
  );
}