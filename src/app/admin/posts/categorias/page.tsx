"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Plus, Trash2, FolderPlus, Loader2, AlertCircle, Link as LinkIcon } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  
  // Estados do Formulário
  const [nome, setNome] = useState("");
  const [slug, setSlug] = useState("");
  const [descricao, setDescricao] = useState("");
  const [erro, setErro] = useState("");

  const fetchCategorias = async () => {
    const { data, error } = await supabase.from("site_post_categories").select("*").order("nome");
    if (!error) setCategorias(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchCategorias(); }, []);

  const handleNomeChange = (val: string) => {
    setNome(val);
    const s = val.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    setSlug(s);
  };

  const handleAdicionar = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    const { error } = await supabase.from("site_post_categories").insert([{ nome, slug, descricao }]);
    
    if (error) setErro("Erro ao salvar. Verifique se o slug já existe.");
    else { setNome(""); setSlug(""); setDescricao(""); fetchCategorias(); }
    setSalvando(false);
  };

  const handleExcluir = async (id: string) => {
    if (!confirm("Excluir categoria?")) return;
    await supabase.from("site_post_categories").delete().eq("id", id);
    fetchCategorias();
  };

  if (loading) return <div className="p-20 text-center animate-pulse font-bold text-ipa-verde">CARREGANDO...</div>;

  return (
    <div className="p-10 max-w-6xl mx-auto font-sans">
      <h1 className="text-3xl font-black text-ipa-verde uppercase tracking-tighter flex items-center gap-2 mb-10">
        <FolderPlus size={32} /> Gestão de Categorias
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <form onSubmit={handleAdicionar} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4 h-fit sticky top-10">
          {erro && <div className="text-red-500 text-xs font-bold flex items-center gap-2"><AlertCircle size={14}/> {erro}</div>}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400">Nome</label>
            <input type="text" value={nome} onChange={(e) => handleNomeChange(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold" required />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400 flex items-center gap-1"><LinkIcon size={10}/> Slug</label>
            <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-mono text-ipa-verde" required />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-gray-400">Descrição</label>
            <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-sm h-24 resize-none" />
          </div>
          <button type="submit" disabled={salvando} className="w-full bg-ipa-verde text-white py-4 rounded-2xl font-black uppercase text-xs hover:bg-ipa-escuro transition-all disabled:opacity-50">
            {salvando ? "Salvando..." : "Cadastrar Categoria"}
          </button>
        </form>

        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-[10px] uppercase text-gray-400">
                <th className="p-5">Categoria / Slug</th>
                <th className="p-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map(cat => (
                <tr key={cat.id} className="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="p-5">
                    <p className="font-black text-ipa-escuro">{cat.nome}</p>
                    <p className="text-[10px] font-mono text-gray-400">{cat.slug}</p>
                  </td>
                  <td className="p-5 text-right">
                    <button onClick={() => handleExcluir(cat.id)} className="p-2 text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}