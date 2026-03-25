import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Programação | Igreja Presbiteriana de Aquiraz",
  description: "Confira nossos horários de Cultos, Escola Bíblica Dominical e Reuniões de Oração. Participe da nossa comunidade em Aquiraz.",
  keywords: [
    "horário de culto aquiraz",
    "culto domingo aquiraz",
    "igreja presbiteriana horário aquiraz"
  ]

};

export default function Programacao() {
  return (
    <div className="flex flex-col w-full font-sans">
      {/* 1. Header da Página */}
      <section className="bg-ipa-verde py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-ipa-bege font-bold tracking-[0.3em] text-xs uppercase block mb-4">
            Vida Comunitária
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase">
            Nossa Agenda
          </h1>
          <p className="mt-6 text-white/70 max-w-xl mx-auto text-lg font-medium">
            Acompanhe o ritmo das nossas atividades e planeje sua visita. Nosso tempo é dedicado à glória de Deus.
          </p>
        </div>
      </section>

      {/* 2. Cards de Atividades Fixas (Grid Moderno) */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-black text-ipa-verde tracking-tighter uppercase mb-12 text-center md:text-left border-b border-ipa-creme pb-4">
            Horários Regulares
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                dia: "Domingo", 
                hora: "09:00h", 
                titulo: "Escola Bíblica", 
                desc: "Estudo sistemático das Escrituras para todas as idades.",
                icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              },
              { 
                dia: "Domingo", 
                hora: "18:00h", 
                titulo: "Culto de Adoração", 
                desc: "Nossa principal reunião solene de louvor e pregação da Palavra.",
                icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              },
              { 
                dia: "Quarta-feira", 
                hora: "19:30h", 
                titulo: "Oração e Estudo", 
                desc: "Momento vital de intercessão e aprofundamento bíblico.",
                icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              }
            ].map((card, i) => (
              <div key={i} className="bg-ipa-creme/50 p-10 rounded-3xl border border-ipa-creme flex flex-col items-center text-center group hover:bg-ipa-verde transition-all duration-500">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                  <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8 text-ipa-verde">
                    <path strokeLinecap="round" strokeLinejoin="round" d={card.icon} />
                  </svg>
                </div>
                <span className="text-[10px] font-bold tracking-[0.3em] text-ipa-dourado uppercase mb-2 group-hover:text-white/60">
                  {card.dia} — {card.hora}
                </span>
                <h3 className="text-2xl font-black text-ipa-verde group-hover:text-white transition-colors mb-4 uppercase tracking-tighter">
                  {card.titulo}
                </h3>
                <p className="text-sm font-medium text-ipa-escuro/60 group-hover:text-white/80 leading-relaxed">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Programação Extra (Google Agenda) */}
      <section className="py-24 px-6 bg-ipa-creme/30">
        <div className="max-w-7xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-black text-ipa-verde tracking-tighter uppercase mb-4">
            Atividades Extras
          </h2>
          <p className="text-ipa-escuro/60 font-medium max-w-2xl mx-auto">
            Utilize nossa agenda interativa para conferir reuniões de sociedades internas, ensaios e eventos especiais.
          </p>
        </div>

        <div className="max-w-5xl mx-auto h-[600px] rounded-3xl overflow-hidden shadow-2xl border-8 border-white bg-white">
          <iframe 
            src="https://calendar.google.com/calendar/embed?src=igrejapresbiterianadeaquiraz%40gmail.com&ctz=America%2FFortaleza" 
            style={{ border: 0 }} 
            width="100%" 
            height="100%" 
            className="grayscale contrast-125 opacity-80"
            ></iframe>
        </div>
      </section>
    </div>
  );
}