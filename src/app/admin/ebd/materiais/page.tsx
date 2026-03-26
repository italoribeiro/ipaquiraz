// src/app/admin/ebd/materiais/page.tsx
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { 
  Plus, Search, Edit, Trash2, FileDown, 
  PlayCircle, Headphones, Link2, ChevronLeft, ChevronRight, ExternalLink 
} from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ListaMateriaisEBD() {
  const [materiais, setMateriais] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");
  
  // Estados para Paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 8;

  async function carregarDados() {
    setCarregando(true);
    const { data, error } = await supabase
      .from("site_ebd_materiais")
      .select(`*, site_ebd_categorias(nome)`)
      .order("created_at", { ascending: false });

    if (data) setMateriais(data);
    setCarregando(false);
  }

  useEffect(() => {
    carregarDados();
  }, []);

  // Lógica de Filtro
  const materiaisFiltrados = materiais.filter(item => 
    item.titulo.toLowerCase().includes(busca.toLowerCase()) ||
    item.autor?.toLowerCase().includes(busca.toLowerCase()) ||
    item.site_ebd_categorias?.nome.toLowerCase().includes(busca.toLowerCase())
  );

  // Lógica de Paginação
  const totalPaginas = Math.ceil(materiaisFiltrados.length / itensPorPagina);
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const itensExibidos = materiaisFiltrados.slice(inicio, fim);

  async function excluir(id: string) {
    if (!confirm("Deseja realmente excluir este material?")) return;
    const { error } = await supabase.from("site_ebd_materiais").delete().eq("id", id);
    if (!error) carregarDados();
  }

  const IconeMidia = ({ tipo }: { tipo: string }) => {
    switch (tipo) {
      case 'video': return <PlayCircle size={18} className="text-red-400" />;
      case 'audio': return <Headphones size={18} className="text-blue-400" />;
      case 'link': return <Link2 size={18} className="text-orange-400" />;
      default: return <FileDown size={18} className="text-ipa-verde" />;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-black text-ipa-verde uppercase tracking-tighter">Biblioteca de Recursos</h1>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Gestão de Materiais e EBD</p>
        </div>
        <Link 
          href="/admin/ebd/materiais/novo" 
          className="bg-ipa-verde hover:bg-ipa-escuro text-white px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest flex items-center gap-2 transition-all shadow-lg"
        >
          <Plus size={18} /> Novo Recurso
        </Link>
      </div>

      {/* BARRA DE PESQUISA */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-8 flex items-center gap-4">
        <div className="flex-1 flex items-center bg-gray-50 rounded-xl px-4 border border-transparent focus-within:border-ipa-dourado transition-all">
          <Search size={18} className="text-gray-300" />
          <input 
            type="text"
            placeholder="Pesquisar por título, autor ou categoria..."
            className="w-full p-4 bg-transparent border-none focus:ring-0 text-sm font-medium"
            value={busca}
            onChange={(e) => { setBusca(e.target.value); setPaginaAtual(1); }}
          />
        </div>
        <div className="hidden md:block text-[10px] font-black uppercase text-gray-400 px-4 border-l border-gray-100">
          {materiaisFiltrados.length} Recursos Encontrados
        </div>
      </div>

      {/* TABELA */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Mídia</th>
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Recurso / Autor</th>
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Categoria</th>
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Cliques</th>
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {carregando ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center text-xs font-bold uppercase text-gray-300 tracking-widest animate-pulse">
                    Carregando Biblioteca...
                  </td>
                </tr>
              ) : itensExibidos.length > 0 ? (
                itensExibidos.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-5">
                      <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center group-hover:bg-white transition-colors">
                        <IconeMidia tipo={item.tipo_midia} />
                      </div>
                    </td>
                    <td className="p-5">
                      <p className="font-bold text-ipa-verde uppercase text-sm leading-tight mb-1">{item.titulo}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{item.autor || "Autor não informado"}</p>
                    </td>
                    <td className="p-5">
                      <span className="inline-block bg-ipa-creme text-ipa-verde text-[9px] font-black uppercase px-3 py-1 rounded-full tracking-tighter">
                        {item.site_ebd_categorias?.nome || "Sem categoria"}
                      </span>
                    </td>
                    <td className="p-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-ipa-escuro">{item.cliques || 0}</span>
                        <span className="text-[8px] font-black text-gray-300 uppercase">Acessos</span>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex justify-end items-center gap-2">
                        <a href={item.url_recurso} target="_blank" className="p-2 text-gray-300 hover:text-ipa-dourado transition-colors" title="Visualizar Link">
                          <ExternalLink size={18} />
                        </a>
                        <Link href={`/admin/ebd/materiais/editar/${item.id}`} className="p-2 text-gray-300 hover:text-ipa-verde transition-colors" title="Editar">
                          <Edit size={18} />
                        </Link>
                        <button onClick={() => excluir(item.id)} className="p-2 text-gray-300 hover:text-red-500 transition-colors cursor-pointer" title="Excluir">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-20 text-center text-gray-400 italic text-sm">
                    Nenhum material encontrado com os termos pesquisados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINAÇÃO */}
        {totalPaginas > 1 && (
          <div className="bg-gray-50/50 p-6 border-t border-gray-100 flex items-center justify-between">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Página {paginaAtual} de {totalPaginas}
            </span>
            <div className="flex items-center gap-2">
              <button 
                disabled={paginaAtual === 1}
                onClick={() => setPaginaAtual(prev => prev - 1)}
                className="p-2 rounded-lg border border-gray-200 bg-white text-gray-400 hover:text-ipa-verde disabled:opacity-30 transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                disabled={paginaAtual === totalPaginas}
                onClick={() => setPaginaAtual(prev => prev + 1)}
                className="p-2 rounded-lg border border-gray-200 bg-white text-gray-400 hover:text-ipa-verde disabled:opacity-30 transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}