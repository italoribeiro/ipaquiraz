// src/app/admin/ebd/materiais/novo/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { 
  Save, ArrowLeft, Globe, Hash, FileDown, 
  PlayCircle, Headphones, Link2, Monitor, Search, ChevronRight
} from "lucide-react";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function NovoMaterialEBD() {
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);
  
  // Estados para Autocomplete de Categorias
  const [categorias, setCategorias] = useState<any[]>([]);
  const [queryCategoria, setQueryCategoria] = useState("");
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);

  // Estado do Formulário
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
    async function getCats() {
      const { data } = await supabase.from("site_ebd_categorias").select("*").order("nome");
      if (data) setCategorias(data);
    }
    getCats();
  }, []);

  const categoriasFiltradas = queryCategoria === "" 
    ? categorias 
    : categorias.filter(c => c.nome.toLowerCase().includes(queryCategoria.toLowerCase()));

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    if(!form.categoria_id) return alert("Selecione uma categoria!");
    setCarregando(true);
    const { error } = await supabase.from("site_ebd_materiais").insert([form]);
    if (!error) router.push("/admin/ebd/materiais");
    else { alert(error.message); setCarregando(false); }
  }

  return (
    <div className="min-h-screen bg-[#f0f0f1] pb-20">
      {/* BARRA DE TOPO TIPO WORDPRESS */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/ebd/materiais" className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl font-bold text-ipa-escuro">Adicionar Novo Recurso</h1>
        </div>
        <button 
          onClick={salvar}
          disabled={carregando}
          className="bg-ipa-verde hover:bg-ipa-escuro text-white px-8 py-2.5 rounded-lg font-bold uppercase text-xs tracking-widest flex items-center gap-2 transition-all shadow-md disabled:opacity-50"
        >
          {carregando ? "Publicando..." : <><Save size={16} /> Publicar</>}
        </button>
      </header>

      <main className="max-w-[1400px] mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
        
        {/* COLUNA DA ESQUERDA (CONTEÚDO PRINCIPAL) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Box Título */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <input 
              required
              type="text"
              placeholder="Digite o título aqui"
              className="w-full text-3xl font-black text-ipa-verde placeholder:text-gray-300 border-none focus:ring-0 p-0 mb-4"
              value={form.titulo}
              onChange={e => setForm({...form, titulo: e.target.value})}
            />
            <input 
              type="text"
              placeholder="Subtítulo ou breve descrição do recurso..."
              className="w-full text-lg font-medium text-gray-400 placeholder:text-gray-200 border-none focus:ring-0 p-0"
              value={form.subtitulo}
              onChange={e => setForm({...form, subtitulo: e.target.value})}
            />
          </div>

          {/* Box URL e Autor */}
          <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-6">
            <h3 className="text-sm font-black text-ipa-verde uppercase tracking-widest border-b border-gray-100 pb-4">Dados do Recurso</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">URL Final do Recurso (Download/Link)</label>
                <div className="flex items-center bg-gray-50 rounded-lg px-4 border border-gray-100 focus-within:border-ipa-dourado transition-all">
                  <Link2 size={18} className="text-gray-300" />
                  <input 
                    type="url"
                    placeholder="https://drive.google.com/..."
                    className="w-full p-4 bg-transparent border-none focus:ring-0 text-sm"
                    value={form.url_recurso}
                    onChange={e => setForm({...form, url_recurso: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Autor / Pregador</label>
                <input 
                  type="text"
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-lg focus:ring-1 focus:ring-ipa-dourado text-sm"
                  value={form.autor}
                  onChange={e => setForm({...form, autor: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Box SEO */}
          <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-ipa-dourado border-b border-gray-100 pb-4">
              <Globe size={18} />
              <h3 className="text-sm font-black uppercase tracking-widest">Configurações de SEO</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">SEO Título (Aparece no Google)</label>
                <input 
                  type="text"
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-lg text-sm"
                  value={form.seo_titulo}
                  onChange={e => setForm({...form, seo_titulo: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Meta Descrição</label>
                <textarea 
                  rows={3}
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-lg text-sm"
                  value={form.seo_descricao}
                  onChange={e => setForm({...form, seo_descricao: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 mb-2">Tags / Keywords (Separadas por vírgula)</label>
                <div className="flex items-center bg-gray-50 rounded-lg px-4 border border-gray-100">
                  <Hash size={16} className="text-gray-300" />
                  <input 
                    type="text"
                    className="w-full p-4 bg-transparent border-none focus:ring-0 text-sm"
                    value={form.tags}
                    onChange={e => setForm({...form, tags: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COLUNA DA DIREITA (SIDEBAR) */}
        <aside className="lg:col-span-4 space-y-6">
          
          {/* Box Tipo de Mídia (Ícones Minimalistas) */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-[10px] font-black uppercase text-gray-400 mb-4 tracking-widest">Tipo de Conteúdo</h3>
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

          {/* Box Categoria (Autocomplete) */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative">
            <h3 className="text-[10px] font-black uppercase text-gray-400 mb-4 tracking-widest">Categoria EBD</h3>
            <div className="relative">
              <div className="flex items-center bg-gray-50 rounded-lg px-3 border border-gray-100">
                <Search size={16} className="text-gray-300" />
                <input 
                  type="text"
                  placeholder="Buscar categoria..."
                  className="w-full p-3 bg-transparent border-none focus:ring-0 text-sm"
                  value={queryCategoria}
                  onChange={(e) => {
                    setQueryCategoria(e.target.value);
                    setMostrarSugestoes(true);
                  }}
                  onFocus={() => setMostrarSugestoes(true)}
                />
              </div>

              {mostrarSugestoes && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                  {categoriasFiltradas.length > 0 ? (
                    categoriasFiltradas.map(cat => (
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
                    ))
                  ) : (
                    <div className="p-3 text-xs text-gray-400 italic">Nenhuma categoria encontrada</div>
                  )}
                </div>
              )}
            </div>
            {form.categoria_id && !mostrarSugestoes && (
              <div className="mt-3 flex items-center gap-2 text-[10px] font-bold text-ipa-verde bg-ipa-creme px-3 py-1 rounded-full w-fit">
                Selecionado: {queryCategoria}
              </div>
            )}
          </div>

          {/* Box Comportamento */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-[10px] font-black uppercase text-gray-400 mb-4 tracking-widest">Comportamento do Link</h3>
            <select 
              className="w-full p-3 bg-gray-50 border-none rounded-lg text-xs font-bold text-ipa-escuro focus:ring-1 focus:ring-ipa-dourado"
              value={form.comportamento}
              onChange={e => setForm({...form, comportamento: e.target.value})}
            >
              <option value="_blank">Abrir em Nova Aba</option>
              <option value="_self">Mesma Janela</option>
              <option value="modal">Abrir em Modal (Recomendado p/ Vídeo)</option>
            </select>
          </div>

        </aside>
      </main>
    </div>
  );
}