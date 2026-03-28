"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, Loader2, Filter, X } from "lucide-react";
import { useState, useTransition, useEffect } from "react";

export default function BarraBuscaPosts({ categorias }: { categorias: any[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Estados locais para os filtros
  const [busca, setBusca] = useState(searchParams.get("q") || "");
  const [categoria, setCategoria] = useState(searchParams.get("cat") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");

  // Sincroniza os campos se a URL mudar (ex: ao limpar filtros)
  useEffect(() => {
    setBusca(searchParams.get("q") || "");
    setCategoria(searchParams.get("cat") || "");
    setStatus(searchParams.get("status") || "");
  }, [searchParams]);

  function handleApplyFilters(e: React.FormEvent) {
    e.preventDefault();

    const params = new URLSearchParams();
    params.set("page", "1"); // Sempre reseta para a página 1

    if (busca.trim()) params.set("q", busca.trim());
    if (categoria) params.set("cat", categoria);
    
    // CORREÇÃO: Verifica se não é string vazia, permitindo o valor "0"
    if (status !== "" && status !== null) {
      params.set("status", status);
    }

    startTransition(() => {
      // Faz o push para a URL. O page.tsx vai capturar e filtrar no banco.
      router.push(`/admin/posts?${params.toString()}`);
    });
  }

  function limparFiltros() {
    setBusca("");
    setCategoria("");
    setStatus("");
    startTransition(() => {
      router.push(`/admin/posts`);
    });
  }

  return (
    <form 
      onSubmit={handleApplyFilters}
      className={`bg-white p-5 rounded-2xl border border-gray-100 shadow-sm mb-6 flex flex-col lg:flex-row gap-4 items-end transition-all ${isPending ? 'opacity-70 pointer-events-none' : 'opacity-100'}`}
    >
      
      {/* Busca por Texto */}
      <div className="flex-1 w-full space-y-1.5">
        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 font-sans">Pesquisar</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Título da notícia..." 
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-ipa-verde/20 transition-all text-sm font-medium"
          />
        </div>
      </div>

      {/* Categoria */}
      <div className="w-full lg:w-48 space-y-1.5">
        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 font-sans">Categoria</label>
        <select 
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-600 focus:outline-none cursor-pointer"
        >
          <option value="">Todas</option>
          {categorias?.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.nome}</option>
          ))}
        </select>
      </div>

      {/* Status */}
      <div className="w-full lg:w-48 space-y-1.5">
        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 font-sans">Status</label>
        <select 
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-600 focus:outline-none cursor-pointer"
        >
          <option value="">Todos</option>
          <option value="1">Publicados (1)</option>
          <option value="3">Pendente IA (3)</option>
          <option value="4">Rascunho (4)</option>
          <option value="0">Não Publicado (0)</option>
        </select>
      </div>

      {/* Botões de Ação */}
      <div className="flex gap-2 w-full lg:w-auto">
        {(searchParams.get("q") || searchParams.get("cat") || searchParams.get("status")) && (
          <button
            type="button"
            onClick={limparFiltros}
            className="p-2.5 bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-white rounded-xl transition-all"
            title="Limpar Filtros"
          >
            <X size={20} />
          </button>
        )}
        
        <button 
          type="submit"
          disabled={isPending}
          className="flex-1 lg:flex-none bg-ipa-verde hover:bg-ipa-escuro text-white px-8 py-2.5 rounded-xl font-bold uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50"
        >
          {isPending ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <Filter size={16} />
          )}
          Filtrar
        </button>
      </div>
    </form>
  );
}