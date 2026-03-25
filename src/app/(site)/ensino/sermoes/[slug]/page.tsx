// src/app/(site)/ensino/sermoes/[slug]/page.tsx
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { ChevronLeft, Calendar, BookOpen, User, Tag } from "lucide-react";
import { notFound } from "next/navigation";
import { Metadata } from "next";

// IMPORT DOS NOSSOS COMPONENTES
import ShareSermon from "../../../../../components/ui/ShareSermon";
import StoryGenerator from "../../../../../components/ui/StoryGenerator";
import PdfGenerator from "../../../../../components/ui/PdfGenerator";

// 1. MATA O CACHE: Força a busca de dados novos no banco
export const revalidate = 0;

// Inicia o cliente do Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Props = {
  params: Promise<{ slug: string }>;
};

// 2. GERAÇÃO DINÂMICA DE SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  
  const { data } = await supabase
    .from("site_sermoes_mensagens")
    .select("titulo, resumo, imagem_capa_url, youtube_id, seo_titulo, seo_descricao, tags")
    .eq("slug", resolvedParams.slug)
    .single();
  
  if (!data) return { title: "Mensagem não encontrada | IP Aquiraz" };

  const ogImage = data.imagem_capa_url 
    ? data.imagem_capa_url 
    : data.youtube_id 
      ? `https://img.youtube.com/vi/${data.youtube_id}/maxresdefault.jpg`
      : ""; 

  return {
    title: data.seo_titulo || `${data.titulo} | Mensagens IP Aquiraz`,
    description: data.seo_descricao || data.resumo,
    keywords: data.tags ? data.tags.split(",") : ["IP Aquiraz", "Sermões", "Igreja Presbiteriana"],
    openGraph: {
      title: data.seo_titulo || data.titulo,
      description: data.seo_descricao || data.resumo,
      images: ogImage ? [ogImage] : [],
      type: "article",
    },
  };
}

// 3. A PÁGINA DE LEITURA
export default async function SermaoPage({ params }: Props) {
  const resolvedParams = await params;
  
  const { data: sermao, error } = await supabase
    .from("site_sermoes_mensagens")
    .select(`
      *,
      site_sermoes_autores ( nome, cargo, foto_url ),
      site_sermoes_categorias ( nome, slug )
    `)
    .eq("slug", resolvedParams.slug)
    .single();

  if (error || !sermao) {
    notFound(); 
  }

  const dataFormatada = new Date(sermao.data_pregacao).toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <article className="flex flex-col w-full font-sans bg-white min-h-screen pb-24">
      
      {/* CABEÇALHO DO SERMÃO */}
      <header className="bg-ipa-creme pt-16 pb-24 px-6 border-b border-ipa-bege/30">
        <div className="max-w-4xl mx-auto">
          <Link href="/ensino/sermoes" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-ipa-dourado hover:text-ipa-verde transition-colors mb-12">
            <ChevronLeft size={14} /> Voltar para Mensagens
          </Link>

          <h1 className="text-4xl md:text-6xl font-black text-ipa-verde tracking-tighter uppercase leading-tight mb-8">
            {sermao.titulo}
          </h1>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-xs font-bold text-ipa-escuro/60 uppercase tracking-widest border-t border-b border-ipa-bege/30 py-4">
            {sermao.site_sermoes_autores?.nome && (
              <div className="flex items-center gap-2">
                <User size={14} className="text-ipa-dourado" /> {sermao.site_sermoes_autores.nome}
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-ipa-dourado" /> {dataFormatada}
            </div>
            {sermao.passagem_biblica && (
              <div className="flex items-center gap-2">
                <BookOpen size={14} className="text-ipa-dourado" /> {sermao.passagem_biblica}
              </div>
            )}
            {sermao.site_sermoes_categorias && (
              <div className="flex items-center gap-2">
                <Tag size={14} className="text-ipa-dourado" /> {sermao.site_sermoes_categorias.nome}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ÁREA DE VÍDEO (YOUTUBE) */}
      {sermao.youtube_id && (
        <div className="max-w-5xl mx-auto w-full px-6 -mt-16 mb-16 relative z-10">
          <div className="aspect-video w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-ipa-escuro">
            <iframe 
              width="100%" height="100%" 
              src={`https://www.youtube.com/embed/${sermao.youtube_id}`} 
              title="YouTube video player" frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen>
            </iframe>
          </div>
        </div>
      )}

      {/* ÁREA DE ÁUDIO (SPOTIFY) */}
      {sermao.spotify_url && (
         <div className="max-w-4xl mx-auto w-full px-6 mb-12 mt-8">
             <div dangerouslySetInnerHTML={{ __html: sermao.spotify_url }} />
         </div>
      )}

      {/* ESTRUTURA DE COLUNAS (GRID) */}
      <div className="max-w-6xl mx-auto px-6 w-full mt-4 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* COLUNA ESQUERDA: O TEXTO (8 colunas) */}
        <div className="lg:col-span-8 break-words">
          <div 
            className="text-ipa-escuro/80 font-medium text-lg md:text-xl leading-relaxed
              [&>p]:mb-6
              [&>h1]:text-3xl [&>h1]:font-black [&>h1]:text-ipa-verde [&>h1]:uppercase [&>h1]:tracking-tighter [&>h1]:mb-6 [&>h1]:mt-10
              [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-ipa-escuro [&>h2]:mb-4 [&>h2]:mt-8
              [&>h3]:text-xl [&>h3]:font-bold [&>h3]:mb-4 [&>h3]:mt-6
              [&>ul]:list-disc [&>ul]:ml-8 [&>ul]:mb-6
              [&>ol]:list-decimal [&>ol]:ml-8 [&>ol]:mb-6
              [&>strong]:font-bold [&>strong]:text-gray-900
              [&>em]:italic
              [&>a]:text-ipa-dourado [&>a]:underline
              [&>blockquote]:border-l-4 [&>blockquote]:border-ipa-dourado [&>blockquote]:pl-6 [&>blockquote]:italic [&>blockquote]:my-6 [&>blockquote]:text-ipa-escuro/60
              [&>iframe]:w-full [&>iframe]:aspect-video [&>iframe]:rounded-xl"
            dangerouslySetInnerHTML={{ __html: sermao.texto_conteudo || "" }}
          />

          {/* Compartilhamento Social ao final do texto */}
          <div className="mt-16 pt-8 border-t border-gray-100">
            <ShareSermon titulo={sermao.titulo} />
          </div>
        </div>

        {/* COLUNA DIREITA: WIDGETS LATERAIS (4 colunas) */}
        {/* A classe 'sticky top-8' faz os widgets seguirem o usuário na tela do PC */}
        <aside className="lg:col-span-4 sticky top-8 flex flex-col gap-8">
          
          {/* Gerador de PDF para Estudo */}
          <PdfGenerator 
            titulo={sermao.titulo}
            autor={sermao.site_sermoes_autores?.nome || "IP Aquiraz"}
            data={dataFormatada}
            conteudo={sermao.texto_conteudo}
          />

          {/* Gerador de Imagem para Story */}
          <StoryGenerator 
            frase={sermao.frase_social} 
            passagem={sermao.passagem_biblica} 
          />
          
        </aside>

      </div>

    </article>
  );
}