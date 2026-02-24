import HeroBanner from "@/components/home/hero-banner";
import Link from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* 1. Banner Inicial */}
      <HeroBanner />

      {/* 2. Seção de Boas Vindas (Estática) */}
      <section className="py-20 px-4 bg-ipa-creme">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-ipa-dourado font-bold tracking-[0.2em] text-sm uppercase">Bem-vindo à</span>
          <h1 className="font-serif text-4xl md:text-5xl text-ipa-verde mt-2 mb-6">
            Igreja Presbiteriana de Aquiraz
          </h1>
          <p className="text-ipa-escuro/80 leading-relaxed text-lg">
            Somos uma comunidade cristã bíblica, confessional e reformada no coração de Aquiraz. 
            Nossa missão é glorificar a Deus através da proclamação do Evangelho e da edificação mútua.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a href="/visita" className="bg-ipa-verde text-white px-8 py-4 rounded-md font-bold hover:bg-ipa-escuro transition shadow-lg">
              PROGRAME SUA VISITA
            </a>
            <a href="/quem-somos" className="border-2 border-ipa-verde text-ipa-verde px-8 py-4 rounded-md font-bold hover:bg-ipa-verde hover:text-white transition">
              NOSSA HISTÓRIA
            </a>
          </div>
        </div>
      </section>

      {/* 3. Grid de Atalhos Rápidos */}
      <section className="grid grid-cols-1 md:grid-cols-3 w-full border-t border-ipa-verde/10">
        <div className="bg-white p-12 flex flex-col items-center text-center border-b md:border-b-0 md:border-r border-ipa-verde/10">
           <div className="w-12 h-12 bg-ipa-creme rounded-full flex items-center justify-center mb-4 text-ipa-verde">📖</div>
           <h3 className="font-serif text-xl text-ipa-verde mb-2">Escola Bíblica</h3>
           <p className="text-sm opacity-70">Domingos às 09:00h. Ensino profundo das Escrituras.</p>
        </div>
        <div className="bg-ipa-verde p-12 flex flex-col items-center text-center text-white">
           <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4">⛪</div>
           <h3 className="font-serif text-xl mb-2">Culto de Adoração</h3>
           <p className="text-sm opacity-80">Domingos às 18:00h. Culto solene e cristocêntrico.</p>
        </div>
        <div className="bg-white p-12 flex flex-col items-center text-center">
           <div className="w-12 h-12 bg-ipa-creme rounded-full flex items-center justify-center mb-4 text-ipa-verde">🙏</div>
           <h3 className="font-serif text-xl text-ipa-verde mb-2">Oração</h3>
           <p className="text-sm opacity-70">Quartas-feiras às 19:30h. Reunião de súplica e estudo.</p>
        </div>
      </section>
    </div>
  );
}