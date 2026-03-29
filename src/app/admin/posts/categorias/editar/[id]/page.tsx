"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Save, Folder, ArrowLeft, Loader2, AlertCircle, Link as LinkIcon, CheckCircle2 } from "lucide-react";

// Inicializa o cliente do Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function EditarCategoriaPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  
  // Desembrulhando o ID da URL (Padrão Next 15)
  const resolvedParams = use(params);
  const categoriaId = resolvedParams.id;

  // Estados de Controle
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);

  // Estados dos Campos (Baseados na sua estrutura SQL)
  const [nome, setNome] = useState("");
  const [slug, setSlug] = useState("");
  const [descricao, setDescricao] = useState("");

  // 1. Busca os dados atuais da categoria
  useEffect(() => {
    const fetchCategoria = async () => {
      try {
        const { data, error } = await supabase
          .from("site_post_categories")
          .select("*")
          .eq("id", categoriaId)
          .single();

        if (error) throw error;

        if (data) {
          setNome(data.nome || "");
          setSlug(data.slug || "");
          setDescricao(data.descricao || "");
        }
      } catch (error: any) {
        console.error("Erro ao carregar categoria:", error);
        setErro("Não foi possível carregar os dados desta categoria.");
      } finally {
        setLoading(false);
      }
    };

    if (categoriaId) fetchCategoria();
  }, [categoriaId]);

  // 2. Gerador de Slug automático ao mudar o nome
  const handleNomeChange = (val: string) => {
    setNome(val);
    const generatedSlug = val
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setSlug(generatedSlug);
  };

  // 3. Função de Update
  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    setErro("");
    setSucesso(false);

    try {
      const { error } = await supabase
        .from("site_post_categories")
        .update({
          nome: nome,
          slug: slug,
          descricao: descricao,
          // atualizado_em: new Date().toISOString() // Adicione se tiver essa coluna
        })
        .eq("id", categoriaId);

      if (error) throw error;

      setSucesso(true);
      // Pequeno delay para o usuário ver o sucesso antes de voltar
      setTimeout(() => {
        router.push("/admin/posts/categorias");
      }, 1500);

    } catch (error: any) {
      console.error("Erro no Update:", error);
      setErro("Erro ao atualizar: " + error.message);
    } finally {
      setSalvando(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-ipa-verde">
        <Loader2 size={40} className="animate-spin" />
        <p className="font-bold tracking-widest uppercase text-sm">Carregando dados...</p>
      </div>
    );
  }

  return (
    <div className="p-10 max-w-3xl mx-auto font-sans">
      <button 
        onClick={() => router.back()} 
        className="mb-8 flex items-center gap-2 text-gray-400 hover:text-ipa-escuro font-bold uppercase text-[10px] tracking-widest transition-colors"
      >
        <ArrowLeft size={14} /> Voltar para lista
      </button>

      <form onSubmit={handleSalvar} className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-8 relative overflow-hidden">
        
        {/* Barra de progresso ou sucesso */}
        {salvando && <div className="absolute top-0 left-0 h-1 bg-ipa-verde animate-pulse w-full" />}

        <header className="space-y-2">
          <h1 className="text-2xl font-black text-ipa-verde uppercase tracking-tighter flex items-center gap-2">
            <Folder size={28} /> Editar Categoria
          </h1>
          <p className="text-xs text-gray-400 font-medium">ID: {categoriaId}</p>
        </header>

        {erro && (
          <div className="bg-red-50 text-red-500 p-4 rounded-2xl flex items-center gap-2 text-sm font-bold animate-shake">
            <AlertCircle size={18}/> {erro}
          </div>
        )}

        {sucesso && (
          <div className="bg-green-50 text-green-600 p-4 rounded-2xl flex items-center gap-2 text-sm font-bold">
            <CheckCircle2 size={18}/> Categoria atualizada com sucesso! Redirecionando...
          </div>
        )}

        <div className="space-y-5">
          {/* Campo Nome */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Nome da Categoria</label>
            <input 
              type="text" 
              value={nome} 
              onChange={(e) => handleNomeChange(e.target.value)} 
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-ipa-verde/10 font-bold text-ipa-escuro transition-all" 
              required 
            />
          </div>

          {/* Campo Slug */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1 flex items-center gap-1">
              <LinkIcon size={12}/> Slug (URL amigável)
            </label>
            <input 
              type="text" 
              value={slug} 
              onChange={(e) => setSlug(e.target.value)} 
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none font-mono text-xs text-ipa-verde" 
              required 
            />
          </div>

          {/* Campo Descrição */}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Descrição</label>
            <textarea 
              value={descricao} 
              onChange={(e) => setDescricao(e.target.value)} 
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none text-sm min-h-[120px] resize-none transition-all focus:ring-2 focus:ring-ipa-verde/10" 
              placeholder="Descreva o propósito desta categoria..."
            />
          </div>
        </div>

        <div className="pt-4">
          <button 
            type="submit" 
            disabled={salvando} 
            className="w-full bg-ipa-verde text-white py-5 rounded-3xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-ipa-escuro transition-all shadow-xl shadow-ipa-verde/20 active:scale-95 disabled:opacity-50"
          >
            {salvando ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {salvando ? "SALVANDO ALTERAÇÕES..." : "SALVAR ALTERAÇÕES"}
          </button>
        </div>
      </form>
    </div>
  );
}