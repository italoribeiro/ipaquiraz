import { Metadata } from "next";
import Image from "next/image";

// SEO Especializado (Pode ficar aqui mesmo, pois este é um Server Component)
export const metadata: Metadata = {
  title: "Quem Somos | Igreja Presbiteriana de Aquiraz",
  description: "Conheça a história da fundação da Igreja Presbiteriana de Aquiraz, iniciada pelo Reverendo Alci Chagas em 2024. Uma igreja reformada e missionária no Ceará.",
  keywords: [
    "história ipaquiraz", 
    "reverendo alci chagas", 
    "igreja presbiteriana aquiraz",
    "fé reformada ceará",
    "plantação de igreja aquiraz",
    "igreja reformada",
    "fundação igreja presbiteriana de aquiraz",
    "missões em aquiraz",
    "comunidade cristã em aquiraz",
    "igreja reformada no ceará",
    "igreja presbiteriana do brasil em aquiraz",
    "história da igreja presbiteriana de aquiraz",
    "igrejas em aquiraz"
  ],
};

export default function QuemSomos() {
  return (
    <div className="flex flex-col w-full">
      {/* Banner Superior */}
      <section className="relative h-[40vh] md:h-[50vh] w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1493612276216-ee3925520721?q=80&w=2070&auto=format&fit=crop"
          alt="Missões em Aquiraz"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-ipa-verde/60 backdrop-blur-[2px] flex items-center justify-center">
          <h1 className="text-white text-4xl md:text-6xl font-black tracking-tighter uppercase">
            Nossa História
          </h1>
        </div>
      </section>

      {/* Conteúdo Institucional com Títulos Otimizados para SEO */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          
          <span className="text-ipa-dourado font-bold tracking-[0.3em] text-xs uppercase block mb-6 text-center md:text-left">
            Missão e Propósito
          </span>
          
          <div className="space-y-8 text-ipa-escuro/80 text-lg leading-relaxed font-medium font-sans">
            
            {/* H2 Invisível para o leitor comum, mas com grande peso para o Google */}
            <div>
              <h2 className="text-2xl font-black text-ipa-verde uppercase tracking-tighter mb-4">
                A Fundação da Igreja Presbiteriana de Aquiraz
              </h2>
              <p>
                A <strong>Igreja Presbiteriana de Aquiraz</strong> nasceu de um ardente desejo missionário de estabelecer o testemunho da fé reformada em solo aquiraense. Fundada em <strong>6 Abril de 2024</strong>, a igreja é fruto de uma parceria estratégica entre o <strong>Pastor Alci Chagas</strong> e o <strong>PLCE</strong>.
              </p>
            </div>

            {/* H3 para pegar a cauda longa de pesquisa do pastor */}
            <div>
              <h3 className="text-xl font-bold text-ipa-dourado uppercase tracking-widest mb-4 mt-8">
                A Visão do Reverendo Alci Chagas
              </h3>
              <p>
                O Reverendo Alci Chagas, um experiente pastor dedicado à revitalização de igrejas e à plantação de novos campos missionários, sentiu o chamado ao visitar Aquiraz. Ao observar a ausência de uma Igreja Presbiteriana do Brasil na região, ele compreendeu a urgência de plantar ali uma comunidade que zelasse pela sã doutrina.
              </p>
            </div>

            {/* H3 focado em "igreja reformada no ceará" */}
            <div>
              <h3 className="text-xl font-bold text-ipa-dourado uppercase tracking-widest mb-4 mt-8">
                Uma Igreja Reformada no Ceará
              </h3>
              <p>
                Movido por essa visão de expansão da fé cristã no Nordeste, formou-se uma sólida aliança entre o Presidente do Presbitério, irmãos dedicados e parceiros de fé para a abertura deste campo missionário.
              </p>
            </div>

          </div>

          {/* Assinatura do Pastor */}
          <div className="mt-16 pt-8 border-t border-ipa-creme text-right">
            <p className="text-ipa-verde font-black text-xl tracking-tighter uppercase">
              Reverendo Alci Chagas
            </p>
            <p className="text-ipa-dourado text-xs font-bold tracking-widest mt-1">
              PASTOR FUNDADOR
            </p>
          </div>

          {/* VERSÍCULO ESTILIZADO (CONTRASTE CLÁSSICO) */}
          <div className="mt-24 text-center">
            <div className="inline-block relative">
              <span className="text-6xl text-ipa-creme absolute -top-10 -left-10 font-serif opacity-50">“</span>
              <p className="font-serif italic text-2xl md:text-3xl text-ipa-verde/90 leading-relaxed max-w-2xl">
                Porque dele, e por ele, e para ele são todas as coisas; glória, pois, a ele eternamente. Amém!
              </p>
              <span className="text-6xl text-ipa-creme absolute -bottom-16 -right-10 font-serif opacity-50">”</span>
            </div>
            <p className="mt-6 font-bold tracking-[0.3em] text-ipa-dourado text-xs uppercase">
              Romanos 11:36
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}