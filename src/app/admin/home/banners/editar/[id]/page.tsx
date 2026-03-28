"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Save, Image as ImageIcon, Link as LinkIcon, CalendarClock, UploadCloud, ChevronDown } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// --- COMPONENTE DE COLLAPSE (SANFONA) ---
function SecaoSanfona({ titulo, icone, abertoPadrao = true, children }: { titulo: string, icone: React.ReactNode, abertoPadrao?: boolean, children: React.ReactNode }) {
  const [aberto, setAberto] = useState(abertoPadrao);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all">
      <button type="button" onClick={() => setAberto(!aberto)} className="w-full p-6 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors focus:outline-none">
        <h3 className="font-black text-ipa-escuro uppercase tracking-widest text-xs flex items-center gap-2">
          {icone} {titulo}
        </h3>
        <ChevronDown size={18} className={`text-gray-400 transition-transform duration-300 ${aberto ? "rotate-180" : ""}`} />
      </button>
      <div className={`transition-all duration-500 ease-in-out ${aberto ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
        <div className="p-6 pt-0 border-t border-gray-50">{children}</div>
      </div>
    </div>
  );
}
// ----------------------------------------

export default function EditarBannerPage() {
  const router = useRouter();
  const params = useParams();
  const bannerId = params.id;

  const [carregando, setCarregando] = useState(false);
  const [carregandoDados, setCarregandoDados] = useState(true);

  // ESTADOS
  const [ativo, setAtivo] = useState(true);
  const [titulo, setTitulo] = useState("");
  const [subtitulo, setSubtitulo] = useState("");
  const [textoBotao, setTextoBotao] = useState("");
  const [linkDestino, setLinkDestino] = useState("");
  const [linkAbertura, setLinkAbertura] = useState("_self");
  const [textoAvisoModal, setTextoAvisoModal] = useState("");
  const [tempoExibicao, setTempoExibicao] = useState(5000);
  const [overlayOpacidade, setOverlayOpacidade] = useState(50);
  const [seoAlt, setSeoAlt] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  const [modoDesktop, setModoDesktop] = useState<"upload" | "link">("link");
  const [imagemDesktopUrl, setImagemDesktopUrl] = useState("");
  const [arquivoDesktop, setArquivoDesktop] = useState<File | null>(null);

  const [modoMobile, setModoMobile] = useState<"upload" | "link">("link");
  const [imagemMobileUrl, setImagemMobileUrl] = useState("");
  const [arquivoMobile, setArquivoMobile] = useState<File | null>(null);

  useEffect(() => {
    async function carregarBanner() {
      if (!bannerId) return;
      const { data } = await supabase.from("site_banners").select("*").eq("id", bannerId).single();
      if (data) {
        setAtivo(data.ativo); setTitulo(data.titulo || ""); setSubtitulo(data.subtitulo || ""); setTextoBotao(data.texto_botao || "");
        setImagemDesktopUrl(data.imagem_desktop_url || ""); setImagemMobileUrl(data.imagem_mobile_url || "");
        setLinkDestino(data.link_destino || ""); setLinkAbertura(data.link_abertura || "_self"); setTextoAvisoModal(data.texto_aviso_modal || "");
        setTempoExibicao(data.tempo_exibicao || 5000); setOverlayOpacidade(data.overlay_opacidade || 50); setSeoAlt(data.seo_alt || "");
        if (data.data_inicio) setDataInicio(new Date(data.data_inicio).toISOString().slice(0, 16));
        if (data.data_fim) setDataFim(new Date(data.data_fim).toISOString().slice(0, 16));
      }
      setCarregandoDados(false);
    }
    carregarBanner();
  }, [bannerId]);

  async function fazerUploadImagem(arquivo: File, prefixo: string) {
    const extensao = arquivo.name.split('.').pop();
    const nomeArquivo = `banner_${prefixo}_${Date.now()}.${extensao}`;
    const { error } = await supabase.storage.from('site_imagens').upload(nomeArquivo, arquivo, { cacheControl: '3600', upsert: false });
    if (error) throw error;
    const { data: urlData } = supabase.storage.from('site_imagens').getPublicUrl(nomeArquivo);
    return urlData.publicUrl;
  }

  async function atualizarBanner(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);
    try {
      if (modoDesktop === "link" && !imagemDesktopUrl) throw new Error("A URL da imagem Desktop é obrigatória!");
      
      let urlFinalDesktop = imagemDesktopUrl;
      if (modoDesktop === "upload" && arquivoDesktop) urlFinalDesktop = await fazerUploadImagem(arquivoDesktop, 'desktop');

      let urlFinalMobile = imagemMobileUrl;
      if (modoMobile === "upload" && arquivoMobile) urlFinalMobile = await fazerUploadImagem(arquivoMobile, 'mobile');
      else if (modoMobile === "link" && !imagemMobileUrl) urlFinalMobile = ""; 

      const { error } = await supabase.from("site_banners").update({
        ativo, titulo, subtitulo: subtitulo || null, texto_botao: textoBotao || null, imagem_desktop_url: urlFinalDesktop, imagem_mobile_url: urlFinalMobile || null, link_destino: linkDestino || null, link_abertura: linkAbertura, texto_aviso_modal: textoAvisoModal || null, tempo_exibicao: tempoExibicao, overlay_opacidade: overlayOpacidade, seo_alt: seoAlt || null, data_inicio: dataInicio ? new Date(dataInicio).toISOString() : null, data_fim: dataFim ? new Date(dataFim).toISOString() : null,
      }).eq("id", bannerId);

      if (error) throw error;
      router.push("/admin/home/banners");
      router.refresh();
    } catch (err: any) {
      alert(err.message);
      setCarregando(false);
    }
  }

  if (carregandoDados) return <div className="p-10 text-center text-gray-500 font-bold uppercase">Carregando banner...</div>;

  return (
    <div className="p-6 md:p-10 w-full pb-24 font-sans bg-gray-50/50 min-h-screen">
      <Link href="/admin/home/banners" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-ipa-verde transition-colors mb-8">
        <ChevronLeft size={16} /> Voltar para Banners
      </Link>

      <form onSubmit={atualizarBanner} className="flex flex-col gap-6 w-full">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
          <div>
            <h1 className="text-3xl font-black text-ipa-verde uppercase tracking-tighter">Editar Banner</h1>
            <label className="mt-4 text-sm font-bold text-gray-500 uppercase tracking-widest cursor-pointer flex items-center gap-2">
              <input type="checkbox" checked={ativo} onChange={(e) => setAtivo(e.target.checked)} className="w-5 h-5 accent-ipa-verde cursor-pointer" />
              Banner Ativo no Site
            </label>
          </div>
          <button type="submit" disabled={carregando} className="bg-ipa-dourado hover:bg-yellow-600 text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-sm flex items-center gap-3 transition-colors shadow-lg w-full md:w-auto justify-center">
            {carregando ? "Salvando..." : <><Save size={18} /> Salvar Alterações</>}
          </button>
        </div>

        <SecaoSanfona titulo="Conteúdo Principal" icone={<ImageIcon size={14} className="text-ipa-dourado"/>}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Título Principal *</label>
              <input required type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} className="p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-ipa-verde font-bold text-lg w-full" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Subtítulo (Opcional)</label>
              <textarea value={subtitulo} onChange={(e) => setSubtitulo(e.target.value)} rows={2} className="p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-ipa-verde resize-none w-full" />
            </div>
          </div>
        </SecaoSanfona>

        <SecaoSanfona titulo="Imagens Responsivas" icone={<ImageIcon size={14} className="text-ipa-dourado"/>}>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-4">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Imagem Desktop *</label>
                <div className="flex bg-gray-100 rounded-lg p-1 w-fit">
                  <button type="button" onClick={() => setModoDesktop("upload")} className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all flex items-center gap-1 ${modoDesktop === "upload" ? "bg-white text-ipa-verde shadow-sm" : "text-gray-400"}`}><UploadCloud size={12} /> Upload</button>
                  <button type="button" onClick={() => setModoDesktop("link")} className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all flex items-center gap-1 ${modoDesktop === "link" ? "bg-white text-ipa-verde shadow-sm" : "text-gray-400"}`}><LinkIcon size={12} /> Link Atual</button>
                </div>
              </div>
              {modoDesktop === "upload" ? (
                <input type="file" accept="image/*" onChange={(e) => setArquivoDesktop(e.target.files?.[0] || null)} className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-ipa-creme file:text-ipa-verde hover:file:bg-ipa-dourado hover:file:text-white transition-all cursor-pointer border border-dashed border-gray-300 rounded-xl p-2" />
              ) : (
                <input type="url" value={imagemDesktopUrl} onChange={(e) => setImagemDesktopUrl(e.target.value)} className="p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-ipa-verde text-sm w-full" />
              )}
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Imagem Mobile</label>
                <div className="flex bg-gray-100 rounded-lg p-1 w-fit">
                  <button type="button" onClick={() => setModoMobile("upload")} className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all flex items-center gap-1 ${modoMobile === "upload" ? "bg-white text-ipa-verde shadow-sm" : "text-gray-400"}`}><UploadCloud size={12} /> Upload</button>
                  <button type="button" onClick={() => setModoMobile("link")} className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all flex items-center gap-1 ${modoMobile === "link" ? "bg-white text-ipa-verde shadow-sm" : "text-gray-400"}`}><LinkIcon size={12} /> Link Atual</button>
                </div>
              </div>
              {modoMobile === "upload" ? (
                <input type="file" accept="image/*" onChange={(e) => setArquivoMobile(e.target.files?.[0] || null)} className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-gray-100 file:text-gray-600 hover:file:bg-ipa-dourado hover:file:text-white transition-all cursor-pointer border border-dashed border-gray-300 rounded-xl p-2" />
              ) : (
                <input type="url" value={imagemMobileUrl} onChange={(e) => setImagemMobileUrl(e.target.value)} className="p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-ipa-verde text-sm w-full" />
              )}
            </div>
          </div>
        </SecaoSanfona>

        <SecaoSanfona titulo="Ação (Botão & Link)" icone={<LinkIcon size={14} className="text-ipa-dourado"/>} abertoPadrao={false}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Texto do Botão</label>
              <input type="text" value={textoBotao} onChange={(e) => setTextoBotao(e.target.value)} className="p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-ipa-verde w-full" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Link de Destino</label>
              <input type="text" value={linkDestino} onChange={(e) => setLinkDestino(e.target.value)} className="p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-ipa-verde w-full" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Abertura do Link</label>
              <select value={linkAbertura} onChange={(e) => setLinkAbertura(e.target.value)} className="p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-ipa-verde cursor-pointer w-full">
                <option value="_self">Abrir na mesma página</option>
                <option value="_blank">Abrir em nova aba</option>
                <option value="modal">Aviso de Redirecionamento (Modal)</option>
              </select>
            </div>
            {linkAbertura === "modal" && (
              <div className="col-span-1 md:col-span-3 flex flex-col gap-2 p-4 bg-yellow-50 border border-yellow-200 rounded-xl animate-fade-in">
                <label className="text-xs font-bold text-yellow-700 uppercase tracking-widest">Texto do Aviso (Modal)</label>
                <textarea value={textoAvisoModal} onChange={(e) => setTextoAvisoModal(e.target.value)} rows={2} className="p-3 bg-white border border-yellow-200 rounded-xl outline-none focus:border-yellow-400 resize-none w-full" />
              </div>
            )}
          </div>
        </SecaoSanfona>

        <SecaoSanfona titulo="Agendamento e Design" icone={<CalendarClock size={14} className="text-ipa-dourado"/>} abertoPadrao={false}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Exibir a partir de:</label>
              <input type="datetime-local" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} className="p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-ipa-verde text-sm w-full" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Ocultar a partir de:</label>
              <input type="datetime-local" value={dataFim} onChange={(e) => setDataFim(e.target.value)} className="p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-ipa-verde text-sm w-full" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex justify-between">Escurecimento <span>{overlayOpacidade}%</span></label>
              <input type="range" min="0" max="90" step="10" value={overlayOpacidade} onChange={(e) => setOverlayOpacidade(Number(e.target.value))} className="w-full accent-ipa-verde mt-3" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Tempo na Tela</label>
              <input type="number" step="1000" min="2000" value={tempoExibicao} onChange={(e) => setTempoExibicao(Number(e.target.value))} className="p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-ipa-verde text-sm w-full" />
            </div>
          </div>
        </SecaoSanfona>

      </form>
    </div>
  );
}