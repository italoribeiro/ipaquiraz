// src/app/admin/categorias/page.tsx
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";

export const dynamic = 'force-dynamic';

// Inicia o Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function CategoriasPage() {
  // Busca todas as categorias em ordem alfabética
  const { data: categorias } = await supabase
    .from("site_sermoes_categorias")
    .select("*")
    .order("nome");

  return (
    <div className="p-10">
      {/* Cabeçalho da Página */}
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-ipa-verde uppercase tracking-tighter">Categorias</h1>
          <p className="text-gray-500 font-medium mt-2">Gerencie os temas e séries de mensagens.</p>
        </div>
        <Link 
          href="/admin/categorias/novo" 
          className="bg-ipa-dourado hover:bg-yellow-600 text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-sm flex items-center gap-2 transition-colors"
        >
          <Plus size={18} /> Nova Categoria
        </Link>
      </header>

      {/* Tabela de Dados */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-widest text-gray-500">
              <th className="p-4 font-bold">Nome da Categoria</th>
              <th className="p-4 font-bold">Slug (URL Amigável)</th>
            </tr>
          </thead>
          <tbody>
            {/* Usando função normal no map conforme sua preferência */}
            {categorias?.map(function (categoria) {
              return (
                <tr key={categoria.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 font-bold text-ipa-escuro">{categoria.nome}</td>
                  <td className="p-4 text-gray-400 font-mono text-sm">{categoria.slug}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {(!categorias || categorias.length === 0) && (
          <div className="p-10 text-center text-gray-400 font-medium">
            Nenhuma categoria cadastrada ainda. Clique em "Nova Categoria" para começar.
          </div>
        )}
      </div>
    </div>
  );
}