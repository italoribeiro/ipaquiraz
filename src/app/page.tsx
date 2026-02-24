import HeroBanner from "@/components/home/hero-banner";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* 1. Banner Inicial */}
      <HeroBanner />

      {/* 2. Seção de Boas Vindas */}
      <section className="py-24 px-6 bg-ipa-creme">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-ipa-dourado font-bold tracking-[0.3em] text-xs uppercase mb-4 block">
            Bem-vindo à
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-ipa-verde mt-2 mb-8 tracking-tighter uppercase">
            Igreja Presbiteriana <br /> de Aquiraz
          </h1>
          <p className="text-ipa-escuro/70 leading-relaxed text-lg md:text-xl font-medium max-w-2xl mx-auto">
            Somos uma comunidade cristã bíblica, confessional e reformada no coração de Aquiraz. 
            Nossa missão é glorificar a Deus através da proclamação do Evangelho.
          </p>
          <div className="mt-12 flex flex-wrap justify-center gap-6">
            <a href="/visita" className="bg-ipa-verde text-white px-10 py-4 rounded-full font-bold text-sm tracking-widest hover:bg-ipa-escuro transition-all shadow-xl hover:scale-105">
              PROGRAME SUA VISITA
            </a>
            <a href="/quem-somos" className="border-2 border-ipa-verde text-ipa-verde px-10 py-4 rounded-full font-bold text-sm tracking-widest hover:bg-ipa-verde hover:text-white transition-all hover:scale-105">
              NOSSA HISTÓRIA
            </a>
          </div>
        </div>
      </section>

      {/* 3. Grid de Atalhos Rápidos (Cards Modernos) */}
      <section className="py-20 px-6 bg-white border-t border-ipa-creme">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              title: "Escola Bíblica", 
              time: "DOMINGO - 09:00H", 
              desc: "Ensino profundo das Escrituras.",
              icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
              bgColor: "bg-ipa-creme",
              iconColor: "text-ipa-verde"
            },
            { 
              title: "Culto de Adoração", 
              time: "DOMINGO - 18:00H", 
              desc: "Culto solene e cristocêntrico.",
              icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
              bgColor: "bg-ipa-verde",
              iconColor: "text-white"
            },
            { 
              title: "Oração", 
              time: "QUARTA - 19:30H", 
              desc: "Reunião de súplica e estudo.",
              icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
              bgColor: "bg-ipa-creme",
              iconColor: "text-ipa-verde"
            }
          ].map((item, idx) => (
            <div key={idx} className={`${item.bgColor} p-12 rounded-3xl flex flex-col items-center text-center transition-all hover:shadow-2xl`}>
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
                <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={`w-8 h-8 ${item.iconColor}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
              </div>
              <h3 className={`text-2xl font-black mb-2 tracking-tight ${item.bgColor === 'bg-ipa-verde' ? 'text-white' : 'text-ipa-verde'}`}>
                {item.title}
              </h3>
              <p className={`text-[10px] font-bold tracking-[0.25em] mb-4 ${item.bgColor === 'bg-ipa-verde' ? 'text-ipa-bege' : 'text-ipa-dourado'}`}>
                {item.time}
              </p>
              <p className={`text-sm font-medium leading-relaxed ${item.bgColor === 'bg-ipa-verde' ? 'text-white/80' : 'text-ipa-escuro/60'}`}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Localização e Mapa */}
      <section className="py-24 bg-ipa-creme/30">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-ipa-dourado font-bold tracking-widest text-xs uppercase block mb-4">Como chegar</span>
            <h2 className="text-4xl font-black text-ipa-verde tracking-tighter mb-6 uppercase">Venha nos visitar</h2>
            <p className="text-ipa-escuro/70 mb-10 text-lg font-medium leading-relaxed">
              R. Açucena, 289 - Parques das Flores, Aquiraz-CE. <br />
              Estamos de portas abertas para receber você e sua família.
            </p>
            <a 
              href="https://www.google.com/maps/dir/?api=1&destination=Rua+Acucena+289+Aquiraz" 
              target="_blank" 
              className="inline-block bg-white text-ipa-verde border-2 border-ipa-verde px-8 py-4 rounded-full font-bold text-sm tracking-widest hover:bg-ipa-verde hover:text-white transition-all shadow-lg"
            >
              TRAÇAR ROTA NO MAPS
            </a>
          </div>
          <div className="h-[450px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white relative group">
            <iframe 
              width="100%" 
              height="100%" 
              frameBorder="0" 
              src="https://www.openstreetmap.org/export/embed.html?bbox=-38.3973%2C-3.9038%2C-38.3883%2C-3.8968&layer=mapnik&marker=-3.9003%2C-38.3928"
              className="grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}