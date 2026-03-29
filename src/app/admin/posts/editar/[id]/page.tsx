"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import EditorNoticia from "@/components/admin/EditorNoticia";
import { POST_STATUS, POST_STATUS_LABEL } from "@/lib/constants";
import { 
  Save, Globe, Image as ImageIcon, Youtube as YoutubeIcon,
  Calendar, User, Folder, Link as LinkIcon, AlertCircle, ArrowLeft, Loader2, CheckCircle2
} from "lucide-react";

// Inicializa o cliente do Supabase
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
  const [sucesso, setSucesso] = useState(false);
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

  // Estados SEO
  const [seoTitulo, setSeoTitulo] = useState("");
  const [seoDescricao, setSeoDescricao] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);

        // 1. Busca Autores e Categorias para os Dropdowns em paralelo
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
            // Formata a data para o input datetime-local (YYYY-MM-DDTHH:MM)
            const d = new Date(post.publicado_em);
            const dataFormatada = d.toISOString().slice(0, 16);
            setDataPublicacao(dataFormatada);
          }
          
          setImagemCapa(post.imagem_capa_url || "");
          setYoutubeId(post.youtube_id || "");
          setIsDestaque(post.is_destaque || false);
          setIsSubDestaque(post.is_sub_destaque || false);
          
          // SEO mapping correto das colunas do banco
          setSeoTitulo(post.seo_title || "");
          setSeoDescricao(post.seo_description || "");
          setSeoKeywords(Array.isArray(post.seo_keywords) ? post.seo_keywords.join(", ") : "");
        }

      } catch (error: any) {
        console.error("Erro ao carregar dados:", error);
        setErro("Não foi possível carregar os dados da notícia.");
      } finally {
        setLoading(false);
      }
    };

    if (postId) carregarDados();
  }, [postId]);

  const handleAtualizar = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    setErro("");

    try {
      // Transforma a string de keywords em Array
      const keywordsArray = seoKeywords.split(",").map(k => k.trim()).filter(Boolean);

      const { error } = await supabase
        .from('site_posts')
        .update({
          titulo,
          slug,
          conteudo,
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

      setSucesso(true);
      setTimeout(() => {
        router.push('/admin/posts');
        router.refresh();
      }, 1500);

    } catch (error: any) {
      console.error("Erro no UPDATE:", error);
      setErro("Erro ao salvar: " + (error.message || "Verifique os campos."));
    } finally {
      setSalvando(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-ipa-verde">
        <Loader2 size={40} className="animate-spin" />
        <p className="font-black uppercase tracking-widest text-xs">Carregando notícia...</p>
      </div>
    );
  }

  return (
    <div className="p-10 pb-32 font-sans">
      
      <button 
        onClick={() => router.back()} 
        className="mb-8 flex items-center gap-2 text-gray-400 hover:text-ipa-escuro font-bold uppercase tracking-widest text-[10px] transition-colors"
      >
        <ArrowLeft size={16} /> Voltar para Listagem
      </button>

      <form onSubmit={handleAtualizar} className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* COLUNA PRINCIPAL (ESQUERDA) */}
        <div className="lg:col-span-3 space-y-6">
          
          {erro && (
            <div className="bg-red-50 text-red-500 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold animate-bounce">
              <AlertCircle size={20} /> {erro}
            </div>
          )}

          {sucesso && (
            <div className="bg-green-50 text-green-600 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold">
              <CheckCircle2 size={20} /> Atualizado com sucesso! Redirecionando...
            </div>
          )}

          {/* TITULO E SLUG PREVIEW */}
          <div className="space-y-2">
            <input 
              type="text" 
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Título da notícia..."
              className="w-full text-4xl font-black bg-transparent border-none focus:outline-none focus:ring-0 placeholder:opacity-20 uppercase tracking-tighter text-ipa-escuro"
              required
            />
            <div className="flex items-center gap-2 text-gray-400 text-xs font-mono bg-gray-50 p-2 rounded-lg w-fit">
              <LinkIcon size={12} />
              <span>meusite.com/noticias/</span>
              <input 
                type="text" 
                value={slug} 
                onChange={(e) => setSlug(e.target.value)} 
                className="bg-transparent border-none focus:outline-none w-64 text-ipa-verde font-bold"
                required
              />
            </div>
          </div>

          {/* AUTOR E CATEGORIA SELECTS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col gap-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <User size={12} /> Autor
              </label>
              <select 
                value={autor} 
                onChange={(e) => setAutor(e.target.value)}
                className="w-full text-sm outline-none font-bold text-ipa-escuro bg-transparent"
                required
              >
                <option value="">Selecione o Autor...</option>
                {autoresList.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
              </select>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col gap-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <Folder size={12} /> Categoria
              </label>
              <select 
                value={categoria} 
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full text-sm outline-none font-bold text-ipa-escuro bg-transparent"
                required
              >
                <option value="">Selecione a Categoria...</option>
                {categoriasList.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </div>
          </div>
          
          {/* EDITOR TIPTAP */}
          <EditorNoticia value={conteudo} onChange={setConteudo} />

          {/* SEÇÃO SEO COMPLETA */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-ipa-verde flex items-center gap-2">
              <Globe size={16} /> Otimização para Google (SEO)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Título SEO (Meta Title)</label>
                  <input 
                    type="text" 
                    value={seoTitulo}
                    onChange={(e) => setSeoTitulo(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none text-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Palavras-Chave (Tags separadas por vírgula)</label>
                  <input 
                    type="text" 
                    value={seoKeywords}
                    onChange={(e) => setSeoKeywords(e.target.value)}
                    placeholder="Ex: Reforma, Calvino, IPB..."
                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none text-sm"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Descrição SEO (Meta Description)</label>
                <textarea 
                  value={seoDescricao}
                  onChange={(e) => setSeoDescricao(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none text-sm h-[120px] resize-none"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* SIDEBAR (DIREITA) */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6 sticky top-10">
            
            <button 
              type="submit" 
              disabled={salvando}
              className={`w-full text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 ${salvando ? 'bg-gray-400' : 'bg-ipa-verde hover:bg-ipa-escuro shadow-ipa-verde/20'}`}
            >
              {salvando ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {salvando ? "Salvando..." : "Atualizar Notícia"}
            </button>

            <hr className="border-gray-50" />

            {/* STATUS SELECT */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Status da Publicação</label>
              <select 
                value={status} 
                onChange={(e) => setStatus(Number(e.target.value))}
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none font-bold text-ipa-escuro"
                required
              >
                <option value="" disabled>Selecione...</option>
                {Object.entries(POST_STATUS_LABEL).map(([valor, { texto }]) => (
                  <option key={valor} value={valor}>{texto}</option>
                ))}
              </select>
            </div>

            {/* DATA DE PUBLICAÇÃO */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <Calendar size={14} /> Data e Hora
              </label>
              <input 
                type="datetime-local" 
                value={dataPublicacao}
                onChange={(e) => setDataPublicacao(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none" 
                required
              />
            </div>

            {/* IMAGEM DE CAPA COM PREVIEW */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <ImageIcon size={14} /> URL Imagem de Capa
              </label>
              <input 
                type="url" 
                value={imagemCapa}
                onChange={(e) => setImagemCapa(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:outline-none" 
                required
              />
              {imagemCapa && (
                <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                  <img src={imagemCapa} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* YOUTUBE ID */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <YoutubeIcon size={14} /> ID do Vídeo YouTube
              </label>
              <input 
                type="text" 
                value={youtubeId}
                onChange={(e) => setYoutubeId(e.target.value)}
                placeholder="Ex: dQw4w9WgXcQ"
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:outline-none" 
              />
            </div>

            {/* CHECKBOXES DE DESTAQUE */}
            <div className="space-y-4 pt-4 border-t border-gray-50">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={isDestaque}
                  onChange={(e) => setIsDestaque(e.target.checked)}
                  className="w-5 h-5 rounded-lg border-gray-200 text-ipa-verde focus:ring-ipa-verde focus:ring-offset-0" 
                />
                <span className="text-[11px] font-black uppercase tracking-widest text-gray-500 group-hover:text-ipa-verde">Notícia Destaque</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={isSubDestaque}
                  onChange={(e) => setIsSubDestaque(e.target.checked)}
                  className="w-5 h-5 rounded-lg border-gray-200 text-ipa-verde focus:ring-ipa-verde focus:ring-offset-0" 
                />
                <span className="text-[11px] font-black uppercase tracking-widest text-gray-500 group-hover:text-ipa-verde">Sub Destaque</span>
              </label>
            </div>

          </div>
        </div>
      </form>
    </div>
  );
}