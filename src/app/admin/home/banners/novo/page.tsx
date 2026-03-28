"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Save, Image as ImageIcon, Link as LinkIcon, CalendarClock, Settings } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function NovoBannerPage() {
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);

  // ESTADOS DO FORMULÁRIO
  const [ativo, setAtivo] = useState(true);
  const [titulo, setTitulo] = useState("");
  const [subtitulo, setSubtitulo] = useState("");
  const [textoBotao, setTextoBotao] = useState("");
  
  const [imagemDesktopUrl, setImagemDesktopUrl] = useState("");
  const [imagemMobileUrl, setImagemMobileUrl] = useState("");
  
  const [linkDestino, setLinkDestino] = useState("");
  const [linkAbertura, setLinkAbertura] = useState("_self");
  const [textoAvisoModal, setTextoAvisoModal] = useState("");
  
  const [tempoExibicao, setTempoExibicao] = useState(5000);
  const [overlayOpacidade, setOverlayOpacidade] = useState(50);
  const [seoAlt, setSeoAlt] = useState("");
  
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  async function salvarBanner(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);

    if (!imagemDesktopUrl) {
      alert("A imagem para Desktop é obrigatória!");
      setCarregando(false);
      return;
    }

    const { error } = await supabase.from("site_banners").insert([{
      ativo,
      titulo,
      subtitulo: subtitulo || null,
      texto_botao: textoBotao || null,
      imagem_desktop_url: imagemDesktopUrl,
      imagem_mobile_url: imagemMobileUrl || null,
      link_destino: linkDestino || null,
      link_abertura: linkAbertura,
      texto_aviso_modal: textoAvisoModal || null,
      tempo_exibicao: tempoExibicao,
      overlay_opacidade: overlayOpacidade,
      seo_alt: seoAlt || null,
      data_inicio: dataInicio ? new Date(dataInicio).toISOString() : null,
      data_fim: dataFim ? new Date(dataFim).toISOString() : null,
    }]);

    if (error) {
      alert("Erro ao salvar banner: " + error.message);
      setCarregando(false);
    } else {
      router.push("/admin/home/banners");
      router.refresh();
    }
  }

  return (
    <div className="p-10 w-full pb-24 font-sans bg-gray-50/50 min-h-screen flex justify-center">
      <div className="w-full max-w-4xl">
        
        <Link href="/admin/home/banners" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-ipa-verde transition-colors mb-8">
          <ChevronLeft size={16} /> Voltar para Banners
        </Link>

        <form onSubmit={salvarBanner} className="flex flex-col gap-8">
          
          <div className="flex justify-between items-end mb-2">
            <h1 className="text-3xl font-black text-ipa-verde uppercase tracking-tighter">
              Novo Banner
            </h1>
            <button type="submit" disabled={carregando} className="bg-ipa-dourado hover:bg-yellow-600 text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-sm flex items-center gap-3 transition-colors shadow-lg">
              {carregando ? "Salvando..." : <><Save size={18} /> Publicar Banner</>}
            </button>
          </div>

          <div className="flex flex-col gap-6">
            
            {/* Bloco 1: Textos */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
              <h3 className="font-black text-ipa-escuro uppercase tracking-widest text-xs flex items-center gap-2 border-b border-gray-50 pb-3">
                <ImageIcon size={14} className="text-ipa-dourado"/> Conteúdo Principal
              </h3>
              
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Título Principal *</label>
                <input required type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex: Domingo da Família" className="p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-ipa-verde font-bold text-lg" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Subtítulo (Opcional)</label>
                <textarea value={subtitulo} onChange={(e) => setSubtitulo(e.target.value)} placeholder="Uma breve descrição..." rows={2} className="p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-ipa-verde resize-none" />
              </div>
            </div>

            {/* Bloco 2: Imagens */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
              <h3 className="font-black text-ipa-escuro uppercase tracking-widest text-xs flex items-center gap-2 border-b border-gray-50 pb-3">
                <ImageIcon size={14} className="text-ipa-dourado"/> Imagens Responsivas
              </h3>
              
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">URL da Imagem Desktop * (Formato Horizontal)</label>
                <input required type="url" value={imagemDesktopUrl} onChange={(e) => setImagemDesktopUrl(e.target.value)} placeholder="https://..." className="p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-ipa-verde text-sm" />
              </div>

              <div className="flex flex-col gap-2 mt-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">URL da Imagem Mobile (Opcional - Formato Vertical)</label>
                <input type="url" value={imagemMobileUrl} onChange={(e) => setImagemMobileUrl(e.target.value)} placeholder="https://..." className="p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-ipa-verde text-sm" />
                <p className="text-[10px] text-gray-400">Se deixar em branco, o sistema usará a imagem Desktop centralizada no celular.</p>
              </div>
            </div>

            {/* Bloco 3: Botão e Link */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
              <h3 className="font-black text-ipa-escuro uppercase tracking-widest text-xs flex items-center gap-2 border-b border-gray-50 pb-3">
                <LinkIcon size={14} className="text-ipa-dourado"/> Ação (Botão)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Texto do Botão</label>
                  <input type="text" value={textoBotao} onChange={(e) => setTextoBotao(e.target.value)} placeholder="Ex: Saiba Mais" className="p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-ipa-verde" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Link de Destino</label>
                  <input type="text" value={linkDestino} onChange={(e) => setLinkDestino(e.target.value)} placeholder="/ensino ou https://..." className="p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-ipa-verde" />
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Comportamento do Link</label>
                <select value={linkAbertura} onChange={(e) => setLinkAbertura(e.target.value)} className="p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-ipa-verde cursor-pointer">
                  <option value="_self">Abrir na mesma página (Padrão)</option>
                  <option value="_blank">Abrir em nova aba</option>
                  <option value="modal">Abrir janela de Aviso (Modal)</option>
                </select>
              </div>

              {linkAbertura === "modal" && (
                <div className="flex flex-col gap-2 p-4 bg-yellow-50 border border-yellow-200 rounded-xl mt-2 animate-fade-in">
                  <label className="text-xs font-bold text-yellow-700 uppercase tracking-widest">Texto do Aviso (Modal)</label>
                  <textarea value={textoAvisoModal} onChange={(e) => setTextoAvisoModal(e.target.value)} placeholder="Atenção: Você está sendo redirecionado para..." rows={2} className="p-3 bg-white border border-yellow-200 rounded-xl outline-none focus:border-yellow-400 resize-none" />
                </div>
              )}
            </div>

            {/* Bloco 4: Agendamento e Design */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
                <h3 className="font-black text-ipa-escuro uppercase tracking-widest text-xs flex items-center gap-2 border-b border-gray-50 pb-3">
                  <CalendarClock size={14} className="text-ipa-dourado"/> Agendamento Automático
                </h3>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Exibir a partir de:</label>
                  <input type="datetime-local" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} className="p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-ipa-verde text-sm" />
                </div>
                <div className="flex flex-col gap-2 mt-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Ocultar a partir de:</label>
                  <input type="datetime-local" value={dataFim} onChange={(e) => setDataFim(e.target.value)} className="p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-ipa-verde text-sm" />
                </div>
              </div>

              <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
                <h3 className="font-black text-ipa-escuro uppercase tracking-widest text-xs flex items-center gap-2 border-b border-gray-50 pb-3">
                  <Settings size={14} className="text-ipa-dourado"/> Design & SEO
                </h3>
                <div className="flex flex-col gap-2 mt-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex justify-between">
                    Escurecer Imagem <span>{overlayOpacidade}%</span>
                  </label>
                  <input type="range" min="0" max="90" step="10" value={overlayOpacidade} onChange={(e) => setOverlayOpacidade(Number(e.target.value))} className="w-full accent-ipa-verde mt-2" />
                </div>
                <div className="flex flex-col gap-2 mt-4">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Tempo na Tela (Milissegundos)</label>
                  <input type="number" step="1000" min="2000" value={tempoExibicao} onChange={(e) => setTempoExibicao(Number(e.target.value))} className="p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-ipa-verde text-sm" />
                  <p className="text-[10px] text-gray-400">Ex: 5000 = 5 segundos</p>
                </div>
                <div className="flex flex-col gap-2 mt-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Texto SEO (Acessibilidade)</label>
                  <input type="text" value={seoAlt} onChange={(e) => setSeoAlt(e.target.value)} placeholder="Descreva a imagem..." className="p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-ipa-verde text-sm" />
                </div>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}