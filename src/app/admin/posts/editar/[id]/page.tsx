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
  const [erro, setErro] = useState("");

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
    const fetchNoticia = async () => {
      try {
        const { data, error } = await supabase
          .from('site_posts')
          .select('*')
          .eq('id', postId)
          .single();

        if (error) throw error;

        if (data) {
          setTitulo(data.titulo || "");
          setSlug(data.slug || "");
          setConteudo(data.conteudo || "");
          
          setAutor(data.autor_id || ""); 
          setCategoria(data.categoria_id || ""); 
          
          setStatus(data.status);
          
          if (data.publicado_em) {
            const dataFormatada = new Date(data.publicado_em).toISOString().slice(0, 16);
            setDataPublicacao(dataFormatada);
          }
          
          setImagemCapa(data.imagem_capa_url || "");
          setYoutubeId(data.youtube_id || "");
          setIsDestaque(data.is_destaque || false);
          setIsSubDestaque(data.is_sub_destaque || false);
          
          // MAPEAMENTO CORRETO DO SEO BASEADO NA SUA ESTRUTURA
          setSeoTitulo(data.seo_title || ""); // Correção do nome
          setSeoDescricao(data.seo_description || ""); // Correção do nome
          
          // Se for array no banco, junta com vírgula para aparecer no input
          if (Array.isArray(data.seo_keywords)) {
            setSeoKeywords(data.seo_keywords.join(", "));
          } else {
            setSeoKeywords("");
          }
        }

      } catch (error) {
        console.error("Erro ao buscar notícia:", error);
        setErro("Não foi possível carregar os dados da notícia.");
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchNoticia();
    }
  }, [postId]);

  const handleTituloChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const novoTitulo = e.target.value;
    setTitulo(novoTitulo);
    
    const slugGerado = novoTitulo
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    
    setSlug(slugGerado);
  };

  const handleAtualizar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    if (!titulo || !slug || !autor || !categoria || !conteudo || conteudo === "<p></p>" || !seoTitulo || !seoDescricao || !seoKeywords || status === "" || !dataPublicacao || !imagemCapa) {
      setErro("Existem campos obrigatórios vazios. Verifique antes de atualizar.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSalvando(true);

    try {
      // Pega a string de palavras-chave separada por vírgula e transforma num ARRAY para salvar no banco
      const keywordsArray = seoKeywords.split(",").map(k => k.trim()).filter(Boolean);

      const { error } = await supabase
        .from('site_posts')
        .update({
          titulo: titulo,
          slug: slug,
          conteudo: conteudo,
          autor_id: autor,
          categoria_id: categoria,
          status: status,
          publicado_em: new Date(dataPublicacao).toISOString(),
          imagem_capa_url: imagemCapa,
          youtube_id: youtubeId,
          is_destaque: isDestaque,
          is_sub_destaque: isSubDestaque,
          seo_title: seoTitulo, // Correção do nome
          seo_description: seoDescricao, // Correção do nome
          seo_keywords: keywordsArray, // Enviando como Array!
          atualizado_em: new Date().toISOString() // Atualiza a data de modificação automaticamente!
        })
        .eq('id', postId);

      if (error) throw error;

      alert("Notícia atualizada com sucesso!");
      router.push('/admin/posts');

    } catch (error: any) {
      console.error("Erro no UPDATE:", error);
      setErro("Erro ao salvar no banco de dados. " + (error.message || ""));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSalvando(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-ipa-verde">
        <Loader2 size={40} className="animate-spin" />
        <p className="font-bold tracking-widest uppercase text-sm">Carregando notícia...</p>
      </div>
    );
  }

  return (
    <div className="p-10 pb-32 font-sans">
      
      <button 
        onClick={() => router.back()} 
        className="mb-8 flex items-center gap-2 text-gray-400 hover:text-ipa-escuro font-bold uppercase tracking-widest text-xs transition-colors"
      >
        <ArrowLeft size={16} /> Voltar para Listagem
      </button>

      <form onSubmit={handleAtualizar} className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        <div className="lg:col-span-3 space-y-6">
          
          {erro && (
            <div className="bg-red-50 text-red-500 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold">
              <AlertCircle size={20} />
              {erro}
            </div>
          )}

          <div className="space-y-2">
            <input 
              type="text" 
              value={titulo}
              onChange={handleTituloChange}
              placeholder="Digite o título da notícia aqui..."
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col gap-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <User size={12} /> Autor (ID)
              </label>
              <input 
                type="text"
                value={autor} 
                onChange={(e) => setAutor(e.target.value)}
                placeholder="Cole o ID do autor aqui"
                className="w-full text-sm outline-none font-bold text-ipa-escuro"
                required
              />
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col gap-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <Folder size={12} /> Categoria (ID)
              </label>
              <input 
                type="text"
                value={categoria} 
                onChange={(e) => setCategoria(e.target.value)}
                placeholder="Cole o ID da categoria aqui"
                className="w-full text-sm outline-none font-bold text-ipa-escuro"
                required
              />
            </div>
          </div>
          
          <EditorNoticia value={conteudo} onChange={setConteudo} />

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-ipa-verde flex items-center gap-2">
              <Globe size={16} /> Otimização para Google (SEO)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Título SEO</label>
                  <input 
                    type="text" 
                    value={seoTitulo}
                    onChange={(e) => setSeoTitulo(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none text-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Palavras-Chave</label>
                  <input 
                    type="text" 
                    value={seoKeywords}
                    onChange={(e) => setSeoKeywords(e.target.value)}
                    placeholder="Ex: Reforma, Calvino (separadas por vírgula)"
                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none text-sm"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Descrição SEO</label>
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

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6 sticky top-10">
            
            <div className="space-y-4">
               <button 
                 type="submit" 
                 disabled={salvando}
                 className={`w-full text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 ${salvando ? 'bg-gray-400 cursor-not-allowed' : 'bg-ipa-verde hover:bg-ipa-escuro shadow-ipa-verde/20'}`}
               >
                 {salvando ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                 {salvando ? "Salvando..." : "Atualizar Notícia"}
               </button>
            </div>

            <hr className="border-gray-50" />

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Status da Publicação</label>
              <select 
                value={status} 
                onChange={(e) => setStatus(Number(e.target.value))}
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none font-bold text-ipa-escuro"
                required
              >
                <option value="" disabled>Selecione o status...</option>
                {Object.entries(POST_STATUS_LABEL).map(([valor, { texto }]) => (
                  <option key={valor} value={valor}>{texto}</option>
                ))}
              </select>
            </div>

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

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <ImageIcon size={14} /> Link Imagem de Capa
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
                  <img src={imagemCapa} alt="Preview da Capa" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <YoutubeIcon size={14} /> ID do Vídeo YouTube
              </label>
              <input 
                type="text" 
                value={youtubeId}
                onChange={(e) => setYoutubeId(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:outline-none" 
              />
            </div>

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
                <span className="text-[11px] font-black uppercase tracking-widest text-gray-500 group-hover:text-ipa-verde text-left">Sub Destaque</span>
              </label>
            </div>

          </div>
        </div>

      </form>
    </div>
  );
}