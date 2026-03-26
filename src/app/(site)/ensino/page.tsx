// src/app/ensino/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import { PlayCircle, BookOpen, Users, ArrowRight } from "lucide-react";
// 1. IMPORTAMOS O NOSSO NOVO COMPONENTE
import BibliotecaDinamica from "@/components/ensino/BibliotecaDinamica";

export const metadata: Metadata = {
  title: "Ensino e Recursos Teológicos | IP Aquiraz",
  description: "Explore nossa biblioteca de estudos bíblicos, palestras e classes da EBD. Material focado na Teologia Reformada, Confessionalidade e Sã Doutrina em Aquiraz.",
  keywords: ["estudos bíblicos pdf", "teologia reformada", "escola bíblica dominical", "presbiterianismo", "cursos teológicos aquiraz"],
};

const classes = [
  { 
    title: "Sala Abraão", 
    subtitle: "Adultos", 
    desc: "Estudo aprofundado da Teologia Sistemática e Confissão de Fé de Westminster.",
    icon: <Users size={24} />,
    status: "Ativa"
  },
  { 
    title: "Sala Davi", 
    subtitle: "Infantil", 
    desc: "O Catecismo e as histórias bíblicas ensinadas com fidelidade para os pequenos.",
    icon: <BookOpen size={24} />,
    status: "Ativa"
  },
  { 
    title: "Família Cristã", 
    subtitle: "Tema Especial", 
    desc: "Em breve: Uma série de estudos sobre o lar à luz das Escrituras.",
    icon: <Users size={24} />,
    status: "Em Breve"
  }
];

export default function Ensino() {
  return (
    <div className="flex flex-col w-full font-sans bg-white">
      {/* 1. Hero SEO Focused */}
      <section className="bg-ipa-creme py-24 px-6 border-b border-ipa-bege/30">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-ipa-dourado font-bold tracking-[0.3em] text-[10px] uppercase block mb-4">
            Capacitação Teológica
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-ipa-verde tracking-tighter uppercase mb-6">
            Ensino e <br /> <span className="text-ipa-dourado">Sã Doutrina</span>
          </h1>
          <p className="text-ipa-escuro/70 text-lg font-medium leading-relaxed italic">
            "Examinais as Escrituras... são elas mesmas que testificam de mim." — João 5:39
          </p>
        </div>
      </section>

      {/* 2. Classes da EBD (Cards Modernos) */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-black text-ipa-verde uppercase tracking-tighter mb-12 border-l-4 border-ipa-dourado pl-4">
            Nossas Classes (EBD)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {classes.map((classe, i) => (
              <div key={i} className={`p-10 rounded-3xl border transition-all duration-500 ${classe.status === 'Ativa' ? 'bg-white border-ipa-creme shadow-sm hover:shadow-xl hover:border-ipa-dourado' : 'bg-ipa-creme/50 border-dashed opacity-70'}`}>
                <div className="text-ipa-verde mb-6">{classe.icon}</div>
                <h3 className="text-2xl font-black text-ipa-verde uppercase tracking-tighter">{classe.title}</h3>
                <p className="text-ipa-dourado font-bold text-[10px] tracking-widest uppercase mb-4">{classe.subtitle}</p>
                <p className="text-sm text-ipa-escuro/60 font-medium leading-relaxed">{classe.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. BIBLIOTECA DE RECURSOS (AGORA É DINÂMICA!) */}
      <section className="py-20 px-6 bg-ipa-creme/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-black text-ipa-verde uppercase tracking-tighter mb-2">
              Biblioteca de Recursos
            </h2>
            <p className="text-xs font-bold uppercase tracking-widest text-ipa-dourado">Material de Estudo e Edificação</p>
          </div>
          
          {/* 2. INJETAMOS O COMPONENTE AQUI */}
          <BibliotecaDinamica />

        </div>
      </section>

      {/* 4. Módulo de Sermões */}
      <section className="py-24 px-6 bg-ipa-verde text-white">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <PlayCircle size={48} className="mx-auto text-ipa-dourado opacity-90" />
          
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
            Sermões e Pregações
          </h2>
          
          <p className="text-lg opacity-80 font-medium leading-relaxed max-w-2xl mx-auto">
            Acesse nosso acervo completo de mensagens em vídeo, áudio e texto. Recursos projetados para edificar a sua fé, fundamentados na inerrância das Escrituras e na sã doutrina.
          </p>

          <Link href="/ensino/sermoes" className="inline-flex items-center justify-center gap-3 bg-ipa-dourado text-ipa-escuro px-10 py-5 rounded-full font-black text-sm tracking-widest hover:bg-white transition-all shadow-xl uppercase mt-8 group">
            Acessar Biblioteca de Mensagens
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}