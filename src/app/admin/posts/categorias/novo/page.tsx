"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Save, FolderPlus, ArrowLeft, Loader2, AlertCircle } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function NovaCategoriaPage() {
  const router = useRouter();
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  const [nome, setNome] = useState("");
  const [slug, setSlug] = useState("");
  const [descricao, setDescricao] = useState("");

  const handleNomeChange = (val: string) => {
    setNome(val);
    const generatedSlug = val.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    setSlug(generatedSlug);
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    
    const { error } = await supabase
      .from("site_post_categories")
      .insert([{ nome, slug, descricao }]);

    if (error) {
      setErro("Erro ao cadastrar categoria. O slug pode já estar em uso.");
      setSalvando(false);
    } else {
      router.push("/admin/posts/categorias");
    }
  };

  return (
    <div className="p-10 max-w-2xl mx-auto">
      <button onClick={() => router.back()} className="mb-8 flex items-center gap-2 text-gray-400 hover:text-ipa-escuro font-bold uppercase text-[10px] tracking-widest transition-colors">
        <ArrowLeft size={14} /> Voltar para lista
      </button>

      <form onSubmit={handleSalvar} className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-8">
        <h1 className="text-2xl font-black text-ipa-verde uppercase tracking-tighter flex items-center gap-2">
          <FolderPlus size={28} /> Nova Categoria
        </h1>

        {erro && <div className="bg-red-50 text-red-500 p-4 rounded-2xl flex items-center gap-2 text-sm font-bold"><AlertCircle size={18}/> {erro}</div>}

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Nome da Categoria</label>
            <input 
              type="text" 
              value={nome} 
              onChange={(e) => handleNomeChange(e.target.value)} 
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none font-bold text-ipa-escuro" 
              placeholder="Ex: Teologia Reformada"
              required 
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Slug (URL)</label>
            <input 
              type="text" 
              value={slug} 
              onChange={(e) => setSlug(e.target.value)} 
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none font-mono text-xs text-ipa-verde" 
              required 
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Descrição Curta</label>
            <textarea 
              value={descricao} 
              onChange={(e) => setDescricao(e.target.value)} 
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none text-sm min-h-[120px] resize-none" 
              placeholder="Para que serve esta categoria..."
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={salvando} 
          className="w-full bg-ipa-verde text-white py-5 rounded-3xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-ipa-escuro transition-all shadow-xl shadow-ipa-verde/20"
        >
          {salvando ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          {salvando ? "CADASTRANDO..." : "CADASTRAR CATEGORIA"}
        </button>
      </form>
    </div>
  );
}