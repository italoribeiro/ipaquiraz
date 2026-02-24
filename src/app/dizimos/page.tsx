import { Metadata } from "next";
import Image from "next/image";
import { HeartHandshake, Landmark, Users, TrendingUp, Globe, CreditCard } from "lucide-react";

export const metadata: Metadata = {
  title: "Dízimos, Ofertas e Parcerias | IP Aquiraz",
  description: "Seja um cooperador da obra de Deus em Aquiraz. Contribua com o campo missionário e conheça nossos projetos de expansão do Reino.",
};

export default function Dizimos() {
  return (
    <div className="flex flex-col w-full font-sans bg-white">
      {/* 1. Hero: Visão de Mordomia */}
      <section className="bg-ipa-verde py-24 px-6 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <HeartHandshake size={48} className="mx-auto mb-6 text-ipa-bege" />
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">
            Sustento e <span className="text-ipa-bege">Missões</span>
          </h1>
          <p className="text-lg opacity-80 font-medium leading-relaxed italic">
            "Cada um contribua segundo propôs no seu coração; não com tristeza, ou por necessidade; porque Deus ama ao que dá com alegria." — 2 Coríntios 9:7
          </p>
        </div>
      </section>

      {/* 2. Cards de Contribuição e QR Code */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Dados Bancários */}
            <div className="space-y-8">
              <h2 className="text-2xl font-black text-ipa-verde uppercase tracking-tighter border-l-4 border-ipa-dourado pl-4">
                Formas de Contribuir
              </h2>
              <div className="bg-ipa-creme/50 p-8 rounded-3xl border border-ipa-creme shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <Landmark className="text-ipa-verde" />
                  <span className="font-black text-ipa-verde uppercase tracking-widest text-xs">Dados Bancários</span>
                </div>
                <div className="space-y-2 text-ipa-escuro/80 font-bold uppercase tracking-tight text-sm">
                  <p>Banco: <span className="text-ipa-verde">Conta Corrente</span></p>
                  <p>Agência: <span className="text-ipa-verde">4422</span></p>
                  <p>Conta: <span className="text-ipa-verde">5751601528</span></p>
                  <p>Titular: <span className="text-ipa-verde">Emerson Fernandes Rosa</span></p>
                  <div className="mt-6 p-4 bg-white rounded-xl border border-ipa-dourado/20">
                    <p className="text-[10px] text-ipa-dourado mb-1">CHAVE PIX (CELULAR)</p>
                    <p className="text-lg text-ipa-verde break-all">+5585999805907</p>
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code Pix - Imagem deve estar em /public/fff720.png */}
            <div className="flex flex-col items-center">
              <div className="relative w-64 h-64 bg-white p-4 rounded-3xl shadow-2xl border-4 border-ipa-creme">
                <Image 
                  src="/pix-ipa.png" 
                  alt="QR Code Pix" 
                  fill 
                  className="object-contain p-2"
                />
              </div>
              <p className="mt-4 text-[10px] font-bold text-ipa-dourado uppercase tracking-[0.2em]">Escaneie para ofertar com alegria</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Mesa Administrativa de Aquiraz */}
      <section className="py-20 px-6 bg-ipa-creme/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-black text-ipa-verde uppercase tracking-tighter mb-12 text-center">
            Mesa Administrativa
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {[
              { cargo: "Presidente", nome: "Rev. Alci Chagas", color: "bg-ipa-verde text-white" },
              { cargo: "Vice Presidente", nome: "Italo Ribeiro", color: "bg-ipa-dourado text-white" },
              { cargo: "Tesoureiro", nome: "Emerson Rosa", color: "bg-ipa-bege text-ipa-verde" },
              { cargo: "Secretário", nome: "Pablo Studart", color: "bg-white text-ipa-verde" }
            ].map((membro, i) => (
              <div key={i} className={`${membro.color} p-10 flex flex-col items-center text-center transition-transform hover:z-10 hover:scale-105 shadow-sm`}>
                <Users size={24} className="mb-4 opacity-70" />
                <span className="text-[10px] font-black tracking-[0.2em] uppercase mb-2 opacity-80">{membro.cargo}</span>
                <p className="font-black text-lg tracking-tight uppercase">{membro.nome}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Seção Parceria: Investimento Missionário */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <Globe className="mx-auto mb-6 text-ipa-dourado" size={40} />
          <h2 className="text-3xl md:text-5xl font-black text-ipa-verde tracking-tighter uppercase mb-8">
            Invista no Futuro de Aquiraz
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left mb-12">
            <div className="space-y-4">
              <h4 className="flex items-center gap-2 font-black text-ipa-verde uppercase text-sm">
                <TrendingUp size={18} /> O Campo Missionário
              </h4>
              <p className="text-sm text-ipa-escuro/70 leading-relaxed font-medium">
                Aquiraz é um solo fértil para o Evangelho. Com mais de 80 mil habitantes e um crescimento acelerado, nossa meta é consolidar esta congregação em uma Igreja autônoma, expandindo o ensino reformado em toda a região metropolitana.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="flex items-center gap-2 font-black text-ipa-verde uppercase text-sm">
                <CreditCard size={18} /> Parcerias Institucionais
              </h4>
              <p className="text-sm text-ipa-escuro/70 leading-relaxed font-medium">
                Se você ou sua instituição deseja investir em infraestrutura, projetos sociais ou plantação de igrejas no Nordeste, entre em contato para receber nosso plano diretor de expansão.
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6">
            <a href="https://wa.me/5585999805907" className="bg-ipa-verde text-white px-10 py-4 rounded-full font-black text-xs tracking-widest hover:bg-ipa-escuro transition-all">
              SEJA UM PARCEIRO
            </a>
            <a href="https://www.aquiraz.ce.gov.br/omunicipio.php" target="_blank" className="border-2 border-ipa-creme text-ipa-dourado px-10 py-4 rounded-full font-black text-xs tracking-widest hover:border-ipa-dourado transition-all">
              CONHEÇA A CIDADE
            </a>
          </div>
        </div>
      </section>

      {/* 5. Banner: Portal da Transparência */}
      <section className="pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-[40px] bg-ipa-escuro p-8 md:p-16 shadow-2xl">
            {/* Elemento Decorativo de Fundo */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-ipa-verde/10 skew-x-12 translate-x-1/4" />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-ipa-dourado font-black tracking-[0.3em] text-[10px] uppercase block mb-4">
                  Governança e Prestação de Contas
                </span>
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase mb-6 leading-none">
                  Portal da <br /> <span className="text-ipa-bege">Transparência</span>
                </h2>
                <p className="text-white/60 text-lg font-medium leading-relaxed max-w-md">
                  Acompanhe em tempo real a aplicação dos recursos nos trabalhos missionários, evangelísticos e ações de caridade em Aquiraz.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Relatórios Mensais", icon: "📊" },
                  { label: "Impacto Social", icon: "🤝" },
                  { label: "Ações de Caridade", icon: "🍱" },
                  { label: "Expansão de Campo", icon: "🏗️" }
                ].map((item, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm group hover:bg-ipa-dourado transition-all cursor-pointer">
                    <span className="text-2xl mb-3 block">{item.icon}</span>
                    <p className="text-white font-black text-[10px] tracking-widest uppercase">{item.label}</p>
                  </div>
                ))}
                <a 
                  href="/transparencia" 
                  className="sm:col-span-2 bg-ipa-bege text-ipa-verde py-5 rounded-2xl font-black text-xs tracking-[0.3em] uppercase text-center hover:bg-white transition-all shadow-xl"
                >
                  Acessar Portal Completo
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}