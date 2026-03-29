import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { Metadata } from "next";
import { Search, Calendar, Eye, TrendingUp, Clock, ChevronLeft, ChevronRight, User } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const dynamic = 'force-dynamic';

export async function generateMetadata({ searchParams }: any): Promise<Metadata> {
  const params = await searchParams;
  const query = params.q;
  return {
    title: query ? `Busca: ${query} | IP Aquiraz` : "Notícias e Artigos | IP Aquiraz",
    description: "Artigos, notícias e estudos teológicos da Igreja Presbiteriana de Aquiraz.",
  };
}

export default async function NoticiasPage({ searchParams }: { searchParams: Promise<any> | any }) {
  const params = await searchParams;
  const page = Number(params?.page) || 1;
  const query = params?.q || "";
  const category = params?.cat || "";
  
  const LIMIT = 16; // Aumentado para 16 para fechar grid de 4 colunas perfeitamente
  const from = (page - 1) * LIMIT;
  const to = from + LIMIT - 1;

  // 1. Busca Destaque Principal (Estilo Desiring God: Imagem lateral + Texto)
  const { data: destaquePrincipal } = await supabase.from("site_posts").select("*, site_post_categories(nome), site_post_authors(nome)").eq("is_destaque", true).eq("status", 1).order("publicado_em", { ascending: false }).limit(1).single();

  // 2. Busca Categorias
  const { data: categorias } = await supabase.from("site_post_categories").select("id, nome").order("nome");

  // 3. Busca Sidebar: Mais Lidas e Recentes (que agora ficarão no rodapé em colunas)
  const { data: maisLidas } = await supabase.from("site_posts").select("titulo, slug, visualizacoes, publicado_em").eq("status", 1).order("visualizacoes", { ascending: false }).limit(6);
  const { data: ultimasSidebar } = await supabase.from("site_posts").select("titulo, slug, publicado_em, imagem_capa_url").eq("status", 1).order("publicado_em", { ascending: false }).limit(6);

  // 4. Query do Grid Principal (4 Colunas)
  let gridQuery = supabase
    .from("site_posts")
    .select("*, site_post_categories(nome)", { count: 'exact' })
    .eq("status", 1);

  if (query) gridQuery = gridQuery.or(`titulo.ilike.%${query}%,conteudo.ilike.%${query}%`);
  if (category) gridQuery = gridQuery.eq("categoria_id", category);

  const { data: posts, count } = await gridQuery.order("publicado_em", { ascending: false }).range(from, to);
  const totalPages = Math.ceil((count || 0) / LIMIT);

  return (
    <div className="bg-ipa-creme min-h-screen font-sans text-ipa-escuro">
      
      {/* HEADER CLEAN */}
      <header className="pt-32 pb-12 px-6">
        <div className="max-w-7xl mx-auto border-b border-ipa-verde/10 pb-8 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-ipa-verde tracking-tight">Notícias e Artigos</h1>
          <p className="text-ipa-verde/60 mt-2 font-medium uppercase tracking-[0.2em] text-xs">Igreja Presbiteriana de Aquiraz</p>
        </div>
      </header>

      {/* FILTROS INTEGRADOS AO CREME */}
      <section className="max-w-7xl mx-auto px-6 mb-16">
        <form action="/noticias" method="GET" className="flex flex-col md:flex-row gap-4 items-center bg-white/50 p-2 rounded-lg border border-ipa-verde/5">
          <div className="flex-1 relative w-full">
            <Search className="absolute left-4 top-3 text-ipa-verde/40" size={16} />
            <input name="q" defaultValue={query} placeholder="Buscar por assunto..." className="w-full pl-12 pr-4 py-2.5 bg-transparent focus:outline-none text-sm" />
          </div>
          <select name="cat" defaultValue={category} className="w-full md:w-64 p-2.5 bg-transparent text-sm focus:outline-none font-bold text-ipa-verde border-l border-ipa-verde/10">
            <option value="">Categorias</option>
            {categorias?.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
          <button type="submit" className="w-full md:w-auto bg-ipa-verde text-white px-8 py-2.5 rounded font-bold uppercase text-[11px] tracking-widest hover:bg-ipa-escuro transition-all">Filtrar</button>
        </form>
      </section>

      <main className="max-w-7xl mx-auto px-6">
        
        {/* DESTAQUE PRINCIPAL - ESTILO DESIRING GOD (LADO A LADO) */}
        {destaquePrincipal && (
          <section className="mb-24">
            <Link href={`/noticias/${destaquePrincipal.slug}`} className="grid grid-cols-1 lg:grid-cols-12 gap-12 group items-center">
              <div className="lg:col-span-7 overflow-hidden rounded-sm">
                <img 
                  src={destaquePrincipal.imagem_capa_url} 
                  className="w-full aspect-[16/9] object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700" 
                  alt="" 
                />
              </div>
              <div className="lg:col-span-5 space-y-4">
                <span className="text-ipa-dourado font-bold uppercase tracking-[0.2em] text-[10px] block">
                  {destaquePrincipal.site_post_categories?.nome}
                </span>
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-ipa-escuro leading-tight group-hover:text-ipa-verde transition-colors">
                  {destaquePrincipal.titulo}
                </h2>
                <p className="text-gray-600 leading-relaxed text-lg line-clamp-3">
                  {destaquePrincipal.resumo}
                </p>
                <div className="pt-4 flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-ipa-verde/50">
                   <User size={14}/> {destaquePrincipal.site_post_authors?.nome}
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* FEED DE NOTÍCIAS - GRID 4 COLUNAS */}
        <section className="mb-24">
          <div className="flex items-center gap-4 mb-10">
            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-ipa-verde shrink-0">Feed de Notícias</h3>
            <div className="h-[1px] bg-ipa-verde/10 w-full"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {posts?.map((post) => (
              <Link key={post.id} href={`/noticias/${post.slug}`} className="group space-y-4">
                <div className="aspect-[4/3] overflow-hidden rounded-sm bg-white">
                  <img src={post.imagem_capa_url} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-500" alt="" />
                </div>
                <div className="space-y-2">
                  <span className="text-[9px] font-black text-ipa-dourado uppercase tracking-widest">{post.site_post_categories?.nome}</span>
                  <h5 className="text-lg font-bold text-ipa-escuro group-hover:text-ipa-verde transition-colors leading-tight font-serif line-clamp-2 italic">{post.titulo}</h5>
                  <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed">{post.resumo}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* PAGINAÇÃO CLEAN */}
          {totalPages > 1 && (
            <div className="mt-20 pt-12 border-t border-ipa-verde/5 flex items-center justify-center gap-8">
               <Link href={`/noticias?page=${page - 1}`} className={`text-xs font-black uppercase tracking-widest flex items-center gap-2 ${page === 1 ? 'opacity-20 pointer-events-none' : 'hover:text-ipa-verde'}`}>
                 <ChevronLeft size={16}/> Anterior
               </Link>
               <span className="text-[10px] font-mono text-ipa-verde/40">{page} / {totalPages}</span>
               <Link href={`/noticias?page=${page + 1}`} className={`text-xs font-black uppercase tracking-widest flex items-center gap-2 ${page === totalPages ? 'opacity-20 pointer-events-none' : 'hover:text-ipa-verde'}`}>
                 Próximo <ChevronRight size={16}/>
               </Link>
            </div>
          )}
        </section>

        {/* RODAPÉ DE INFOS: MAIS LIDAS E RECENTES (2 COLUNAS) */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 pb-32 border-t border-ipa-verde/10 pt-16">
          
          {/* COLUNA: RECENTES */}
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-ipa-verde mb-10 flex items-center gap-2">
              <Clock size={16} /> Publicações Recentes
            </h4>
            <div className="space-y-8">
              {ultimasSidebar?.map((item) => (
                <Link key={item.slug} href={`/noticias/${item.slug}`} className="flex items-start gap-4 group">
                  <div className="w-20 h-20 rounded-sm overflow-hidden shrink-0">
                    <img src={item.imagem_capa_url} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="space-y-1">
                    <h6 className="text-sm font-bold text-ipa-escuro group-hover:text-ipa-verde transition-colors leading-tight">{item.titulo}</h6>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{new Date(item.publicado_em).toLocaleDateString('pt-BR')}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* COLUNA: MAIS LIDAS (TRENDING) */}
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-ipa-verde mb-10 flex items-center gap-2">
              <TrendingUp size={16} /> Mais Lidas da Semana
            </h4>
            <div className="space-y-6">
              {maisLidas?.map((item, index) => (
                <Link key={item.slug} href={`/noticias/${item.slug}`} className="flex gap-6 group border-b border-ipa-verde/5 pb-4 last:border-none">
                  <span className="text-2xl font-serif font-black text-ipa-verde/10 group-hover:text-ipa-dourado transition-colors italic">
                    {index + 1}
                  </span>
                  <div className="space-y-1">
                    <h6 className="text-sm font-bold text-ipa-escuro group-hover:text-ipa-verde transition-colors leading-tight">{item.titulo}</h6>
                    <div className="flex items-center gap-4 text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                       <span className="flex items-center gap-1"><Eye size={10}/> {item.visualizacoes} views</span>
                       <span>{new Date(item.publicado_em).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </section>
      </main>
    </div>
  );
}