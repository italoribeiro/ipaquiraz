import { Metadata } from "next";
import Image from "next/image";

// SEO Especializado para esta página
export const metadata: Metadata = {
  title: "Quem Somos | Igreja Presbiteriana de Aquiraz",
  description: "Conheça a história da fundação da IPAquiraz, iniciada pelo Reverendo Alci Chagas em 2024. Uma igreja reformada e missionária no Ceará.",
  keywords: ["história ipaquiraz", "reverendo alci chagas", "igreja presbiteriana aquiraz", "fé reformada ceará"],
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

      {/* Conteúdo Institucional */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <span className="text-ipa-dourado font-bold tracking-[0.3em] text-xs uppercase block mb-6 text-center md:text-left">
            Fundação e Propósito
          </span>
          
          <div className="space-y-8 text-ipa-escuro/80 text-lg leading-relaxed font-medium font-sans">
            <p>
              A **Igreja Presbiteriana de Aquiraz** nasceu de um ardente desejo missionário de estabelecer o testemunho da fé reformada em solo aquiraense. Fundada em **Abril de 2024**, a igreja é fruto de uma parceria estratégica entre o **Pastor Alci Chagas** e o **PLCE**.
            </p>

            <p>
              O Reverendo Alci Chagas, um experiente pastor dedicado à revitalização de igrejas e à plantação de novos campos missionários, sentiu o chamado ao visitar Aquiraz. Ao observar a ausência de uma Igreja Presbiteriana do Brasil na região, ele compreendeu a urgência de plantar ali uma comunidade que zelasse pela sã doutrina.
            </p>

            <p>
              Movido por essa visão, formou-se uma sólida aliança entre o Presidente do Presbitério, irmãos dedicados e parceiros de fé para a abertura deste campo missionário.
            </p>
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