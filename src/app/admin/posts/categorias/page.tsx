"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Plus, Trash2, Folder, Loader2, AlertCircle } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<any[]>([]);
  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  // Busca as categorias ao carregar a página
  const fetchCategorias = async () => {
    try {
      const { data, error } = await supabase
        .from("site_post_categories")
        .select("*")
        .order("nome");

      if (error) throw error;
      setCategorias(data || []);
    } catch (error: any) {
      console.error("Erro ao buscar categorias:", error);
      setErro("Erro ao carregar as categorias.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  // Adiciona nova categoria
  const handleAdicionar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;

    setSalvando(true);
    setErro("");

    try {
      const { error } = await supabase
        .from("site_post_categories")
        .insert([{ nome: nome.trim() }]);

      if (error) throw error;

      setNome(""); // Limpa o campo
      fetchCategorias(); // Atualiza a lista
    } catch (error: any) {
      console.error("Erro ao adicionar:", error);
      setErro("Erro ao salvar a categoria. Verifique se ela já existe.");
    } finally {
      setSalvando(false);
    }
  };

  // Exclui uma categoria
  const handleExcluir = async (id: string, nomeCategoria: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir a categoria "${nomeCategoria}"?`)) return;

    try {
      const { error } = await supabase
        .from("site_post_categories")
        .delete()
        .eq("id", id);

      if (error) throw error;

      fetchCategorias(); // Atualiza a lista após excluir
    } catch (error: any) {
      console.error("Erro ao excluir:", error);
      alert("Não foi possível excluir. Talvez existam notícias usando esta categoria.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-ipa-verde">
        <Loader2 size={40} className="animate-spin" />
        <p className="font-bold tracking-widest uppercase text-sm">Carregando categorias...</p>
      </div>
    );
  }

  return (
    <div className="p-10 pb-32 font-sans max-w-5xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-black text-ipa-verde uppercase tracking-tighter flex items-center gap-2">
          <Folder size={32} /> Categorias de Notícias
        </h1>
        <p className="text-gray-500 font-medium mt-1">
          Gerencie as categorias para organizar as publicações do site.
        </p>
      </header>

      {erro && (
        <div className="bg-red-50 text-red-500 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold mb-6">
          <AlertCircle size={20} />
          {erro}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* FORMULÁRIO DE CADASTRO */}
        <div className="md:col-span-1 space-y-6">
          <form onSubmit={handleAdicionar} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm sticky top-10">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nome da Categoria</label>
                <input 
                  type="text" 
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Eventos da Igreja"
                  className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none text-sm font-bold text-ipa-escuro"
                  required
                />
              </div>
              
              <button 
                type="submit" 
                disabled={salvando || !nome.trim()}
                className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 ${salvando || !nome.trim() ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-ipa-verde text-white hover:bg-ipa-escuro shadow-ipa-verde/20'}`}
              >
                {salvando ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                {salvando ? "Adicionando..." : "Adicionar Categoria"}
              </button>
            </div>
          </form>
        </div>

        {/* LISTAGEM DE CATEGORIAS */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-[10px] uppercase tracking-[0.2em] text-gray-400">
                  <th className="p-4 font-black">Nome</th>
                  <th className="p-4 font-black text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {categorias.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="p-10 text-center text-gray-400 font-bold uppercase text-xs tracking-widest">
                      Nenhuma categoria cadastrada ainda.
                    </td>
                  </tr>
                ) : (
                  categorias.map((cat) => (
                    <tr key={cat.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="p-4">
                        <span className="font-bold text-ipa-escuro">{cat.nome}</span>
                        <div className="text-[9px] text-gray-400 mt-1 font-mono">ID: {cat.id}</div>
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => handleExcluir(cat.id, cat.nome)}
                          className="p-2 text-gray-400 hover:bg-red-500 hover:text-white rounded-lg transition-all inline-flex items-center justify-center"
                          title="Excluir Categoria"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}