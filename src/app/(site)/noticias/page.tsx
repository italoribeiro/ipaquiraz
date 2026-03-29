import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { Metadata } from "next";
import { Search, Calendar, Folder, ArrowRight, Eye, TrendingUp, Clock, ChevronLeft, ChevronRight } from "lucide-react";

// Configuração do Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const dynamic = 'force-dynamic';

// SEO Otimizado
export async function generateMetadata({ searchParams }: any): Promise<Metadata> {
  const params = await searchParams;
  const query = params.q;
  return {
    title: query ? `Resultados para "${query}" | Notícias IP Aquiraz` : "Notícias e Artigos | Igreja Presbiteriana de Aquiraz",
    description: "Acompanhe as últimas notícias, estudos teológicos e avisos da IP Aquiraz. Conteúdo reformado e bíblico.",
    openGraph: {
      images: ['/og-image-noticias.jpg'], // Substitua pela sua imagem de compartilhamento
    },
  };
}

export default async function NoticiasPage({ searchParams }: { searchParams: Promise<any> | any }) {
  const params = await searchParams;
  const page = Number(params?.page) || 1;
  const query = params?.q || "";
  const category = params?.cat || "";
  
  const LIMIT = 15;
  const from = (page - 1) * LIMIT;
  const to = from + LIMIT - 1;

  // 1. Busca Destaques (is_destaque e is_sub_destaque)
  const { data: destaquePrincipal } = await supabase.from("site_posts").select("*, site_post_categories(nome)").eq("is_destaque", true).eq("status", 1).order("publicado_em", { ascending: false }).limit(1).single();
  const { data: subDestaque } = await supabase.from("site_posts").select("*, site_post_categories(nome)").eq("is_sub_destaque", true).eq("status", 1).order("publicado_em", { ascending: false }).limit(1).single();

  // 2. Busca Categorias para o Filtro
  const { data: categorias } = await supabase.from("site_post_categories").select("id, nome").order("nome");

  // 3. Busca Sidebar: Mais Lidas e Últimas
  const { data: maisLidas } = await supabase.from("site_posts").select("titulo, slug, visualizacoes, imagem_capa_url").eq("status", 1).order("visualizacoes", { ascending: false }).limit(5);
  const { data: ultimasSidebar } = await supabase.from("site_posts").select("titulo, slug, publicado_em, imagem_capa_url").eq("status", 1).order("publicado_em", { ascending: false }).limit(5);

  // 4. Query do Grid Principal com Filtros
  let gridQuery = supabase
    .from("site_posts")
    .select("*, site_post_categories(nome)", { count: 'exact' })
    .eq("status", 1);

  if (query) gridQuery = gridQuery.or(`titulo.ilike.%${query}%,conteudo.ilike.%${query}%`);
  if (category) gridQuery = gridQuery.eq("categoria_id", category);

  const { data: posts, count } = await gridQuery.order("publicado_em", { ascending: false }).range(from, to);
  const totalPages = Math.ceil((count || 0) / LIMIT);

  return (
    <div className="bg-white min-h-screen">
      {/* HEADER DA PÁGINA */}
      <header className="bg-ipa-escuro py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic italic">Notícias</h1>
          <p className="text-ipa-dourado mt-4 font-bold tracking-[0.3em] uppercase text-sm">Igreja Presbiteriana de Aquiraz</p>
        </div>
      </header>

      {/* BARRA DE FILTROS */}
      <div className="max-w-7xl mx-auto px-6 -mt-10">
        <form action="/noticias" method="GET" className="bg-white p-4 rounded-3xl shadow-2xl border border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
            <input name="q" defaultValue={query} placeholder="Buscar por assunto ou texto..." className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-ipa-verde/20 text-sm font-medium" />
          </div>
          <select name="cat" defaultValue={category} className="bg-gray-50 p-3 rounded-2xl text-sm focus:outline-none border-none font-bold text-ipa-escuro">
            <option value="">Todas as Categorias</option>
            {categorias?.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
          <button type="submit" className="bg-ipa-verde text-white font-black uppercase tracking-widest text-xs py-3 rounded-2xl hover:bg-ipa-escuro transition-all">Filtrar</button>
        </form>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-16">
        
        {/* LINHA 1: DESTAQUES (4 Cards Visualmente) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-20">
          {/* Destaque Principal (Ocupa 3 colunas) */}
          {destaquePrincipal && (
            <Link href={`/noticias/${destaquePrincipal.slug}`} className="lg:col-span-3 group relative h-[500px] rounded-[40px] overflow-hidden shadow-xl">
              <img src={destaquePrincipal.imagem_capa_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute bottom-10 left-10 right-10">
                <span className="bg-ipa-dourado text-ipa-escuro text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{destaquePrincipal.site_post_categories?.nome}</span>
                <h2 className="text-white text-3xl md:text-5xl font-black mt-4 leading-tight group-hover:text-ipa-dourado transition-colors uppercase italic">{destaquePrincipal.titulo}</h2>
              </div>
            </Link>
          )}

          {/* Sub Destaque (Ocupa 1 coluna) */}
          {subDestaque && (
            <Link href={`/noticias/${subDestaque.slug}`} className="group bg-gray-50 rounded-[40px] overflow-hidden flex flex-col border border-gray-100">
              <div className="h-48 overflow-hidden">
                <img src={subDestaque.imagem_capa_url} className="w-full h-full object-cover group-hover:scale-110 transition-all" alt="" />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-ipa-verde text-[10px] font-black uppercase tracking-widest">{subDestaque.site_post_categories?.nome}</span>
                  <h3 className="text-lg font-black mt-2 text-ipa-escuro group-hover:text-ipa-verde transition-colors leading-tight uppercase italic">{subDestaque.titulo}</h3>
                </div>
                <div className="mt-4 flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase">
                  <span>{new Date(subDestaque.publicado_em).toLocaleDateString('pt-BR')}</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          )}
        </div>

        {/* LINHA 2: GRID DE NOTÍCIAS + SIDEBAR */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* COLUNA ESQUERDA: LISTA DE NOTÍCIAS (3 Colunas) */}
          <div className="lg:col-span-3">
             <h4 className="text-xs font-black text-ipa-escuro uppercase tracking-[0.3em] mb-8 border-b pb-4 flex items-center gap-2">
                <Clock size={16} className="text-ipa-verde"/> Feed de Notícias
             </h4>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {posts?.map((post) => (
                  <Link key={post.id} href={`/noticias/${post.slug}`} className="group space-y-4">
                    <div className="aspect-video rounded-3xl overflow-hidden shadow-sm border border-gray-100">
                      <img src={post.imagem_capa_url} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" alt="" />
                    </div>
                    <div>
                      <span className="text-ipa-dourado text-[10px] font-black uppercase tracking-widest">{post.site_post_categories?.nome}</span>
                      <h5 className="text-xl font-black text-ipa-escuro group-hover:text-ipa-verde transition-colors leading-tight mt-1 uppercase italic">{post.titulo}</h5>
                      <p className="text-gray-500 text-sm mt-2 line-clamp-2">{post.resumo}</p>
                    </div>
                  </Link>
                ))}
             </div>

             {/* PAGINAÇÃO */}
             {totalPages > 1 && (
               <div className="mt-16 flex items-center justify-center gap-2">
                  <Link href={`/noticias?page=${page - 1}`} className={`p-4 rounded-2xl border transition-all ${page === 1 ? 'opacity-20 pointer-events-none' : 'hover:bg-ipa-verde hover:text-white'}`}>
                    <ChevronLeft size={20} />
                  </Link>
                  <span className="font-black text-ipa-escuro px-6">Página {page} de {totalPages}</span>
                  <Link href={`/noticias?page=${page + 1}`} className={`p-4 rounded-2xl border transition-all ${page === totalPages ? 'opacity-20 pointer-events-none' : 'hover:bg-ipa-verde hover:text-white'}`}>
                    <ChevronRight size={20} />
                  </Link>
               </div>
             )}
          </div>

          {/* COLUNA DIREITA: MAIS LIDAS E ÚLTIMAS (1 Coluna) */}
          <aside className="space-y-12">
            
            {/* CARD: MAIS LIDAS */}
            <section className="bg-ipa-escuro p-8 rounded-[40px] text-white shadow-xl">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] mb-8 flex items-center gap-2 text-ipa-dourado">
                <TrendingUp size={18} /> Mais Lidas
              </h4>
              <div className="space-y-6">
                {maisLidas?.map((item, index) => (
                  <Link key={item.slug} href={`/noticias/${item.slug}`} className="flex gap-4 group">
                    <span className="text-2xl font-black text-white/10 group-hover:text-ipa-dourado transition-colors">0{index + 1}</span>
                    <h6 className="text-sm font-bold group-hover:text-ipa-dourado transition-colors leading-snug">{item.titulo}</h6>
                  </Link>
                ))}
              </div>
            </section>

            {/* CARD: ÚLTIMAS NOTÍCIAS (Mini List) */}
            <section className="bg-gray-50 p-8 rounded-[40px] border border-gray-100">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] mb-8 text-ipa-verde">
                Recentes
              </h4>
              <div className="space-y-6">
                {ultimasSidebar?.map((item) => (
                  <Link key={item.slug} href={`/noticias/${item.slug}`} className="flex items-center gap-4 group">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 shadow-sm border border-white">
                      <img src={item.imagem_capa_url} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div>
                      <h6 className="text-xs font-black text-ipa-escuro group-hover:text-ipa-verde transition-colors leading-tight line-clamp-2 uppercase">{item.titulo}</h6>
                      <p className="text-[9px] text-gray-400 font-bold mt-1 uppercase">{new Date(item.publicado_em).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

          </aside>
        </div>
      </main>
    </div>
  );
}