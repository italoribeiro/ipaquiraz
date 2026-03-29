"use client";

import { useState } from "react";
import EditorNoticia from "@/components/admin/EditorNoticia";
import { 
  Save, Globe, Image as ImageIcon, Youtube as YoutubeIcon,
  Plus, Calendar, User, Folder, Link as LinkIcon, AlertCircle
} from "lucide-react";

import { POST_STATUS, POST_STATUS_LABEL } from "@/lib/constants";
export default function NovoPostPage() {
  // Estados Principais
  const [titulo, setTitulo] = useState("");
  const [slug, setSlug] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [autor, setAutor] = useState("");
  const [categoria, setCategoria] = useState("");
  
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

  // Estado de Erro para Validação
  const [erro, setErro] = useState("");

  // Gerador de Slug Automático
  const handleTituloChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const novoTitulo = e.target.value;
    setTitulo(novoTitulo);
    
    // Cria o slug: minúsculas, remove acentos, troca espaços por hífen
    const slugGerado = novoTitulo
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    
    setSlug(slugGerado);
    
    // Preenche o título SEO automaticamente se estiver vazio
    if (!seoTitulo) setSeoTitulo(novoTitulo.slice(0, 60));
  };

  // Validação e Envio
  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    // Validação Manual (garante que tudo está preenchido)
    if (!titulo || !slug || !autor || !categoria || !conteudo || conteudo === "<p></p>" || !seoTitulo || !seoDescricao || !seoKeywords || !status || !dataPublicacao || !imagemCapa || !youtubeId) {
      setErro("Todos os campos são obrigatórios. Por favor, preencha tudo antes de publicar.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const payload = {
      titulo, slug, autor, categoria, conteudo, 
      status, dataPublicacao, imagemCapa, youtubeId, 
      isDestaque, isSubDestaque, 
      seo: { titulo: seoTitulo, descricao: seoDescricao, keywords: seoKeywords }
    };

    console.log("Salvando Payload Completo:", payload);
    alert("Passou na validação! Dados no console. Pronto para enviar pro Supabase.");
  };

  return (
    <div className="p-10 pb-32 font-sans">
      <form onSubmit={handleSalvar} className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* COLUNA DA ESQUERDA: CONTEÚDO (75%) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Alerta de Erro */}
          {erro && (
            <div className="bg-red-50 text-red-500 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold">
              <AlertCircle size={20} />
              {erro}
            </div>
          )}

          {/* TÍTULO E SLUG */}
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
                placeholder="slug-da-noticia"
                required
              />
            </div>
          </div>

          {/* AUTOR E CATEGORIA (Autocomplete) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col gap-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <User size={12} /> Autor
              </label>
              <input 
                list="autores" 
                value={autor} 
                onChange={(e) => setAutor(e.target.value)}
                placeholder="Selecione ou digite o autor..."
                className="w-full text-sm outline-none font-bold text-ipa-escuro"
                required
              />
              <datalist id="autores">
                <option value="Italo Ribeiro" />
                <option value="Equipe de Redação" />
                <option value="Colaborador Externo" />
              </datalist>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col gap-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <Folder size={12} /> Categoria
              </label>
              <input 
                list="categorias" 
                value={categoria} 
                onChange={(e) => setCategoria(e.target.value)}
                placeholder="Selecione ou digite a categoria..."
                className="w-full text-sm outline-none font-bold text-ipa-escuro"
                required
              />
              <datalist id="categorias">
                <option value="Teologia Reformada" />
                <option value="Eventos da Igreja" />
                <option value="Estudos Bíblicos" />
                <option value="Avisos" />
              </datalist>
            </div>
          </div>
          
          {/* EDITOR TIPTAP */}
          <EditorNoticia value={conteudo} onChange={setConteudo} />

          {/* CAMPOS DE SEO */}
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
                    placeholder="Título que aparece no Google..."
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
                  placeholder="Resumo da notícia que aparece na busca do Google (máx 160 caracteres)..."
                  className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none text-sm h-[120px] resize-none"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* COLUNA DA DIREITA: SIDEBAR (25%) */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6 sticky top-10">
            
            {/* BOTÕES DE AÇÃO */}
            <div className="space-y-4">
               <button type="submit" className="w-full bg-ipa-verde text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-ipa-escuro transition-all shadow-lg shadow-ipa-verde/20 active:scale-95">
                 <Save size={18} /> Publicar Notícia
               </button>
            </div>

            <hr className="border-gray-50" />

            {/* STATUS */}
           {/* STATUS */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Status da Publicação</label>
              <select 
                value={status} 
                onChange={(e) => setStatus(Number(e.target.value))}
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none font-bold text-ipa-escuro"
                required
              >
                <option value="" disabled>Selecione o status...</option>
                {/* Renderiza as opções dinamicamente baseadas nas suas constantes */}
                {Object.entries(POST_STATUS_LABEL).map(([valor, { texto }]) => (
                  <option key={valor} value={valor}>
                    {texto}
                  </option>
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

            {/* IMAGEM DE CAPA */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <ImageIcon size={14} /> Link Imagem de Capa
              </label>
              <input 
                type="url" 
                value={imagemCapa}
                onChange={(e) => setImagemCapa(e.target.value)}
                placeholder="https://..." 
                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:outline-none" 
                required
              />
              {imagemCapa && (
                <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                  <img src={imagemCapa} alt="Preview da Capa" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* VÍDEO YOUTUBE */}
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
                required
              />
            </div>

            {/* STATUS E DESTAQUE */}
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