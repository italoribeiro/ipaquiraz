import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Calendar, User, Folder, ArrowLeft, Eye } from "lucide-react";

import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// SEO DINÂMICO PARA A NOTÍCIA
export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { slug } = await params;
  const { data: post } = await supabase.from("site_posts").select("*").eq("slug", slug).single();

  if (!post) return { title: "Notícia não encontrada" };

  return {
    title: `${post.seo_title || post.titulo} | IP Aquiraz`,
    description: post.seo_description || post.resumo,
    keywords: post.seo_keywords,
    openGraph: {
      title: post.titulo,
      description: post.resumo,
      images: [post.imagem_capa_url],
      type: 'article',
    }
  };
}

export default async function NoticiaInternaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Busca a notícia completa com o Nome da Categoria e Nome do Autor
  const { data: post } = await supabase
    .from("site_posts")
    .select("*, site_post_categories(nome), site_post_authors(nome, foto_url, bio)")
    .eq("slug", slug)
    .single();

  if (!post) notFound();

  // INCREMENTA VISUALIZAÇÃO (RPC no Supabase é o ideal, mas faremos simples aqui)
  await supabase.rpc('increment_views', { post_id: post.id });

  return (
    <article className="bg-white min-h-screen pb-32">
      {/* CAPA DA NOTÍCIA */}
      <header className="relative h-[60vh] min-h-[400px] w-full">
        <img src={post.imagem_capa_url} className="w-full h-full object-cover" alt="" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-4xl mx-auto px-6 mb-16 text-white">
            <Link href="/noticias" className="flex items-center gap-2 text-white/70 hover:text-ipa-dourado font-bold uppercase text-[10px] tracking-widest mb-8 transition-colors">
               <ArrowLeft size={16} /> Voltar para notícias
            </Link>
            <span className="bg-ipa-verde text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">{post.site_post_categories?.nome}</span>
            <h1 className="text-4xl md:text-6xl font-black mt-6 leading-tight uppercase italic italic">{post.titulo}</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-4 gap-12">
        
        {/* INFO DO AUTOR E DATA */}
        <aside className="lg:col-span-1 border-r border-gray-100 pr-8 hidden lg:block">
           <div className="sticky top-10 space-y-8">
              <div className="flex flex-col gap-4">
                 <img src={post.site_post_authors?.foto_url} className="w-16 h-16 rounded-full object-cover shadow-lg border-2 border-ipa-dourado" />
                 <div>
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Escrito por</p>
                    <p className="font-black text-ipa-escuro uppercase">{post.site_post_authors?.nome}</p>
                 </div>
              </div>
              <div className="space-y-4 pt-8 border-t border-gray-50">
                 <div className="flex items-center gap-2 text-gray-400 font-bold uppercase text-[10px]">
                    <Calendar size={14} className="text-ipa-verde"/> {new Date(post.publicado_em).toLocaleDateString('pt-BR')}
                 </div>
                 <div className="flex items-center gap-2 text-gray-400 font-bold uppercase text-[10px]">
                    <Eye size={14} className="text-ipa-verde"/> {post.visualizacoes} visualizações
                 </div>
              </div>
           </div>
        </aside>

        {/* CORPO DA NOTÍCIA */}
        <div className="lg:col-span-3">
          {/* Renderização do HTML do Tiptap com Tailwind Typography */}
          <div 
            className="prose prose-lg max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:italic prose-p:text-gray-600 prose-img:rounded-[40px] prose-a:text-ipa-verde"
            dangerouslySetInnerHTML={{ __html: post.conteudo }}
          />
          
          {/* TAGS / KEYWORDS */}
          {post.seo_keywords && (
             <div className="mt-16 pt-8 border-t border-gray-100 flex flex-wrap gap-2">
                {post.seo_keywords.map((tag: string) => (
                  <span key={tag} className="bg-gray-50 text-gray-400 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-gray-100">#{tag}</span>
                ))}
             </div>
          )}
        </div>
      </div>
    </article>
  );
}