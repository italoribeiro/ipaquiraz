import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { Plus, Pencil, Trash2, Users, ChevronLeft, ChevronRight, Hash, Globe, Instagram } from "lucide-react";

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const LIMIT = 10;

export default async function AutoresPage({ searchParams }: { searchParams: Promise<any> | any }) {
  const params = await searchParams;
  const page = Number(params?.page) || 1;
  const from = (page - 1) * LIMIT;
  const to = from + LIMIT - 1;

  const { data: autores, count } = await supabase
    .from("site_post_authors")
    .select("*", { count: 'exact' })
    .order("nome", { ascending: true })
    .range(from, to);

  const totalPages = Math.ceil((count || 0) / LIMIT);

  return (
    <div className="p-10 pb-24">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-ipa-verde uppercase tracking-tighter flex items-center gap-2">
            <Users size={32} /> Autores
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Gerencie as pessoas que escrevem os artigos e notícias.
          </p>
        </div>

        <Link 
          href="/admin/posts/autores/novo" 
          className="bg-ipa-verde hover:bg-ipa-escuro text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-sm flex items-center gap-2 transition-all shadow-md active:scale-95"
        >
          <Plus size={18} /> Novo Autor
        </Link>
      </header>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-[10px] uppercase tracking-[0.2em] text-gray-400">
              <th className="p-4 font-black">Autor</th>
              <th className="p-4 font-black">Bio</th>
              <th className="p-4 font-black text-center">Redes</th>
              <th className="p-4 font-black text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {!autores || autores.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-10 text-center text-gray-400 font-bold uppercase text-xs tracking-widest">
                  Nenhum autor cadastrado.
                </td>
              </tr>
            ) : (
              autores.map((autor) => (
                <tr key={autor.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 overflow-hidden shrink-0 shadow-sm">
                        <img 
                          src={autor.foto_url || `https://ui-avatars.com/api/?name=${autor.nome}`} 
                          className="w-full h-full object-cover" 
                          alt={autor.nome} 
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-ipa-escuro leading-none">{autor.nome}</span>
                        <span className="text-[9px] font-mono text-gray-300 mt-1 uppercase">ID: {autor.id.slice(0,8)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 max-w-xs">
                    <span className="text-xs text-gray-500 line-clamp-1 italic">"{autor.bio || "Sem biografia..."}"</span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      {autor.redes_social_json?.instagram && <Instagram size={14} className="text-pink-400" />}
                      {autor.redes_social_json?.site && <Globe size={14} className="text-blue-400" />}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        href={`/admin/posts/autores/editar/${autor.id}`} 
                        className="p-2 bg-gray-50 text-gray-400 hover:bg-ipa-dourado hover:text-white rounded-lg transition-all"
                      >
                        <Pencil size={16} />
                      </Link>
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
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-left">
              Página {page} de {totalPages}
            </p>
            <div className="flex gap-1">
              {page > 1 && (
                <Link href={`/admin/posts/autores?page=${page - 1}`} className="p-2 bg-white border border-gray-200 rounded-lg hover:text-ipa-verde">
                  <ChevronLeft size={20} />
                </Link>
              )}
              {page < totalPages && (
                <Link href={`/admin/posts/autores?page=${page + 1}`} className="p-2 bg-white border border-gray-200 rounded-lg hover:text-ipa-verde">
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