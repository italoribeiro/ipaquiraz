// src/app/(site)/ensino/biblioteca/page.tsx
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { 
  Search, FileText, Download, PlayCircle, Headphones, 
  Link2, ExternalLink, Filter, ArrowLeft, Eye 
} from "lucide-react";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function BibliotecaCompleta() {
  const [materiais, setMateriais] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  // Estados dos Filtros
  const [busca, setBusca] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("todas");
  const [midiaFiltro, setMidiaFiltro] = useState("todas");

  useEffect(() => {
    async function carregarAcervo() {
      // 1. Busca Categorias
      const { data: cats } = await supabase.from("site_ebd_categorias").select("*").order("ordem");
      if (cats) setCategorias(cats);

      // 2. Busca Materiais (Ativos, do mais recente pro mais antigo)
      const { data: mats } = await supabase
        .from("site_ebd_materiais")
        .select(`*, site_ebd_categorias(nome)`)
        .eq("ativo", true)
        .order("created_at", { ascending: false });
      
      if (mats) setMateriais(mats);
      setCarregando(false);
    }
    carregarAcervo();
  }, []);

  // Lógica de Filtragem Dinâmica
  const materiaisFiltrados = materiais.filter(m => {
    const matchBusca = m.titulo.toLowerCase().includes(busca.toLowerCase()) || (m.autor && m.autor.toLowerCase().includes(busca.toLowerCase()));
    const matchCategoria = categoriaFiltro === "todas" || m.categoria_id === categoriaFiltro;
    const matchMidia = midiaFiltro === "todas" || m.tipo_midia === midiaFiltro;
    return matchBusca && matchCategoria && matchMidia;
  });

  // Registra o clique para estatísticas com regra Anti-Spam (LocalStorage)
  const registrarClique = async (id: string) => {
    // 1. Verifica se a pessoa já clicou
    const jaClicados = JSON.parse(localStorage.getItem('@ipa_cliques_ebd') || '[]');

    if (jaClicados.includes(id)) {
      console.log("Visualização repetida. Não contada no banco.");
      return; 
    }

    // 2. Se for novo, salva no navegador
    jaClicados.push(id);
    localStorage.setItem('@ipa_cliques_ebd', JSON.stringify(jaClicados));

    // 3. Atualiza o número na tela imediatamente
    setMateriais(prev => prev.map(m => m.id === id ? { ...m, cliques: (m.cliques || 0) + 1 } : m));
    
    // 4. Manda pro banco de dados
    await supabase.rpc('increment_clique_recurso', { row_id: id });
  };

  const getIconeMidia = (tipo: string) => {
    switch(tipo) {
      case 'video': return <PlayCircle size={20} className="text-red-400 group-hover:scale-110 transition-transform" />;
      case 'audio': return <Headphones size={20} className="text-blue-400 group-hover:scale-110 transition-transform" />;
      case 'link': return <Link2 size={20} className="text-orange-400 group-hover:scale-110 transition-transform" />;
      default: return <FileText size={20} className="text-ipa-bege group-hover:scale-110 transition-transform" />;
    }
  };

  return (
    <div className="flex flex-col w-full font-sans bg-[#f9f9f9] min-h-screen">
      
      {/* HEADER DA PÁGINA */}
      <section className="bg-ipa-verde py-16 px-6 text-white border-b-8 border-ipa-dourado">
        <div className="max-w-7xl mx-auto">
          <Link href="/ensino" className="inline-flex items-center gap-2 text-ipa-dourado hover:text-white transition-colors text-xs font-black uppercase tracking-widest mb-6">
            <ArrowLeft size={16} /> Voltar para Ensino
          </Link>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">
            Acervo de <span className="text-ipa-dourado">Recursos</span>
          </h1>
          <p className="text-white/70 text-lg font-medium max-w-2xl">
            Explore nossa biblioteca completa. Utilize os filtros abaixo para encontrar estudos, apostilas, vídeos e áudios para sua edificação.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* BARRA LATERAL (FILTROS) */}
        <aside className="lg:col-span-3 space-y-8">
          
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-6 sticky top-24">
            <div className="flex items-center gap-2 text-ipa-verde border-b border-gray-100 pb-4">
              <Filter size={20} />
              <h3 className="font-black uppercase tracking-widest text-sm">Filtros</h3>
            </div>

            {/* Busca */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pesquisar</label>
              <div className="flex items-center bg-gray-50 rounded-xl px-4 border border-gray-200 focus-within:border-ipa-dourado transition-colors">
                <Search size={16} className="text-gray-400" />
                <input 
                  type="text"
                  placeholder="Título ou autor..."
                  className="w-full p-3 bg-transparent border-none focus:ring-0 text-sm font-medium"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
              </div>
            </div>

            {/* Categoria */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Categoria</label>
              <select 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-ipa-verde focus:ring-1 focus:ring-ipa-dourado"
                value={categoriaFiltro}
                onChange={(e) => setCategoriaFiltro(e.target.value)}
              >
                <option value="todas">Todas as Categorias</option>
                {categorias.map(c => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </select>
            </div>

            {/* Tipo de Mídia */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Formato</label>
              <select 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-ipa-verde focus:ring-1 focus:ring-ipa-dourado"
                value={midiaFiltro}
                onChange={(e) => setMidiaFiltro(e.target.value)}
              >
                <option value="todas">Todos os Formatos</option>
                <option value="arquivo">📄 Documentos (PDF/Doc)</option>
                <option value="video">🎥 Vídeos</option>
                <option value="audio">🎧 Áudios</option>
                <option value="link">🔗 Links Externos</option>
              </select>
            </div>

            {/* Resetar Filtros */}
            {(busca !== "" || categoriaFiltro !== "todas" || midiaFiltro !== "todas") && (
              <button 
                onClick={() => { setBusca(""); setCategoriaFiltro("todas"); setMidiaFiltro("todas"); }}
                className="w-full py-3 text-[10px] font-black uppercase tracking-widest text-red-400 hover:bg-red-50 rounded-xl transition-colors"
              >
                Limpar Filtros
              </button>
            )}
          </div>

        </aside>

        {/* ÁREA DE CONTEÚDO (GRID DE MATERIAIS) */}
        <div className="lg:col-span-9">
          
          <div className="mb-6 flex justify-between items-end">
            <h2 className="text-xl font-black text-ipa-verde uppercase tracking-tighter">Resultados</h2>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{materiaisFiltrados.length} materiais</span>
          </div>

          {carregando ? (
            <div className="py-20 text-center flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-ipa-creme border-t-ipa-verde rounded-full animate-spin"></div>
              <span className="text-xs font-black uppercase text-ipa-verde tracking-widest">Carregando Acervo...</span>
            </div>
          ) : materiaisFiltrados.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {materiaisFiltrados.map((item) => (
                <div key={item.id} className="flex flex-col p-6 bg-white rounded-3xl border border-gray-200 hover:border-ipa-verde transition-all group shadow-sm hover:shadow-xl">
                  
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-ipa-creme text-ipa-verde px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border border-ipa-bege/30">
                      {item.site_ebd_categorias?.nome || 'Estudo'}
                    </span>
                    <div className="flex items-center gap-1.5 text-gray-400 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                      <Eye size={12} className="text-ipa-dourado" />
                      <span className="text-[10px] font-black">{item.cliques || 0}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 mb-6 flex-1">
                    <div className="mt-1 bg-gray-50 p-3 rounded-xl border border-gray-100 flex-shrink-0">
                      {getIconeMidia(item.tipo_midia)}
                    </div>
                    <div>
                      <h3 className="text-base font-black text-ipa-verde uppercase tracking-tight leading-tight mb-2">
                        {item.titulo}
                      </h3>
                      <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest">
                        {item.autor || 'IP Aquiraz'}
                      </p>
                    </div>
                  </div>

                  <a 
                    href={item.url_recurso} 
                    target={item.comportamento} 
                    onClick={() => registrarClique(item.id)}
                    className="flex items-center justify-center gap-2 w-full p-4 bg-gray-50 rounded-xl text-ipa-verde hover:bg-ipa-verde hover:text-white transition-all font-black text-xs uppercase tracking-widest border border-gray-100 hover:border-ipa-verde"
                    title="Acessar"
                  >
                    Acessar Material
                    {item.tipo_midia === 'arquivo' ? <Download size={16} /> : <ExternalLink size={16} />}
                  </a>

                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-200 p-20 text-center flex flex-col items-center">
              <Search size={48} className="text-gray-200 mb-4" />
              <h3 className="text-lg font-black text-ipa-verde uppercase tracking-tighter mb-2">Nenhum material encontrado</h3>
              <p className="text-sm text-gray-400 font-medium">Tente ajustar seus filtros ou mudar os termos da pesquisa.</p>
            </div>
          )}

        </div>

      </main>
    </div>
  );
}