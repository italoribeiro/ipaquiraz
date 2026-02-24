import { Metadata } from "next";
import { FileText, Download, PlayCircle, BookOpen, Users } from "lucide-react";

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

const categoriasEstudos = [
  {
    tema: "Sola Scriptura: Estudos Bíblicos",
    materiais: [
      { titulo: "Introdução à Fé Reformada", autor: "Rev. Alci Chagas", tipo: "PDF", link: "#" },
      { titulo: "Exposição em Romanos - Cap 1 a 4", autor: "Equipe de Ensino", tipo: "PDF", link: "#" },
    ]
  },
  {
    tema: "Doutrina e Confessionalidade",
    materiais: [
      { titulo: "Breve Catecismo Comentado", autor: "Recurso Externo", tipo: "Link", link: "#" },
      { titulo: "As 5 Solas da Reforma", autor: "Rev. Alci Chagas", tipo: "PDF", link: "#" },
    ]
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

      {/* 3. Biblioteca de Recursos (Grid Inteligente por Temas) */}
      <section className="py-20 px-6 bg-ipa-creme/20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-black text-ipa-verde uppercase tracking-tighter mb-12 text-center">
            Biblioteca de Recursos
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {categoriasEstudos.map((cat, idx) => (
              <div key={idx} className="space-y-6">
                <h4 className="text-sm font-black text-ipa-dourado uppercase tracking-[0.2em] mb-4">{cat.tema}</h4>
                <div className="space-y-3">
                  {cat.materiais.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-5 bg-white rounded-2xl border border-ipa-bege/20 hover:border-ipa-verde transition-all group">
                      <div className="flex items-center gap-4">
                        <FileText className="text-ipa-bege group-hover:text-ipa-verde transition-colors" size={20} />
                        <div>
                          <p className="text-sm font-bold text-ipa-verde uppercase tracking-tight">{item.titulo}</p>
                          <p className="text-[10px] text-ipa-escuro/40 font-bold uppercase">{item.autor}</p>
                        </div>
                      </div>
                      <a href={item.link} className="p-2 bg-ipa-creme rounded-lg text-ipa-verde hover:bg-ipa-verde hover:text-white transition-all">
                        <Download size={16} />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Vídeos e Palestras (Embed Section) */}
      <section className="py-24 px-6 bg-ipa-verde">
        <div className="max-w-5xl mx-auto text-center text-white">
          <PlayCircle size={48} className="mx-auto mb-6 text-ipa-dourado" />
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-6">Palestras e Pregações</h2>
          <p className="mb-12 opacity-80 font-medium">Acesse nosso conteúdo em vídeo para aprofundar seu conhecimento teológico onde quer que esteja.</p>
          
          <div className="aspect-video w-full rounded-3xl overflow-hidden shadow-2xl border-8 border-white/10">
            {/* Exemplo de Embed do YouTube da IP Aquiraz */}
            <iframe 
              width="100%" 
              height="100%" 
              src="https://www.youtube.com/embed/videoseries?list=PL_SEU_PLAYLIST_ID" 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}