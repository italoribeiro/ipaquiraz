"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import EditorNoticia from "@/components/admin/EditorNoticia";
import { 
  Save, Globe, Image as ImageIcon, Youtube as YoutubeIcon,
  Plus, Calendar, User, Folder, Link as LinkIcon, AlertCircle, ArrowLeft, Loader2
} from "lucide-react";

import { POST_STATUS_LABEL } from "@/lib/constants";

// Inicializa o cliente do Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function NovoPostPage() {
  const router = useRouter();

  // Estados para carregar os Dropdowns
  const [autoresList, setAutoresList] = useState<any[]>([]);
  const [categoriasList, setCategoriasList] = useState<any[]>([]);
  const [carregandoListas, setCarregandoListas] = useState(true);

  // Estados Principais do Formulário
  const [titulo, setTitulo] = useState("");
  const [slug, setSlug] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [autorId, setAutorId] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  
  // Estados da Sidebar
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

  // Estados de Controle de UI
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  // 1. Busca Autores e Categorias do Banco
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [resAutores, resCats] = await Promise.all([
          supabase.from("site_post_authors").select("id, nome").order("nome"),
          supabase.from("site_post_categories").select("id, nome").order("nome")
        ]);

        if (resAutores.error) throw resAutores.error;
        if (resCats.error) throw resCats.error;

        setAutoresList(resAutores.data || []);
        setCategoriasList(resCats.data || []);
      } catch (err) {
        console.error("Erro ao carregar listas:", err);
        setErro("Não foi possível carregar autores ou categorias.");
      } finally {
        setCarregandoListas(false);
      }
    };

    fetchDropdowns();
  }, []);

  // Gerador de Slug Automático
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
    if (!seoTitulo) setSeoTitulo(novoTitulo.slice(0, 60));
  };

  // Validação e Envio para o Supabase
  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    // Validação
    if (!titulo || !slug || !autorId || !categoriaId || !conteudo || conteudo === "<p></p>" || !status || !dataPublicacao) {
      setErro("Campos obrigatórios estão vazios. Verifique Título, Autor, Categoria, Conteúdo, Status e Data.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSalvando(true);

    try {
      // Converte string de keywords para Array
      const keywordsArray = seoKeywords.split(",").map(k => k.trim()).filter(Boolean);

      const { error: insertError } = await supabase
        .from('site_posts')
        .insert([{
          titulo,
          slug,
          conteudo,
          autor_id: autorId,
          categoria_id: categoriaId,
          status,
          publicado_em: new Date(dataPublicacao).toISOString(),
          imagem_capa_url: imagemCapa,
          youtube_id: youtubeId,
          is_destaque: isDestaque,
          is_sub_destaque: isSubDestaque,
          seo_title: seoTitulo,
          seo_description: seoDescricao,
          seo_keywords: keywordsArray
        }]);

      if (insertError) throw insertError;

      router.push('/admin/posts');
      router.refresh();

    } catch (err: any) {
      console.error("Erro ao salvar:", err);
      setErro("Erro ao salvar no banco: " + err.message);
      setSalvando(false);
    }
  };

  return (
    <div className="p-10 pb-32 font-sans">
      
      <button 
        onClick={() => router.back()} 
        className="mb-8 flex items-center gap-2 text-gray-400 hover:text-ipa-escuro font-bold uppercase tracking-widest text-[10px] transition-colors"
      >
        <ArrowLeft size={14} /> Voltar para Listagem
      </button>

      <form onSubmit={handleSalvar} className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        
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
            {/* SELECT DE AUTOR */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col gap-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <User size={12} /> Autor
              </label>
              <select 
                value={autorId}
                onChange={(e) => setAutorId(e.target.value)}
                className="w-full text-sm outline-none font-bold text-ipa-escuro bg-transparent"
                disabled={carregandoListas}
                required
              >
                <option value="">{carregandoListas ? "Carregando autores..." : "Selecione um autor"}</option>
                {autoresList.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
              </select>
            </div>

            {/* SELECT DE CATEGORIA */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col gap-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <Folder size={12} /> Categoria
              </label>
              <select 
                value={categoriaId}
                onChange={(e) => setCategoriaId(e.target.value)}
                className="w-full text-sm outline-none font-bold text-ipa-escuro bg-transparent"
                disabled={carregandoListas}
                required
              >
                <option value="">{carregandoListas ? "Carregando categorias..." : "Selecione uma categoria"}</option>
                {categoriasList.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
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
                    placeholder="Ex: Reforma, Calvino, Aquiraz..."
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
                 className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 ${salvando ? 'bg-gray-400' : 'bg-ipa-verde text-white hover:bg-ipa-escuro shadow-ipa-verde/20'}`}
               >
                 {salvando ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                 {salvando ? "Publicando..." : "Publicar Notícia"}
               </button>
            </div>

            <hr className="border-gray-50" />

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Status</label>
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
                <ImageIcon size={14} /> Capa (URL)
              </label>
              <input 
                type="url" 
                value={imagemCapa}
                onChange={(e) => setImagemCapa(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs" 
                required
              />
              {imagemCapa && (
                <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden border">
                  <img src={imagemCapa} className="w-full h-full object-cover" alt="" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <YoutubeIcon size={14} /> YouTube ID
              </label>
              <input 
                type="text" 
                value={youtubeId}
                onChange={(e) => setYoutubeId(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs" 
              />
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-50">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={isDestaque} onChange={(e) => setIsDestaque(e.target.checked)} className="w-5 h-5 rounded-lg text-ipa-verde focus:ring-ipa-verde" />
                <span className="text-[11px] font-black uppercase tracking-widest text-gray-500">Destaque</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={isSubDestaque} onChange={(e) => setIsSubDestaque(e.target.checked)} className="w-5 h-5 rounded-lg text-ipa-verde focus:ring-ipa-verde" />
                <span className="text-[11px] font-black uppercase tracking-widest text-gray-500">Sub-Destaque</span>
              </label>
            </div>

          </div>
        </div>
      </form>
    </div>
  );
}