// src/app/admin/ebd/categorias/page.tsx
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { 
  Plus, Search, Edit, Trash2, ChevronLeft, ChevronRight, 
  Hash, ListOrdered, Filter 
} from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ListaCategoriasEBD() {
  const [categorias, setCategorias] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");
  
  // Paginação (10 registros)
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;

  async function carregarCategorias() {
    setCarregando(true);
    const { data } = await supabase
      .from("site_ebd_categorias")
      .select("*")
      .order("ordem", { ascending: true });
    
    if (data) setCategorias(data);
    setCarregando(false);
  }

  useEffect(() => { carregarCategorias(); }, []);

  // Filtro
  const filtradas = categorias.filter(c => 
    c.nome.toLowerCase().includes(busca.toLowerCase())
  );

  // Lógica de Paginação
  const totalPaginas = Math.ceil(filtradas.length / itensPorPagina);
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const itensExibidos = filtradas.slice(inicio, fim);

  async function excluir(id: string) {
    if (!confirm("⚠️ Atenção: Isso pode afetar os materiais desta categoria. Confirmar exclusão?")) return;
    const { error } = await supabase.from("site_ebd_categorias").delete().eq("id", id);
    if (!error) carregarCategorias();
  }

  return (
    <div className="min-h-screen bg-[#f0f0f1]">
      {/* HEADER FIXO ESTILO WP */}
      <header className="bg-white border-b border-gray-200 px-8 py-5 sticky top-0 z-30 flex items-center justify-between shadow-sm">
        <div>
          <h1 className="text-xl font-black text-ipa-verde uppercase tracking-tighter">Categorias de Ensino</h1>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Gestão de Taxonomia da EBD</p>
        </div>
        
        <Link 
          href="/admin/ebd/categorias/novo" 
          className="bg-ipa-dourado hover:bg-yellow-700 text-white px-8 py-3 rounded-lg font-black uppercase text-[10px] tracking-[0.2em] flex items-center gap-2 transition-all shadow-md"
        >
          <Plus size={16} /> Nova Categoria
        </Link>
      </header>

      <main className="p-8 space-y-8">
        {/* BARRA DE PESQUISA (CARD FULL WIDTH) */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="flex-1 flex items-center bg-gray-50 rounded-lg px-4 border border-transparent focus-within:border-ipa-dourado transition-all">
            <Search size={18} className="text-gray-300" />
            <input 
              type="text"
              placeholder="Pesquisar categoria por nome..."
              className="w-full p-4 bg-transparent border-none focus:ring-0 text-sm font-medium"
              value={busca}
              onChange={(e) => { setBusca(e.target.value); setPaginaAtual(1); }}
            />
          </div>
          <div className="px-6 border-l border-gray-100 hidden md:flex items-center gap-2 text-[10px] font-black uppercase text-gray-400">
            <Filter size={14} /> {filtradas.length} Total
          </div>
        </div>

        {/* TABELA DE CATEGORIAS */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest w-24 text-center">Ordem</th>
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Nome da Categoria</th>
                <th className="p-5 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {carregando ? (
                <tr>
                  <td colSpan={3} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-4 border-ipa-creme border-t-ipa-verde rounded-full animate-spin"></div>
                        <span className="text-[10px] font-black uppercase text-gray-300 tracking-widest">Buscando Categorias...</span>
                    </div>
                  </td>
                </tr>
              ) : itensExibidos.length > 0 ? (
                itensExibidos.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-5 text-center">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-ipa-creme text-ipa-verde font-black text-xs border border-ipa-verde/10 shadow-sm">
                        #{cat.ordem}
                      </span>
                    </td>
                    <td className="p-5">
                      <p className="font-bold text-ipa-verde uppercase text-sm tracking-tight group-hover:translate-x-1 transition-transform">{cat.nome}</p>
                    </td>
                    <td className="p-5">
                      <div className="flex justify-end items-center gap-3">
                        <Link 
                          href={`/admin/ebd/categorias/editar/${cat.id}`} 
                          className="p-2 text-gray-300 hover:text-ipa-verde hover:bg-white rounded-lg transition-all"
                          title="Editar"
                        >
                          <Edit size={18} />
                        </Link>
                        <button 
                          onClick={() => excluir(cat.id)} 
                          className="p-2 text-gray-300 hover:text-red-500 hover:bg-white rounded-lg transition-all cursor-pointer"
                          title="Excluir"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="p-20 text-center text-gray-400 text-xs font-bold uppercase tracking-widest">
                    Nenhuma categoria encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* RODAPÉ COM PAGINAÇÃO (DENTRO DO CARD DA TABELA) */}
          {totalPaginas > 1 && (
            <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Exibindo {inicio + 1} a {Math.min(fim, filtradas.length)} de {filtradas.length}
              </span>
              <div className="flex items-center gap-2">
                <button 
                  disabled={paginaAtual === 1}
                  onClick={() => setPaginaAtual(p => p - 1)}
                  className="p-2 rounded-lg border border-gray-200 bg-white text-gray-400 hover:text-ipa-verde disabled:opacity-20 transition-all cursor-pointer"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="flex gap-1">
                    {[...Array(totalPaginas)].map((_, i) => (
                        <button 
                            key={i}
                            onClick={() => setPaginaAtual(i + 1)}
                            className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all ${paginaAtual === i + 1 ? 'bg-ipa-verde text-white shadow-md' : 'bg-white text-gray-400 hover:bg-gray-100'}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
                <button 
                  disabled={paginaAtual === totalPaginas}
                  onClick={() => setPaginaAtual(p => p + 1)}
                  className="p-2 rounded-lg border border-gray-200 bg-white text-gray-400 hover:text-ipa-verde disabled:opacity-20 transition-all cursor-pointer"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}