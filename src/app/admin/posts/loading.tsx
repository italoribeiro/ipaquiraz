import { Newspaper, Loader2 } from "lucide-react";

export default function LoadingPosts() {
  return (
    <div className="p-10 animate-pulse">
      <header className="flex justify-between items-center mb-10">
        <div className="h-10 w-64 bg-gray-200 rounded-lg"></div>
        <div className="h-12 w-40 bg-gray-200 rounded-xl"></div>
      </header>

      {/* Esqueleto da Barra de Busca */}
      <div className="h-16 w-full bg-white rounded-2xl border border-gray-100 mb-6"></div>

      {/* Tabela "Fantasma" (Skeleton) */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="h-12 bg-gray-50 border-b border-gray-100"></div>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="p-6 border-b border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-10 bg-gray-100 rounded-lg"></div>
              <div className="h-4 w-48 bg-gray-100 rounded"></div>
            </div>
            <div className="h-6 w-20 bg-gray-50 rounded-full"></div>
            <div className="h-8 w-16 bg-gray-50 rounded-lg"></div>
          </div>
        ))}
      </div>
      
      <div className="mt-10 flex justify-center items-center gap-2 text-ipa-verde font-bold uppercase text-xs tracking-widest">
        <Loader2 className="animate-spin" size={20} /> Carregando base de notícias...
      </div>
    </div>
  );
}