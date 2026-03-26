// src/components/ensino/BibliotecaDinamica.tsx
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { FileText, Download, PlayCircle, Headphones, Link2, ExternalLink, ArrowRight, TrendingUp, Eye } from "lucide-react";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function BibliotecaDinamica() {
  const [materiais, setMateriais] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarDestaques() {
      // Puxa os 6 materiais mais acessados
      const { data } = await supabase
        .from("site_ebd_materiais")
        .select(`*, site_ebd_categorias(nome)`)
        .eq("ativo", true)
        .order("cliques", { ascending: false })
        .limit(6);

      if (data) setMateriais(data);
      setCarregando(false);
    }
    carregarDestaques();
  }, []);

  // FUNÇÃO DO "PEDÁGIO" COM ANTISPAM
  const registrarClique = async (id: string) => {
    // 1. Pega a lista de materiais que essa pessoa já clicou (salva no navegador)
    const jaClicados = JSON.parse(localStorage.getItem('@ipa_cliques_ebd') || '[]');

    // 2. Se o ID do material já estiver na lista, o cara já clicou antes!
    if (jaClicados.includes(id)) {
      console.log("Clique repetido ignorado para métricas.");
      return; // Para a execução da função aqui, não vai pro banco!
    }

    // 3. Se for a primeira vez, adiciona o ID na lista e salva no navegador
    jaClicados.push(id);
    localStorage.setItem('@ipa_cliques_ebd', JSON.stringify(jaClicados));

    // 4. Atualiza o visual instantaneamente na tela do usuário
    setMateriais(prev => prev.map(m => 
      m.id === id ? { ...m, cliques: (m.cliques || 0) + 1 } : m
    ));

    // 5. Manda a informação pro banco de dados em background
    await supabase.rpc('increment_clique_recurso', { row_id: id });
  };

  const getIconeMidia = (tipo: string) => {
    switch(tipo) {
      case 'video': return <PlayCircle size={24} className="text-red-400 group-hover:text-red-500 transition-colors" />;
      case 'audio': return <Headphones size={24} className="text-blue-400 group-hover:text-blue-500 transition-colors" />;
      case 'link': return <Link2 size={24} className="text-orange-400 group-hover:text-orange-500 transition-colors" />;
      default: return <FileText size={24} className="text-ipa-bege group-hover:text-ipa-verde transition-colors" />;
    }
  };

  if (carregando) {
    return (
      <div className="py-20 text-center flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-ipa-creme border-t-ipa-verde rounded-full animate-spin"></div>
        <span className="text-xs font-black uppercase text-ipa-verde tracking-widest">Carregando Destaques...</span>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-center gap-2 text-ipa-dourado mb-8">
        <TrendingUp size={18} />
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Materiais Mais Acessados</span>
      </div>

      {/* Grid de Destaques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materiais.map((item) => (
          <div key={item.id} className="flex flex-col justify-between p-6 bg-white rounded-3xl border border-ipa-bege/20 hover:border-ipa-verde transition-all group shadow-sm hover:shadow-xl relative overflow-hidden">
            
            {/* Tag da Categoria (Direita) */}
            <div className="absolute top-0 right-0 bg-ipa-creme px-4 py-1 rounded-bl-xl border-b border-l border-ipa-bege/20">
              <span className="text-[8px] font-black text-ipa-verde uppercase tracking-widest">
                {item.site_ebd_categorias?.nome || 'Estudo'}
              </span>
            </div>

            <div className="mt-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gray-50 w-12 h-12 rounded-xl flex items-center justify-center border border-gray-100 group-hover:scale-110 transition-transform">
                  {getIconeMidia(item.tipo_midia)}
                </div>
                
                {/* NOVO: Contador de Visualizações (Esquerda do ícone) */}
                <div className="flex items-center gap-1.5 text-gray-400 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                  <Eye size={14} className="text-ipa-dourado" />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {item.cliques || 0}
                  </span>
                </div>
              </div>

              <h3 className="text-lg font-black text-ipa-verde uppercase tracking-tighter leading-tight mb-2 line-clamp-2">
                {item.titulo}
              </h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                {item.autor || 'IP Aquiraz'}
              </p>
            </div>
            
            {/* Botão de Ação com o Interceptador de Clique */}
            <a 
              href={item.url_recurso} 
              target={item.comportamento} 
              onClick={() => registrarClique(item.id)}
              className="mt-auto flex items-center justify-between w-full p-4 bg-ipa-creme rounded-xl text-ipa-verde hover:bg-ipa-verde hover:text-white transition-all font-bold text-xs uppercase tracking-widest"
              title="Acessar Material"
            >
              <span>Acessar</span>
              {item.tipo_midia === 'arquivo' ? <Download size={16} /> : <ExternalLink size={16} />}
            </a>
          </div>
        ))}
      </div>

      {/* Botão Ver Mais */}
      <div className="text-center pt-8">
        <Link 
          href="/ensino/biblioteca" 
          className="inline-flex items-center justify-center gap-3 border-2 border-ipa-verde text-ipa-verde px-10 py-4 rounded-full font-black text-xs tracking-[0.2em] hover:bg-ipa-verde hover:text-white transition-all uppercase group"
        >
          Explorar Acervo Completo
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}