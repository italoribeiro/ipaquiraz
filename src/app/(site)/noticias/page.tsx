"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { Search, Calendar, Eye, TrendingUp, Clock, ChevronLeft, ChevronRight, User } from "lucide-react";

// Inicializa o Supabase no lado do cliente
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function NoticiasPage({ searchParams }: { searchParams: any }) {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<any[]>([]);
  const [destaque, setDestaque] = useState<any>(null);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [maisLidas, setMaisLidas] = useState<any[]>([]);
  const [recentesRodape, setRecentesRodape] = useState<any[]>([]);
  
  const [totalPosts, setTotalPosts] = useState(0);
  const page = Number(searchParams?.page) || 1;
  const query = searchParams?.q || "";
  const category = searchParams?.cat || "";
  
  const LIMIT = 16;

  useEffect(() => {
    async function carregarDados() {
      setLoading(true);
      const from = (page - 1) * LIMIT;
      const to = from + LIMIT - 1;

      // 1. Busca Destaque Principal
      const { data: feat } = await supabase.from("site_posts")
        .select("*, site_post_categories(nome), site_post_authors(nome)")
        .eq("is_destaque", true).eq("status", 1)
        .order("publicado_em", { ascending: false }).limit(1).single();
      setDestaque(feat);

      // 2. Categorias e Listas Auxiliares
      const [resCats, resLidas, resRec] = await Promise.all([
        supabase.from("site_post_categories").select("id, nome").order("nome"),
        supabase.from("site_posts").select("titulo, slug, visualizacoes, publicado_em").eq("status", 1).order("visualizacoes", { ascending: false }).limit(6),
        supabase.from("site_posts").select("titulo, slug, publicado_em, imagem_capa_url").eq("status", 1).order("publicado_em", { ascending: false }).limit(6)
      ]);

      setCategorias(resCats.data || []);
      setMaisLidas(resLidas.data || []);
      setRecentesRodape(resRec.data || []);

      // 3. Grid Principal com Filtros
      let gridQuery = supabase.from("site_posts")
        .select("*, site_post_categories(nome)", { count: 'exact' })
        .eq("status", 1);

      if (query) gridQuery = gridQuery.or(`titulo.ilike.%${query}%,conteudo.ilike.%${query}%`);
      if (category) gridQuery = gridQuery.eq("categoria_id", category);

      const { data: gridData, count } = await gridQuery.order("publicado_em", { ascending: false }).range(from, to);
      
      setPosts(gridData || []);
      setTotalPosts(count || 0);
      setLoading(false);
    }

    carregarDados();
  }, [page, query, category]);

  const totalPages = Math.ceil(totalPosts / LIMIT);

  if (loading) return <div className="h-screen flex items-center justify-center bg-ipa-creme text-ipa-verde font-black uppercase tracking-widest animate-pulse">Carregando...</div>;

  return (
    <div className="bg-ipa-creme min-h-screen font-sans text-ipa-escuro">
      
      {/* HEADER: SEGUINDO EXATAMENTE A IMAGEM FORNECIDA */}
      <header className="pt-40 pb-16 px-6 text-center">
        <div className="max-w-7xl mx-auto">
          <p className="text-[10px] font-black uppercase text-ipa-dourado tracking-[0.4em] mb-4">
            Comunicação e Edificação
          </p>
          <h1 className="text-5xl md:text-8xl font-black text-ipa-verde uppercase tracking-tighter leading-[0.9]">
            Notícias e <br /> Sã Doutrina
          </h1>
          <div className="w-20 h-1 bg-ipa-dourado mx-auto mt-10 opacity-30"></div>
        </div>
      </header>

      {/* CAMPO DE BUSCA: ABAIXO DO HEADER, CLEAN */}
      <section className="max-w-7xl mx-auto px-6 mb-20">
        <form action="/noticias" method="GET" className="flex flex-col md:flex-row gap-0 bg-white shadow-sm rounded-lg overflow-hidden border border-ipa-verde/5">
          <div className="flex-1 relative flex items-center border-r border-ipa-verde/5">
            <Search className="ml-5 text-ipa-verde/30" size={18} />
            <input 
              name="q" 
              defaultValue={query} 
              placeholder="Pesquisar artigos ou notícias..." 
              className="w-full pl-4 pr-6 py-5 bg-transparent focus:outline-none text-sm font-medium" 
            />
          </div>
          <select 
            name="cat" 
            defaultValue={category} 
            className="p-5 bg-white text-xs font-black uppercase tracking-widest text-ipa-verde focus:outline-none cursor-pointer border-r border-ipa-verde/5"
          >
            <option value="">Todas as Categorias</option>
            {categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
          <button type="submit" className="bg-ipa-verde text-white px-10 py-5 font-black uppercase text-[11px] tracking-[0.2em] hover:bg-ipa-escuro transition-all">
            Filtrar
          </button>
        </form>
      </section>

      <main className="max-w-7xl mx-auto px-6">
        
        {/* DESTAQUE ESTILO DESIRING GOD (IMAGEM LADO A LADO, SEM DEGRADÊ) */}
        {destaque && (
          <section className="mb-32">
            <Link href={`/noticias/${destaque.slug}`} className="grid grid-cols-1 lg:grid-cols-12 gap-16 group items-center">
              <div className="lg:col-span-7">
                <img 
                  src={destaque.imagem_capa_url} 
                  className="w-full aspect-[16/9] object-cover rounded-sm shadow-sm group-hover:opacity-90 transition-all" 
                  alt="" 
                />
              </div>
              <div className="lg:col-span-5 space-y-6">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-[1px] bg-ipa-dourado"></span>
                  <span className="text-ipa-dourado font-black uppercase tracking-[0.2em] text-[10px]">
                    Destaque
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-ipa-escuro leading-[1.1] uppercase tracking-tighter group-hover:text-ipa-verde transition-colors">
                  {destaque.titulo}
                </h2>
                <p className="text-gray-500 leading-relaxed text-lg font-medium">
                  {destaque.resumo}
                </p>
                <div className="pt-4 flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-ipa-verde">
                   <span className="bg-ipa-verde/5 px-3 py-1 rounded-full">{destaque.site_post_categories?.nome}</span>
                   <span className="text-gray-300">|</span>
                   <span className="flex items-center gap-2 italic"><User size={12}/> {destaque.site_post_authors?.nome}</span>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* FEED DE NOTÍCIAS: GRID 4 COLUNAS, RESPONSIVO */}
        <section className="mb-32">
          <div className="flex items-center justify-between mb-12 border-b border-ipa-verde/10 pb-4">
            <h3 className="text-[12px] font-black uppercase tracking-[0.3em] text-ipa-verde flex items-center gap-2">
              <Clock size={16}/> Feed de Notícias
            </h3>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{totalPosts} registros</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-16">
            {posts.map((post) => (
              <Link key={post.id} href={`/noticias/${post.slug}`} className="group block">
                <div className="aspect-[3/2] overflow-hidden rounded-sm bg-gray-100 mb-6">
                  <img src={post.imagem_capa_url} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" alt="" />
                </div>
                <div className="space-y-3">
                  <span className="text-ipa-dourado font-black uppercase tracking-widest text-[9px] block">
                    {post.site_post_categories?.nome}
                  </span>
                  <h5 className="text-lg font-black text-ipa-escuro group-hover:text-ipa-verde transition-colors leading-tight uppercase tracking-tighter italic">
                    {post.titulo}
                  </h5>
                  <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
                    {post.resumo}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* PAGINAÇÃO MINIMALISTA */}
          {totalPages > 1 && (
            <div className="mt-24 pt-12 border-t border-ipa-verde/5 flex items-center justify-between">
               <Link href={`/noticias?page=${page - 1}`} className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 px-6 py-3 border border-ipa-verde/10 rounded-full hover:bg-ipa-verde hover:text-white transition-all ${page === 1 ? 'opacity-0 pointer-events-none' : ''}`}>
                 <ChevronLeft size={14}/> Anterior
               </Link>
               
               <div className="flex gap-2">
                 {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <Link key={p} href={`/noticias?page=${p}`} className={`w-8 h-8 flex items-center justify-center rounded-full text-[10px] font-black ${page === p ? 'bg-ipa-verde text-white' : 'text-ipa-verde/40 hover:text-ipa-verde'}`}>
                      {p}
                    </Link>
                 ))}
               </div>

               <Link href={`/noticias?page=${page + 1}`} className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 px-6 py-3 border border-ipa-verde/10 rounded-full hover:bg-ipa-verde hover:text-white transition-all ${page === totalPages ? 'opacity-0 pointer-events-none' : ''}`}>
                 Próximo <ChevronRight size={14}/>
               </Link>
            </div>
          )}
        </section>

        {/* RODAPÉ EM 2 COLUNAS: RECENTES E MAIS LIDAS */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-20 pb-40">
          
          {/* COLUNA 1: RECENTES */}
          <div className="space-y-10">
            <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-ipa-verde border-b border-ipa-verde/10 pb-4">
              Recentemente Publicado
            </h4>
            <div className="space-y-8">
              {recentesRodape.map((item) => (
                <Link key={item.slug} href={`/noticias/${item.slug}`} className="flex items-center gap-6 group">
                  <div className="w-20 h-20 rounded-sm overflow-hidden shrink-0 bg-white">
                    <img src={item.imagem_capa_url} className="w-full h-full object-cover group-hover:opacity-80 transition-all" alt="" />
                  </div>
                  <div className="space-y-1">
                    <h6 className="text-[15px] font-black text-ipa-escuro group-hover:text-ipa-verde transition-colors leading-tight uppercase tracking-tighter italic">{item.titulo}</h6>
                    <p className="text-[9px] text-ipa-dourado font-black uppercase tracking-widest">{new Date(item.publicado_em).toLocaleDateString('pt-BR')}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* COLUNA 2: MAIS LIDAS (TRENDING) */}
          <div className="space-y-10">
            <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-ipa-verde border-b border-ipa-verde/10 pb-4">
              Os Mais Acessados
            </h4>
            <div className="space-y-8">
              {maisLidas.map((item, index) => (
                <Link key={item.slug} href={`/noticias/${item.slug}`} className="flex gap-6 group border-b border-ipa-verde/5 pb-6 last:border-none">
                  <span className="text-3xl font-black text-ipa-verde/10 group-hover:text-ipa-dourado transition-colors italic">
                    {index + 1}
                  </span>
                  <div className="space-y-2">
                    <h6 className="text-[15px] font-black text-ipa-escuro group-hover:text-ipa-verde transition-colors leading-tight uppercase tracking-tighter">{item.titulo}</h6>
                    <div className="flex items-center gap-4 text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                       <span className="flex items-center gap-1"><Eye size={10}/> {item.visualizacoes} leituras</span>
                       <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
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