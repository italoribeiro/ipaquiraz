"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter } from "lucide-react";
import { useTransition } from "react";

export default function BarraBuscaPosts({ categorias }: { categorias: any[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function handleSearch(term: string, key: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1"); // Reseta para a página 1 ao filtrar

    if (term) {
      params.set(key, term);
    } else {
      params.delete(key);
    }

    startTransition(() => {
      router.push(`/admin/posts?${params.toString()}`);
    });
  }

  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center">
      {/* Busca por Texto */}
      <div className="relative flex-1 w-full">
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${isPending ? "text-ipa-verde animate-pulse" : "text-gray-400"}`} size={18} />
        <input 
          type="text" 
          placeholder="Pesquisar por título..." 
          defaultValue={searchParams.get("q") || ""}
          onChange={(e) => handleSearch(e.target.value, "q")}
          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-ipa-verde/20 transition-all text-sm"
        />
      </div>

      {/* Filtro por Categoria */}
      <select 
        defaultValue={searchParams.get("cat") || ""}
        onChange={(e) => handleSearch(e.target.value, "cat")}
        className="w-full md:w-48 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-600 focus:outline-none"
      >
        <option value="">Todas Categorias</option>
        {categorias?.map(cat => (
          <option key={cat.id} value={cat.id}>{cat.nome}</option>
        ))}
      </select>

      {/* Filtro por Status */}
      <select 
        defaultValue={searchParams.get("status") || ""}
        onChange={(e) => handleSearch(e.target.value, "status")}
        className="w-full md:w-48 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-600 focus:outline-none"
      >
        <option value="">Todos os Status</option>
        <option value="1">Publicados (1)</option>
        <option value="3">Pendente IA (3)</option>
        <option value="4">Rascunho (4)</option>
        <option value="0">Não Publicado (0)</option>
      </select>
    </div>
  );
}