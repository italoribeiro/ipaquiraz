import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { 
  Plus, Search, Filter, FileText, Eye, Pencil, 
  Trash2, Newspaper, CheckCircle2, Clock, FileEdit, AlertCircle 
} from "lucide-react";
import { POST_STATUS, POST_STATUS_LABEL } from "@/lib/constants"; // Crie esse arquivo com as constantes que definimos

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const LIMIT = 50; // Seu limite de 50 registros por página

export default async function PostsAdminPage({ searchParams }: { searchParams: any }) {
  const page = Number(searchParams?.page) || 1;
  const statusFilter = searchParams?.status || null;
  const searchQuery = searchParams?.q || "";

  // Lógica de Paginação
  const from = (page - 1) * LIMIT;
  const to = from + LIMIT - 1;

  // Query Inteligente
  let query = supabase
    .from("site_posts")
    .select("*, site_post_categories(nome), site_post_authors(nome)", { count: 'exact' })
    .order("publicado_em", { ascending: false })
    .range(from, to);

  if (statusFilter !== null) query = query.eq("status", statusFilter);
  if (searchQuery) query = query.ilike("titulo", `%${searchQuery}%`);

  const { data: posts, count } = await query;
  const totalPages = Math.ceil((count || 0) / LIMIT);

  const getStatusInfo = (status: number) => {
    return POST_STATUS_LABEL[status as keyof typeof POST_STATUS_LABEL] || { texto: "Desconhecido", cor: "bg-gray-100" };
  };

  return (
    <div className="p-10 pb-24">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-ipa-verde uppercase tracking-tighter flex items-center gap-2">
            <Newspaper size={32} /> Notícias e Artigos
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Gerencie o conteúdo do portal. <span className="font-bold text-ipa-dourado">({count || 0} registros)</span>
          </p>
        </div>

        <Link 
          href="/admin/posts/novo" 
          className="bg-ipa-verde hover:bg-ipa-escuro text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-sm flex items-center gap-2 transition-all shadow-md active:scale-95"
        >
          <Plus size={18} /> Nova Notícia
        </Link>
      </header>

      {/* BARRA DE BUSCA E FILTROS */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Pesquisar por título..." 
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-ipa-verde/20 transition-all"
          />
        </div>
        <select className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-600 focus:outline-none">
          <option value="">Todos os Status</option>
          <option value="1">Publicados</option>
          <option value="3">Pendentes IA</option>
          <option value="4">Rascunhos</option>
          <option value="0">Não Publicados</option>
        </select>
      </div>

      {/* TABELA DE REGISTROS */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-[10px] uppercase tracking-[0.2em] text-gray-400">
              <th className="p-4 font-black">Notícia</th>
              <th className="p-4 font-black">Status</th>
              <th className="p-4 font-black text-center">Visualizações</th>
              <th className="p-4 font-black text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {posts?.map((post) => {
              const status = getStatusInfo(post.status);
              return (
                <tr key={post.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                        <img src={post.imagem_capa_url} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-ipa-escuro leading-tight group-hover:text-ipa-verde transition-colors">
                          {post.titulo}
                        </span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase mt-1">
                          {post.site_post_categories?.nome} • Por {post.site_post_authors?.nome}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${status.cor}`}>
                      {status.texto}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="inline-flex items-center gap-1.5 text-ipa-verde font-black bg-ipa-verde/5 px-3 py-1 rounded-lg border border-ipa-verde/10">
                      <Eye size={14} /> {post.visualizacoes || 0}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Link 
                        href={`/admin/posts/editar/${post.id}`}
                        className="p-2 bg-gray-100 text-gray-500 hover:bg-ipa-dourado hover:text-white rounded-lg transition-all"
                      >
                        <Pencil size={16} />
                      </Link>
                      <button className="p-2 bg-gray-100 text-gray-500 hover:bg-red-500 hover:text-white rounded-lg transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* PAGINAÇÃO */}
        {totalPages > 1 && (
          <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-center gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <Link
                key={i}
                href={`/admin/posts?page=${i + 1}`}
                className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-all ${
                  page === i + 1 ? "bg-ipa-verde text-white shadow-lg" : "bg-white text-gray-400 hover:bg-ipa-creme hover:text-ipa-verde"
                }`}
              >
                {i + 1}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}