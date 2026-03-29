import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { Plus, Pencil, Trash2, Folder, ChevronLeft, ChevronRight, Hash } from "lucide-react";

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const LIMIT = 10;

export default async function CategoriasPage({ searchParams }: { searchParams: Promise<any> | any }) {
  const params = await searchParams;
  const page = Number(params?.page) || 1;
  const from = (page - 1) * LIMIT;
  const to = from + LIMIT - 1;

  // Busca as categorias com contagem total
  const { data: categorias, count, error } = await supabase
    .from("site_post_categories")
    .select("*", { count: 'exact' })
    .order("nome", { ascending: true })
    .range(from, to);

  const totalPages = Math.ceil((count || 0) / LIMIT);

  return (
    <div className="p-10 pb-24">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-ipa-verde uppercase tracking-tighter flex items-center gap-2">
            <Folder size={32} /> Categorias
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Gerencie as tags e classificações das suas notícias.
          </p>
        </div>

        <Link 
          href="/admin/posts/categorias/novo" 
          className="bg-ipa-verde hover:bg-ipa-escuro text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-sm flex items-center gap-2 transition-all shadow-md active:scale-95"
        >
          <Plus size={18} /> Nova Categoria
        </Link>
      </header>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-[10px] uppercase tracking-[0.2em] text-gray-400">
              <th className="p-4 font-black">Nome / Slug</th>
              <th className="p-4 font-black">Descrição</th>
              <th className="p-4 font-black text-center">ID / UUID</th>
              <th className="p-4 font-black text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {!categorias || categorias.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-10 text-center text-gray-400 font-bold uppercase text-xs tracking-widest">
                  Nenhuma categoria cadastrada.
                </td>
              </tr>
            ) : (
              categorias.map((cat) => (
                <tr key={cat.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-ipa-escuro">{cat.nome}</span>
                      <span className="text-[10px] text-ipa-verde font-mono">/{cat.slug}</span>
                    </div>
                  </td>
                  <td className="p-4 max-w-xs">
                    <span className="text-xs text-gray-500 line-clamp-1">{cat.descricao || "—"}</span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="inline-flex items-center gap-1 text-[10px] font-mono text-gray-300 bg-gray-50 px-2 py-1 rounded">
                      <Hash size={10} /> {cat.id.slice(0, 8)}...
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        href={`/admin/posts/categorias/editar/${cat.id}`} 
                        className="p-2 bg-gray-50 text-gray-400 hover:bg-ipa-dourado hover:text-white rounded-lg transition-all"
                      >
                        <Pencil size={16} />
                      </Link>
                      {/* O botão de excluir aqui precisaria de um Client Component para o confirm, ou você pode manter o link para uma página de confirmação */}
                      <button className="p-2 bg-gray-50 text-gray-400 hover:bg-red-500 hover:text-white rounded-lg transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* PAGINAÇÃO */}
        {totalPages > 1 && (
          <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Página {page} de {totalPages}
            </p>
            <div className="flex gap-1">
              {page > 1 && (
                <Link href={`/admin/posts/categorias?page=${page - 1}`} className="p-2 bg-white border border-gray-200 rounded-lg hover:text-ipa-verde">
                  <ChevronLeft size={20} />
                </Link>
              )}
              {page < totalPages && (
                <Link href={`/admin/posts/categorias?page=${page + 1}`} className="p-2 bg-white border border-gray-200 rounded-lg hover:text-ipa-verde">
                  <ChevronRight size={20} />
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}