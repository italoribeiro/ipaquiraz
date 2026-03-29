"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import EditorNoticia from "@/components/admin/EditorNoticia";
import { POST_STATUS, POST_STATUS_LABEL } from "@/lib/constants";
import { 
  Save, Globe, Image as ImageIcon, Youtube as YoutubeIcon,
  Calendar, User, Folder, Link as LinkIcon, AlertCircle, ArrowLeft, Loader2
} from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function EditarPostPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const postId = resolvedParams.id;
  
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  // Listas para os Selects
  const [autoresList, setAutoresList] = useState<any[]>([]);
  const [categoriasList, setCategoriasList] = useState<any[]>([]);

  // Estados do Post
  const [titulo, setTitulo] = useState("");
  const [slug, setSlug] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [autor, setAutor] = useState("");
  const [categoria, setCategoria] = useState("");
  const [status, setStatus] = useState<number | "">("");
  const [dataPublicacao, setDataPublicacao] = useState("");
  const [imagemCapa, setImagemCapa] = useState("");
  const [youtubeId, setYoutubeId] = useState("");
  const [isDestaque, setIsDestaque] = useState(false);
  const [isSubDestaque, setIsSubDestaque] = useState(false);
  const [seoTitulo, setSeoTitulo] = useState("");
  const [seoDescricao, setSeoDescricao] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);

        // 1. Busca Autores e Categorias para os Dropdowns
        const [resAutores, resCats] = await Promise.all([
          supabase.from("site_post_authors").select("id, nome").order("nome"),
          supabase.from("site_post_categories").select("id, nome").order("nome")
        ]);

        setAutoresList(resAutores.data || []);
        setCategoriasList(resCats.data || []);

        // 2. Busca os dados da notícia
        const { data: post, error } = await supabase
          .from('site_posts')
          .select('*')
          .eq('id', postId)
          .single();

        if (error) throw error;

        if (post) {
          setTitulo(post.titulo || "");
          setSlug(post.slug || "");
          setConteudo(post.conteudo || "");
          setAutor(post.autor_id || ""); 
          setCategoria(post.categoria_id || ""); 
          setStatus(post.status);
          if (post.publicado_em) {
            setDataPublicacao(new Date(post.publicado_em).toISOString().slice(0, 16));
          }
          setImagemCapa(post.imagem_capa_url || "");
          setYoutubeId(post.youtube_id || "");
          setIsDestaque(post.is_destaque || false);
          setIsSubDestaque(post.is_sub_destaque || false);
          setSeoTitulo(post.seo_title || "");
          setSeoDescricao(post.seo_description || "");
          setSeoKeywords(Array.isArray(post.seo_keywords) ? post.seo_keywords.join(", ") : "");
        }
      } catch (error) {
        console.error("Erro ao carregar:", error);
        setErro("Não foi possível carregar os dados.");
      } finally {
        setLoading(false);
      }
    };

    if (postId) carregarDados();
  }, [postId]);

  const handleAtualizar = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    try {
      const keywordsArray = seoKeywords.split(",").map(k => k.trim()).filter(Boolean);
      const { error } = await supabase
        .from('site_posts')
        .update({
          titulo, slug, conteudo,
          autor_id: autor,
          categoria_id: categoria,
          status,
          publicado_em: new Date(dataPublicacao).toISOString(),
          imagem_capa_url: imagemCapa,
          youtube_id: youtubeId,
          is_destaque: isDestaque,
          is_sub_destaque: isSubDestaque,
          seo_title: seoTitulo,
          seo_description: seoDescricao,
          seo_keywords: keywordsArray,
          atualizado_em: new Date().toISOString()
        })
        .eq('id', postId);

      if (error) throw error;
      router.push('/admin/posts');
    } catch (error: any) {
      setErro("Erro ao salvar: " + error.message);
    } finally {
      setSalvando(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-ipa-verde" size={40} /></div>;

  return (
    <div className="p-10 pb-32 font-sans">
      <button onClick={() => router.back()} className="mb-8 flex items-center gap-2 text-gray-400 hover:text-ipa-escuro font-bold uppercase text-xs transition-colors">
        <ArrowLeft size={16} /> Voltar
      </button>

      <form onSubmit={handleAtualizar} className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          {erro && <div className="bg-red-50 text-red-500 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold"><AlertCircle size={20} />{erro}</div>}

          <input 
            type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)}
            placeholder="Título da notícia..."
            className="w-full text-4xl font-black bg-transparent border-none focus:outline-none uppercase tracking-tighter text-ipa-escuro"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* SELECT DE AUTOR */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col gap-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2"><User size={12} /> Autor</label>
              <select 
                value={autor} onChange={(e) => setAutor(e.target.value)}
                className="w-full text-sm outline-none font-bold text-ipa-escuro bg-transparent cursor-pointer"
                required
              >
                <option value="">Selecione o Autor...</option>
                {autoresList.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
              </select>
            </div>

            {/* SELECT DE CATEGORIA */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col gap-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2"><Folder size={12} /> Categoria</label>
              <select 
                value={categoria} onChange={(e) => setCategoria(e.target.value)}
                className="w-full text-sm outline-none font-bold text-ipa-escuro bg-transparent cursor-pointer"
                required
              >
                <option value="">Selecione a Categoria...</option>
                {categoriasList.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </div>
          </div>
          
          <EditorNoticia value={conteudo} onChange={setConteudo} />
          
          {/* ... Resto do formulário SEO permanece igual ... */}
        </div>

        {/* SIDEBAR */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6 sticky top-10">
            <button type="submit" disabled={salvando} className="w-full bg-ipa-verde text-white py-4 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-2 hover:bg-ipa-escuro transition-all">
              {salvando ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              {salvando ? "Salvando..." : "Atualizar Notícia"}
            </button>
            {/* ... Campos de status, data, imagem, etc ... */}
          </div>
        </div>
      </form>
    </div>
  );
}