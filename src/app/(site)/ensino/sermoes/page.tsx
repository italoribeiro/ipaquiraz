import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { PlayCircle, Calendar, ChevronRight } from "lucide-react";
import { Metadata } from "next";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Sermões e Pregações | Igreja Presbiteriana de Aquiraz",
  description: "Ouça e assista aos sermões, pregações e palestras da Igreja Presbiteriana de Aquiraz. Uma abordagem fiel às Escrituras e à Teologia Reformada.",
};

// Inicia o cliente do Supabase (Usando as variáveis de ambiente padrão do Next.js)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Função para buscar os sermões no banco
async function getSermoes() {
  const { data, error } = await supabase
    .from("site_sermoes_mensagens")
    .select(`
      id,
      titulo,
      slug,
      data_pregacao,
      resumo,
      imagem_capa_url,
      youtube_id,
      site_sermoes_autores ( nome, foto_url ),
      site_sermoes_categorias ( nome, slug )
    `)
    .order("data_pregacao", { ascending: false });

  if (error) {
    console.error("Erro ao buscar sermões:", error);
    return [];
  }
  return data;
}

export default async function SermoesPage() {
  const sermoes = await getSermoes();

  return (
    <div className="flex flex-col w-full font-sans bg-white min-h-screen">
      
      {/* 1. Cabeçalho Minimalista */}
      <section className="bg-ipa-creme py-16 px-6 border-b border-ipa-bege/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-ipa-dourado mb-6">
            <Link href="/ensino" className="hover:text-ipa-verde transition-colors">Ensino</Link>
            <ChevronRight size={12} />
            <span className="text-ipa-verde">Mensagens</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-ipa-verde tracking-tighter uppercase mb-4">
            Mensagens
          </h1>
          <p className="text-ipa-escuro/70 text-lg font-medium max-w-2xl">
            Sermões, conferências e estudos bíblicos para o fortalecimento da sua fé.
          </p>
        </div>
      </section>

      {/* 2. Grade de Sermões (Estilo Desiring God) */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          
          {sermoes.length === 0 ? (
            <div className="text-center py-20 text-ipa-escuro/50 font-medium">
              Nenhuma mensagem encontrada no momento.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {sermoes.map((sermao: any) => (
                <Link href={`/ensino/sermoes/${sermao.slug}`} key={sermao.id} className="group flex flex-col h-full">
                  
                  {/* Capa da Mensagem (Thumbnail) */}
                  <div className="relative aspect-video bg-ipa-escuro w-full overflow-hidden mb-6 border border-ipa-creme">
                    {sermao.imagem_capa_url ? (
                      <img 
                        src={sermao.imagem_capa_url} 
                        alt={sermao.titulo}
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                      />
                    ) : sermao.youtube_id ? (
                      <img 
                        src={`https://img.youtube.com/vi/${sermao.youtube_id}/maxresdefault.jpg`} 
                        alt={sermao.titulo}
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-ipa-verde flex items-center justify-center opacity-90 group-hover:opacity-100 transition-all">
                        <PlayCircle size={48} className="text-white/20" />
                      </div>
                    )}
                    
                    {/* Badge "Mensagem" flutuante */}
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                      <PlayCircle size={12} className="text-ipa-dourado" />
                      Mensagem
                    </div>
                  </div>

                 {/* Conteúdo do Card */}
                  <div className="flex flex-col flex-grow">
                    <h3 className="text-2xl font-black text-ipa-verde uppercase tracking-tighter leading-tight mb-1 group-hover:text-ipa-dourado transition-colors">
                      {sermao.titulo}
                    </h3>
                    
                    {/* NOVA LINHA: Categoria do Sermão */}
                    <p className="text-xs font-bold text-ipa-dourado uppercase tracking-[0.2em] mb-3">
                      {sermao.site_sermoes_categorias?.nome}
                    </p>
                    
                    
                    
                    
                    <div className="flex items-center gap-2 text-ipa-dourado text-[10px] font-black uppercase tracking-widest mb-4">
                      <Calendar size={12} />
                      {new Date(sermao.data_pregacao).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </div>

                    <p className="text-sm text-ipa-escuro/70 font-medium leading-relaxed mb-8 flex-grow">
                      {sermao.resumo}
                    </p>

                    {/* Rodapé do Card: Autor */}
                    <div className="flex items-center gap-3 pt-4 border-t border-ipa-creme/50 mt-auto">
                      {sermao.site_sermoes_autores?.foto_url ? (
                        <img 
                          src={sermao.site_sermoes_autores.foto_url} 
                          alt={sermao.site_sermoes_autores.nome} 
                          className="w-8 h-8 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-ipa-creme flex items-center justify-center text-ipa-verde font-bold text-xs uppercase">
                          {sermao.site_sermoes_autores?.nome?.charAt(0) || "IP"}
                        </div>
                      )}
                      <span className="text-xs font-bold text-ipa-escuro uppercase tracking-tight">
                        {sermao.site_sermoes_autores?.nome}
                      </span>
                    </div>
                  </div>

                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  );
}