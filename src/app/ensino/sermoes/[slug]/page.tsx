import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { ChevronLeft, Calendar, BookOpen, User, Tag } from "lucide-react";
import { notFound } from "next/navigation";
import { Metadata } from "next";

// 1. Inicia o cliente do Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Tipo obrigatório para os parâmetros no Next.js App Router atual
type Props = {
  params: Promise<{ slug: string }>;
};

// 2. GERAÇÃO DINÂMICA DE SEO (Para Google, WhatsApp, Facebook, etc.)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  
  const { data } = await supabase
    .from("site_sermoes_mensagens")
    .select("titulo, resumo, imagem_capa_url, youtube_id")
    .eq("slug", resolvedParams.slug)
    .single();
  
  if (!data) return { title: "Mensagem não encontrada | IP Aquiraz" };

  // Define a imagem que vai aparecer no balãozinho do WhatsApp
  const ogImage = data.imagem_capa_url 
    ? data.imagem_capa_url 
    : data.youtube_id 
      ? `https://img.youtube.com/vi/${data.youtube_id}/maxresdefault.jpg`
      : ""; // Se não tiver imagem nem vídeo, fica sem capa no link

  return {
    title: `${data.titulo} | Mensagens IP Aquiraz`,
    description: data.resumo,
    openGraph: {
      title: data.titulo,
      description: data.resumo,
      images: ogImage ? [ogImage] : [],
      type: "article",
    },
  };
}

// 3. A PÁGINA DE LEITURA (Renderização no Servidor)
export default async function SermaoPage({ params }: Props) {
  const resolvedParams = await params;
  
  // Busca todos os dados da mensagem, incluindo o autor e a categoria
  const { data: sermao, error } = await supabase
    .from("site_sermoes_mensagens")
    .select(`
      *,
      site_sermoes_autores ( nome, cargo, foto_url ),
      site_sermoes_categorias ( nome, slug )
    `)
    .eq("slug", resolvedParams.slug)
    .single();

  // Se a URL estiver errada ou o sermão for apagado, mostra a página 404 padrão
  if (error || !sermao) {
    notFound(); 
  }

  return (
    <article className="flex flex-col w-full font-sans bg-white min-h-screen pb-24">
      
      {/* CABEÇALHO DO SERMÃO */}
      <header className="bg-ipa-creme pt-16 pb-24 px-6 border-b border-ipa-bege/30">
        <div className="max-w-4xl mx-auto">
          {/* Botão de Voltar */}
          <Link href="/ensino/sermoes" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-ipa-dourado hover:text-ipa-verde transition-colors mb-12">
            <ChevronLeft size={14} />
            Voltar para Mensagens
          </Link>

          {/* Título Principal */}
          <h1 className="text-4xl md:text-6xl font-black text-ipa-verde tracking-tighter uppercase leading-tight mb-8">
            {sermao.titulo}
          </h1>

          {/* Ficha Técnica: Autor, Data, Passagem e Categoria */}
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-xs font-bold text-ipa-escuro/60 uppercase tracking-widest border-t border-b border-ipa-bege/30 py-4">
            <div className="flex items-center gap-2">
              <User size={14} className="text-ipa-dourado" />
              {sermao.site_sermoes_autores?.nome}
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-ipa-dourado" />
              {new Date(sermao.data_pregacao).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
            </div>
            
            {sermao.passagem_biblica && (
              <div className="flex items-center gap-2">
                <BookOpen size={14} className="text-ipa-dourado" />
                {sermao.passagem_biblica}
              </div>
            )}
            
            {sermao.site_sermoes_categorias && (
              <div className="flex items-center gap-2">
                <Tag size={14} className="text-ipa-dourado" />
                {sermao.site_sermoes_categorias.nome}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ÁREA DE VÍDEO (YOUTUBE) - Só é renderizada se você cadastrar o ID do vídeo */}
      {sermao.youtube_id && (
        <div className="max-w-5xl mx-auto w-full px-6 -mt-16 mb-16 relative z-10">
          <div className="aspect-video w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-ipa-escuro">
            <iframe 
              width="100%" 
              height="100%" 
              src={`https://www.youtube.com/embed/${sermao.youtube_id}`} 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      {/* ÁREA DE ÁUDIO (SPOTIFY) - Só é renderizada se você colar o Iframe do Spotify */}
      {sermao.spotify_url && (
         <div className="max-w-3xl mx-auto w-full px-6 mb-16 mt-8">
             <div dangerouslySetInnerHTML={{ __html: sermao.spotify_url }} />
         </div>
      )}

      {/* CORPO DO TEXTO (RICH TEXT COM ESTILO DESIRING GOD) */}
      <div className="max-w-3xl mx-auto px-6 w-full mt-12">
        <div 
          className="prose prose-lg md:prose-xl max-w-none text-ipa-escuro/80 font-medium leading-relaxed
                     prose-headings:font-black prose-headings:text-ipa-verde prose-headings:uppercase prose-headings:tracking-tighter
                     prose-p:mb-6 prose-a:text-ipa-dourado prose-blockquote:border-l-4 prose-blockquote:border-ipa-dourado 
                     prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-ipa-escuro/60 prose-blockquote:font-medium"
          dangerouslySetInnerHTML={{ __html: sermao.texto_conteudo }}
        />
      </div>

    </article>
  );
}