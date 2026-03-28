// src/app/admin/posts/page.tsx
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { Plus, Eye, Pencil, Trash2, Newspaper, ChevronLeft, ChevronRight } from "lucide-react";
import { POST_STATUS_LABEL } from "@/lib/constants";
import BarraBuscaPosts from "./BarraBuscaPosts";

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const LIMIT = 10; // Reduzido para 10 para maior agilidade

export default async function PostsAdminPage({ 
  searchParams 
}: { 
  searchParams: Promise<any> | any 
}) {
  // 1. Aguarda os parâmetros (Essencial para performance e correção de filtros no Next.js 15)
  const params = await searchParams;
  const page = Number(params?.page) || 1;
  const statusFilter = params?.status;
  const categoryFilter = params?.cat;
  const searchQuery = params?.q;

  const from = (page - 1) * LIMIT;
  const to = from + LIMIT - 1;

  // 2. Busca Categorias e Posts em PARALELO (Mais rápido)
  const fetchCategorias = supabase.from("site_post_categories").select("id, nome").order("nome");
  
  // Prepara a query de posts
  let queryPosts = supabase
    .from("site_posts")
    .select("*, site_post_categories(nome), site_post_authors(nome)", { count: 'exact' });

  // 3. Aplicação Rigorosa de Filtros
  if (statusFilter !== undefined && statusFilter !== null && statusFilter !== "") {
    queryPosts = queryPosts.eq("status", Number(statusFilter));
  }
  
  if (categoryFilter && categoryFilter !== "") {
    queryPosts = queryPosts.eq("categoria_id", categoryFilter);
  }

  if (searchQuery && searchQuery !== "") {
    queryPosts = queryPosts.ilike("titulo", `%${searchQuery}%`);
  }

  // 4. Ordenação e Range
  queryPosts = queryPosts
    .order("publicado_em", { ascending: false })
    .range(from, to);

  const [resCategorias, resPosts] = await Promise.all([fetchCategorias, queryPosts]);

  const categorias = resCategorias.data || [];
  const posts = resPosts.data || [];
  const totalPosts = resPosts.count || 0;
  const totalPages = Math.ceil(totalPosts / LIMIT);

  return (
    <div className="p-10 pb-24">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-ipa-verde uppercase tracking-tighter flex items-center gap-2">
            <Newspaper size={32} /> Notícias e Artigos
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Exibindo <span className="text-ipa-verde font-bold">{posts.length}</span> de <span className="text-ipa-dourado font-bold">{totalPosts}</span> registros totais.
          </p>
        </div>

        <Link 
          href="/admin/posts/novo" 
          className="bg-ipa-verde hover:bg-ipa-escuro text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-sm flex items-center gap-2 transition-all shadow-md active:scale-95"
        >
          <Plus size={18} /> Nova Notícia
        </Link>
      </header>

      <BarraBuscaPosts categorias={categorias} />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-[10px] uppercase tracking-[0.2em] text-gray-400">
              <th className="p-4 font-black">Notícia</th>
              <th className="p-4 font-black">Categoria</th>
              <th className="p-4 font-black text-center">Status</th>
              <th className="p-4 font-black text-center">Acessos</th>
              <th className="p-4 font-black text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-10 text-center text-gray-400 font-bold uppercase text-xs tracking-widest">
                  Nenhuma notícia encontrada com esses filtros.
                </td>
              </tr>
            ) : (
              posts.map((post) => {
                const statusInfo = POST_STATUS_LABEL[post.status as keyof typeof POST_STATUS_LABEL] || { texto: "Status", cor: "bg-gray-100" };
                return (
                  <tr key={post.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                    <td className="p-4 max-w-xs">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                          <img src={post.imagem_capa_url || '/placeholder.png'} className="w-full h-full object-cover" alt="" />
                        </div>
                        <span className="font-bold text-ipa-escuro leading-tight truncate">
                          {post.titulo}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 px-2 py-1 rounded">
                        {post.site_post_categories?.nome || "Sem Categoria"}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${statusInfo.cor}`}>
                        {statusInfo.texto}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="inline-flex items-center gap-1 text-ipa-verde font-black text-sm">
                        <Eye size={14} className="opacity-40" /> {post.visualizacoes || 0}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link href={`/admin/posts/editar/${post.id}`} className="p-2 bg-gray-50 text-gray-400 hover:bg-ipa-dourado hover:text-white rounded-lg transition-all">
                          <Pencil size={16} />
                        </Link>
                        <button className="p-2 bg-gray-50 text-gray-400 hover:bg-red-500 hover:text-white rounded-lg transition-all">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* PAGINAÇÃO NUMÉRICA OTIMIZADA */}
        {totalPages > 1 && (
          <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Página {page} de {totalPages}
            </p>
            <div className="flex gap-1">
              {page > 1 && (
                <Link 
                  href={`/admin/posts?page=${page - 1}${searchQuery ? `&q=${searchQuery}` : ""}${statusFilter ? `&status=${statusFilter}` : ""}${categoryFilter ? `&cat=${categoryFilter}` : ""}`} 
                  className="p-2 bg-white border border-gray-200 rounded-lg hover:text-ipa-verde transition-all"
                >
                  <ChevronLeft size={20} />
                </Link>
              )}
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                // Lógica para não mostrar 50 botões se tiver muita página
                if (totalPages > 7 && Math.abs(p - page) > 2 && p !== 1 && p !== totalPages) return null;
                
                return (
                  <Link
                    key={p}
                    href={`/admin/posts?page=${p}${searchQuery ? `&q=${searchQuery}` : ""}${statusFilter ? `&status=${statusFilter}` : ""}${categoryFilter ? `&cat=${categoryFilter}` : ""}`}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg text-xs font-black transition-all ${
                      page === p ? "bg-ipa-verde text-white shadow-md" : "bg-white text-gray-400 border border-gray-200 hover:border-ipa-verde hover:text-ipa-verde"
                    }`}
                  >
                    {p}
                  </Link>
                );
              })}

              {page < totalPages && (
                <Link 
                  href={`/admin/posts?page=${page + 1}${searchQuery ? `&q=${searchQuery}` : ""}${statusFilter ? `&status=${statusFilter}` : ""}${categoryFilter ? `&cat=${categoryFilter}` : ""}`} 
                  className="p-2 bg-white border border-gray-200 rounded-lg hover:text-ipa-verde transition-all"
                >
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