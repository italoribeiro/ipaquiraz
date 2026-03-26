// src/app/admin/ebd/materiais/editar/[id]/page.tsx
"use client";

import { useState, useEffect, use as useReact } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { 
  Save, ArrowLeft, Globe, Hash, FileDown, 
  PlayCircle, Headphones, Link2, Search, Trash2, Layout
} from "lucide-react";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function EditarMaterialEBD({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = useReact(params);
  const router = useRouter();
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  
  // Estados para Autocomplete e Listagem
  const [categorias, setCategorias] = useState<any[]>([]);
  const [queryCategoria, setQueryCategoria] = useState("");
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);

  // Estado do Formulário (Exatamente igual ao 'Novo')
  const [form, setForm] = useState({
    titulo: "",
    subtitulo: "",
    autor: "",
    categoria_id: "",
    tipo_midia: "arquivo",
    url_recurso: "",
    comportamento: "_blank",
    seo_titulo: "",
    seo_descricao: "",
    tags: ""
  });

  useEffect(function() {
    async function carregarDados() {
      // 1. Busca todas as Categorias para o autocomplete
      const { data: cats } = await supabase.from("site_ebd_categorias").select("*").order("nome");
      if (cats) setCategorias(cats);

      // 2. Busca os dados do Material específico
      const { data: material, error } = await supabase
        .from("site_ebd_materiais")
        .select(`*, site_ebd_categorias(nome)`)
        .eq("id", resolvedParams.id)
        .single();
      
      if (material) {
        setForm({
          titulo: material.titulo,
          subtitulo: material.subtitulo || "",
          autor: material.autor || "",
          categoria_id: material.categoria_id,
          tipo_midia: material.tipo_midia,
          url_recurso: material.url_recurso,
          comportamento: material.comportamento,
          seo_titulo: material.seo_titulo || "",
          seo_descricao: material.seo_descricao || "",
          tags: material.tags || ""
        });
        setQueryCategoria(material.site_ebd_categorias?.nome || "");
      }
      setCarregando(false);
    }
    carregarDados();
  }, [resolvedParams.id]);

  const categoriasFiltradas = queryCategoria === "" 
    ? categorias 
    : categorias.filter(c => c.nome.toLowerCase().includes(queryCategoria.toLowerCase()));

  async function salvarAlteracoes(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    
    const { error } = await supabase
      .from("site_ebd_materiais")
      .update(form)
      .eq("id", resolvedParams.id);

    if (!error) {
      router.push("/admin/ebd/materiais");
      router.refresh();
    } else {
      alert("Erro ao atualizar: " + error.message);
      setSalvando(false);
    }
  }

  async function excluirRecurso() {
    if (!confirm("⚠️ ATENÇÃO: Tem certeza que deseja excluir este recurso permanentemente?")) return;
    
    const { error } = await supabase
      .from("site_ebd_materiais")
      .delete()
      .eq("id", resolvedParams.id);

    if (!error) {
      router.push("/admin/ebd/materiais");
      router.refresh();
    }
  }

  if (carregando) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-ipa-verde/20 rounded-full"></div>
          <span className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em]">Carregando Recurso...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f0f1] pb-20">
      {/* HEADER FIXO ESTILO WP */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/admin/ebd/materiais" className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-all">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-ipa-escuro leading-none">Editar Recurso EBD</h1>
            <p className="text-[10px] text-ipa-dourado font-bold uppercase tracking-widest mt-1">ID: {resolvedParams.id}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={excluirRecurso}
            className="text-red-400 hover:text-red-600 text-[10px] font-black uppercase tracking-widest px-4 py-2 transition-all"
          >
            Excluir
          </button>
          <button 
            onClick={salvarAlteracoes}
            disabled={salvando}
            className="bg-ipa-verde hover:bg-ipa-escuro text-white px-8 py-2.5 rounded-lg font-bold uppercase text-xs tracking-widest flex items-center gap-2 transition-all shadow-md disabled:opacity-50"
          >
            {salvando ? "Salvando..." : <><Save size={16} /> Atualizar</>}
          </button>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
        
        {/* COLUNA ESQUERDA (PRINCIPAL) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Título e Subtítulo */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <input 
              required
              type="text"
              placeholder="Título do Material"
              className="w-full text-3xl font-black text-ipa-verde placeholder:text-gray-300 border-none focus:ring-0 p-0 mb-4 bg-transparent"
              value={form.titulo}
              onChange={e => setForm({...form, titulo: e.target.value})}
            />
            <input 
              type="text"
              placeholder="Breve descrição ou subtítulo..."
              className="w-full text-lg font-medium text-gray-400 placeholder:text-gray-200 border-none focus:ring-0 p-0 bg-transparent"
              value={form.subtitulo}
              onChange={e => setForm({...form, subtitulo: e.target.value})}
            />
          </div>

          {/* Dados e URL */}
          <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-8">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <Layout size={18} className="text-ipa-dourado" />
                <h3 className="text-sm font-black text-ipa-verde uppercase tracking-widest">Informações Técnicas</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">URL / Link do Arquivo</label>
                <div className="flex items-center bg-gray-50 rounded-xl px-4 border border-gray-100 focus-within:border-ipa-dourado focus-within:bg-white transition-all">
                  <Link2 size={18} className="text-gray-300" />
                  <input 
                    type="url"
                    placeholder="https://..."
                    className="w-full p-4 bg-transparent border-none focus:ring-0 text-sm font-medium"
                    value={form.url_recurso}
                    onChange={e => setForm({...form, url_recurso: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Autor do Material</label>
                <input 
                  type="text"
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-1 focus:ring-ipa-dourado text-sm"
                  value={form.autor}
                  onChange={e => setForm({...form, autor: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-ipa-dourado border-b border-gray-100 pb-4">
              <Globe size={18} />
              <h3 className="text-sm font-black uppercase tracking-widest">Otimização (SEO)</h3>
            </div>
            
            <div className="space-y-5">
              <input 
                type="text" 
                placeholder="Título SEO (Google)"
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl text-sm"
                value={form.seo_titulo}
                onChange={e => setForm({...form, seo_titulo: e.target.value})}
              />
              <textarea 
                placeholder="Meta Descrição"
                rows={3}
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl text-sm"
                value={form.seo_descricao}
                onChange={e => setForm({...form, seo_descricao: e.target.value})}
              />
              <div className="flex items-center bg-gray-50 rounded-xl px-4 border border-gray-100">
                <Hash size={16} className="text-gray-300" />
                <input 
                  type="text"
                  placeholder="Tags separadas por vírgula"
                  className="w-full p-4 bg-transparent border-none focus:ring-0 text-sm"
                  value={form.tags}
                  onChange={e => setForm({...form, tags: e.target.value})}
                />
              </div>
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA (SIDEBAR CONFIG) */}
        <aside className="lg:col-span-4 space-y-6">
          
          {/* Mídia */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-[10px] font-black uppercase text-gray-400 mb-4 tracking-widest">Tipo de Mídia</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'arquivo', label: 'PDF/Doc', icon: <FileDown size={18} /> },
                { id: 'video', label: 'Vídeo', icon: <PlayCircle size={18} /> },
                { id: 'audio', label: 'Áudio', icon: <Headphones size={18} /> },
                { id: 'link', label: 'Artigo', icon: <Link2 size={18} /> }
              ].map(tipo => (
                <button
                  key={tipo.id}
                  type="button"
                  onClick={() => setForm({...form, tipo_midia: tipo.id})}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all gap-2 ${form.tipo_midia === tipo.id ? 'border-ipa-verde bg-ipa-creme text-ipa-verde' : 'border-gray-50 text-gray-400 hover:border-gray-200'}`}
                >
                  {tipo.icon}
                  <span className="text-[9px] font-black uppercase tracking-tighter">{tipo.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Categoria com Autocomplete */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-[10px] font-black uppercase text-gray-400 mb-4 tracking-widest">Categoria</h3>
            <div className="relative">
              <div className="flex items-center bg-gray-50 rounded-lg px-3 border border-gray-100">
                <Search size={16} className="text-gray-300" />
                <input 
                  type="text"
                  placeholder="Alterar categoria..."
                  className="w-full p-3 bg-transparent border-none focus:ring-0 text-sm font-bold"
                  value={queryCategoria}
                  onChange={(e) => { setQueryCategoria(e.target.value); setMostrarSugestoes(true); }}
                  onFocus={() => setMostrarSugestoes(true)}
                />
              </div>
              {mostrarSugestoes && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-2xl max-h-48 overflow-y-auto">
                  {categoriasFiltradas.map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      className="w-full text-left p-3 text-sm hover:bg-ipa-creme hover:text-ipa-verde transition-colors border-b border-gray-50 last:border-none font-bold"
                      onClick={() => {
                        setForm({...form, categoria_id: cat.id});
                        setQueryCategoria(cat.nome);
                        setMostrarSugestoes(false);
                      }}
                    >
                      {cat.nome}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Comportamento */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-[10px] font-black uppercase text-gray-400 mb-4 tracking-widest">Ação do Link</h3>
            <select 
              className="w-full p-3 bg-gray-50 border-none rounded-lg text-xs font-bold text-ipa-escuro"
              value={form.comportamento}
              onChange={e => setForm({...form, comportamento: e.target.value})}
            >
              <option value="_blank">Abrir em Nova Aba</option>
              <option value="_self">Mesma Janela</option>
              <option value="modal">Abrir em Modal (Player)</option>
            </select>
          </div>

        </aside>
      </main>
    </div>
  );
}