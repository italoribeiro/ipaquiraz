// src/app/admin/sermoes/editar/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Save, Code, Type } from "lucide-react";

import "react-quill-new/dist/quill.snow.css";
import dynamic from "next/dynamic";

// @ts-ignore
const ReactQuill = dynamic(
  function () { return import("react-quill-new"); },
  { ssr: false, loading: function() { return <p className="p-4 text-gray-400">Carregando editor...</p>; } }
);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function EditarSermaoPage() {
  const router = useRouter();
  const params = useParams();
  const sermaoId = params.id;
  
  const [titulo, setTitulo] = useState("");
  const [slug, setSlug] = useState("");
  const [resumo, setResumo] = useState("");
  const [dataPregacao, setDataPregacao] = useState("");
  const [passagemBiblica, setPassagemBiblica] = useState("");
  const [textoConteudo, setTextoConteudo] = useState(""); 
  
  const [seoTitulo, setSeoTitulo] = useState("");
  const [seoDescricao, setSeoDescricao] = useState("");
  const [tags, setTags] = useState("");

  const [youtubeId, setYoutubeId] = useState("");
  const [spotifyUrl, setSpotifyUrl] = useState("");
  const [imagemCapaUrl, setImagemCapaUrl] = useState("");

  const [autorId, setAutorId] = useState("");
  const [buscaAutor, setBuscaAutor] = useState("");
  const [mostrarListaAutor, setMostrarListaAutor] = useState(false);

  const [categoriaId, setCategoriaId] = useState("");
  const [buscaCategoria, setBuscaCategoria] = useState("");
  const [mostrarListaCategoria, setMostrarListaCategoria] = useState(false);

  const [autores, setAutores] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [carregandoDados, setCarregandoDados] = useState(true);
  const [modoHtml, setModoHtml] = useState(false);

  // ESTADO DA FRASE SOCIAL
  const [fraseSocial, setFraseSocial] = useState("");

  useEffect(function () {
    async function carregarDados() {
      const { data: listaAutores } = await supabase.from("site_sermoes_autores").select("*").order("nome");
      const { data: listaCategorias } = await supabase.from("site_sermoes_categorias").select("*").order("nome");
      
      if (listaAutores) setAutores(listaAutores);
      if (listaCategorias) setCategorias(listaCategorias);

      const { data: sermao } = await supabase
        .from("site_sermoes_mensagens")
        .select("*")
        .eq("id", sermaoId)
        .single();

      if (sermao) {
        setTitulo(sermao.titulo || "");
        setSlug(sermao.slug || "");
        setResumo(sermao.resumo || "");
        setDataPregacao(sermao.data_pregacao || "");
        setPassagemBiblica(sermao.passagem_biblica || "");
        setYoutubeId(sermao.youtube_id || "");
        setSpotifyUrl(sermao.spotify_url || "");
        setImagemCapaUrl(sermao.imagem_capa_url || "");
        setTextoConteudo(sermao.texto_conteudo || "");
        setSeoTitulo(sermao.seo_titulo || "");
        setSeoDescricao(sermao.seo_descricao || "");
        setTags(sermao.tags || "");
        setAutorId(sermao.autor_id || "");
        setCategoriaId(sermao.categoria_id || "");
        
        // Puxando a frase do banco
        setFraseSocial(sermao.frase_social || "");

        if (sermao.autor_id && listaAutores) {
          const autorEncontrado = listaAutores.find(function(a) { return a.id === sermao.autor_id; });
          if (autorEncontrado) setBuscaAutor(autorEncontrado.nome);
        }
        if (sermao.categoria_id && listaCategorias) {
          const categoriaEncontrada = listaCategorias.find(function(c) { return c.id === sermao.categoria_id; });
          if (categoriaEncontrada) setBuscaCategoria(categoriaEncontrada.nome);
        }
      }
      setCarregandoDados(false);
    }

    if (sermaoId) carregarDados();
  }, [sermaoId]);

  function gerarSlug(texto: string) {
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  }

  function handleTituloChange(e: React.ChangeEvent<HTMLInputElement>) {
    const valorDigitado = e.target.value;
    setTitulo(valorDigitado);
    setSlug(gerarSlug(valorDigitado));
  }

  function filtrarAutores() {
    return autores.filter(function(autor) { return autor.nome.toLowerCase().includes(buscaAutor.toLowerCase()); });
  }

  function selecionarAutor(autor: any) {
    setAutorId(autor.id);
    setBuscaAutor(autor.nome);
    setMostrarListaAutor(false);
  }

  function filtrarCategorias() {
    return categorias.filter(function(categoria) { return categoria.nome.toLowerCase().includes(buscaCategoria.toLowerCase()); });
  }

  function selecionarCategoria(categoria: any) {
    setCategoriaId(categoria.id);
    setBuscaCategoria(categoria.nome);
    setMostrarListaCategoria(false);
  }

  async function atualizarSermao(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);

    const { error, data } = await supabase
      .from("site_sermoes_mensagens")
      .update({ 
        titulo: titulo, 
        slug: slug,
        resumo: resumo,
        data_pregacao: dataPregacao,
        passagem_biblica: passagemBiblica || null,
        youtube_id: youtubeId || null,
        spotify_url: spotifyUrl || null,
        imagem_capa_url: imagemCapaUrl || null,
        texto_conteudo: textoConteudo,
        autor_id: autorId || null,
        categoria_id: categoriaId || null,
        seo_titulo: seoTitulo || null,
        seo_descricao: seoDescricao || null,
        tags: tags || null,
        frase_social: fraseSocial || null // <-- SALVANDO A FRASE
      })
      .eq("id", sermaoId)
      .select();

    if (error) {
      alert("Erro ao atualizar a mensagem: " + error.message);
      setCarregando(false);
    } else if (!data || data.length === 0) {
      alert("⚠️ Bloqueio do Supabase: Ele recusou salvar. Por favor, vá no painel do Supabase, em Authentication > Policies, e desative o RLS (Row Level Security) da tabela site_sermoes_mensagens.");
      setCarregando(false);
    } else {
      router.push("/admin/sermoes");
      router.refresh();
    }
  }

  if (carregandoDados) {
    return <div className="p-10 text-center text-gray-500 font-bold tracking-widest uppercase">Carregando dados do sermão...</div>;
  }

  return (
    <div className="p-10 w-full pb-24 font-sans">
      <Link href="/admin/sermoes" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-ipa-verde transition-colors mb-8">
        <ChevronLeft size={16} /> Voltar para Sermões
      </Link>

      <form onSubmit={atualizarSermao} className="flex flex-col gap-8">
        
        <div className="flex justify-between items-end mb-2">
          <h1 className="text-3xl font-black text-ipa-verde uppercase tracking-tighter">
            Editar Mensagem
          </h1>
          <button type="submit" disabled={carregando} className="bg-ipa-dourado hover:bg-yellow-600 text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-sm flex items-center gap-3 transition-colors shadow-lg">
            {carregando ? "Salvando..." : <><Save size={18} /> Salvar Alterações</>}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* COLUNA ESQUERDA */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <input required type="text" value={titulo} onChange={handleTituloChange} className="p-4 bg-transparent border-b-2 border-transparent hover:border-gray-100 focus:border-ipa-verde outline-none transition-all font-black text-3xl text-gray-800" />
                <p className="text-[11px] text-gray-400 font-mono px-4">Link Permanente: /ensino/sermoes/<span className="font-bold text-ipa-verde">{slug}</span></p>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-end">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Conteúdo da Mensagem</label>
                  <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button type="button" onClick={function() { setModoHtml(false); }} className={`px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-md transition-all flex items-center gap-2 ${!modoHtml ? "bg-white shadow text-ipa-verde" : "text-gray-400 hover:text-gray-600"}`}>
                      <Type size={14} /> Visual
                    </button>
                    <button type="button" onClick={function() { setModoHtml(true); }} className={`px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-md transition-all flex items-center gap-2 ${modoHtml ? "bg-white shadow text-ipa-verde" : "text-gray-400 hover:text-gray-600"}`}>
                      <Code size={14} /> HTML
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
                  {!modoHtml ? (
                    <ReactQuill theme="snow" value={textoConteudo} onChange={function(content) { setTextoConteudo(content); }} className="h-[500px]" />
                  ) : (
                    <textarea 
                      value={textoConteudo} 
                      onChange={function(e) { setTextoConteudo(e.target.value); }} 
                      className="w-full h-[542px] p-6 font-mono text-sm bg-gray-900 text-green-400 outline-none resize-none"
                    />
                  )}
                </div>
                <div className="h-10"></div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-6">
              <h3 className="font-black text-ipa-escuro uppercase tracking-widest text-sm border-b border-gray-100 pb-4">Otimização para Motores de Busca (SEO)</h3>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex justify-between">
                  Título SEO <span className="font-normal text-gray-400">{seoTitulo.length}/60</span>
                </label>
                <input type="text" value={seoTitulo} onChange={function(e) { setSeoTitulo(e.target.value) }} maxLength={60} className="p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-ipa-verde" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex justify-between">
                  Meta Descrição <span className="font-normal text-gray-400">{seoDescricao.length}/160</span>
                </label>
                <textarea value={seoDescricao} onChange={function(e) { setSeoDescricao(e.target.value) }} maxLength={160} rows={3} className="p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-ipa-verde resize-none" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Palavras-chave (Tags)</label>
                <input type="text" value={tags} onChange={function(e) { setTags(e.target.value) }} className="p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-ipa-verde" />
              </div>

              {/* --- NOVO CAMPO: FRASE PARA INSTAGRAM --- */}
              <div className="flex flex-col gap-2 mt-4 pt-6 border-t border-gray-100">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex justify-between">
                  Frase para Instagram (Stories) <span className="font-normal text-gray-400">{fraseSocial.length}/250</span>
                </label>
                <textarea 
                  value={fraseSocial} 
                  onChange={function(e) { setFraseSocial(e.target.value) }} 
                  maxLength={250} 
                  rows={3} 
                  placeholder="Ex: Não há ser no universo que seja maior ou superior a Jesus Cristo." 
                  className="p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-ipa-verde resize-none" 
                />
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-1">Essa frase será usada para gerar a imagem automática na página da mensagem.</p>
              </div>
              {/* ---------------------------------------- */}
            </div>

          </div>

          {/* COLUNA DIREITA */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-6">
              <h3 className="font-black text-ipa-escuro uppercase tracking-widest text-sm border-b border-gray-100 pb-4">Publicação</h3>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Resumo da Página (Card) *</label>
                <textarea required value={resumo} onChange={function(e) { setResumo(e.target.value) }} rows={3} className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none resize-none" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Data da Pregação *</label>
                <input required type="date" value={dataPregacao} onChange={function(e) { setDataPregacao(e.target.value) }} className="p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-gray-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-6">
              <h3 className="font-black text-ipa-escuro uppercase tracking-widest text-sm border-b border-gray-100 pb-4">Organização</h3>
              
              <div className="flex flex-col gap-2 relative">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Pregador</label>
                <input 
                  type="text" 
                  value={buscaAutor} 
                  onChange={function(e) {
                    setBuscaAutor(e.target.value);
                    setAutorId(""); 
                    setMostrarListaAutor(e.target.value.length >= 3);
                  }}
                  onFocus={function() { if (buscaAutor.length >= 3) setMostrarListaAutor(true); }}
                  className="p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" 
                />
                {mostrarListaAutor && (
                  <div className="absolute top-[70px] left-0 w-full bg-white border border-gray-200 rounded-xl shadow-xl max-h-48 overflow-y-auto z-50">
                    {filtrarAutores().map(function(autor) {
                      return <div key={autor.id} onClick={function() { selecionarAutor(autor) }} className="p-3 hover:bg-ipa-creme cursor-pointer border-b border-gray-50 text-sm">{autor.nome}</div>
                    })}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 relative">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Categoria</label>
                <input 
                  type="text" 
                  value={buscaCategoria} 
                  onChange={function(e) {
                    setBuscaCategoria(e.target.value);
                    setCategoriaId("");
                    setMostrarListaCategoria(e.target.value.length >= 3);
                  }}
                  onFocus={function() { if (buscaCategoria.length >= 3) setMostrarListaCategoria(true); }}
                  className="p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" 
                />
                {mostrarListaCategoria && (
                  <div className="absolute top-[70px] left-0 w-full bg-white border border-gray-200 rounded-xl shadow-xl max-h-48 overflow-y-auto z-50">
                    {filtrarCategorias().map(function(categoria) {
                      return <div key={categoria.id} onClick={function() { selecionarCategoria(categoria) }} className="p-3 hover:bg-ipa-creme cursor-pointer border-b border-gray-50 text-sm">{categoria.nome}</div>
                    })}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 mt-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Passagem Principal</label>
                <input type="text" value={passagemBiblica} onChange={function(e) { setPassagemBiblica(e.target.value) }} className="p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-6">
              <h3 className="font-black text-ipa-escuro uppercase tracking-widest text-sm border-b border-gray-100 pb-4">Mídias (Opcional)</h3>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">ID Vídeo YouTube</label>
                <input type="text" value={youtubeId} onChange={function(e) { setYoutubeId(e.target.value) }} className="p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none font-mono text-sm" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">URL Imagem Capa</label>
                <input type="url" value={imagemCapaUrl} onChange={function(e) { setImagemCapaUrl(e.target.value) }} className="p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Iframe Spotify</label>
                <input type="text" value={spotifyUrl} onChange={function(e) { setSpotifyUrl(e.target.value) }} className="p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm" />
              </div>
            </div>

          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button type="submit" disabled={carregando} className="bg-ipa-dourado hover:bg-yellow-600 text-white px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-sm flex items-center gap-3 transition-colors shadow-lg">
            {carregando ? "Salvando..." : <><Save size={18} /> Salvar Alterações</>}
          </button>
        </div>

      </form>
    </div>
  );
}