// src/app/admin/ebd/categorias/editar/[id]/page.tsx
"use client";

import { useState, useEffect, use as useReact } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Hash, LayoutGrid, Trash2, Info } from "lucide-react";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function EditarCategoriaEBD({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = useReact(params);
  const router = useRouter();
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [form, setForm] = useState({ nome: "", ordem: 0 });

  useEffect(() => {
    async function carregar() {
      const { data } = await supabase
        .from("site_ebd_categorias")
        .select("*")
        .eq("id", resolvedParams.id)
        .single();
      
      if (data) setForm({ nome: data.nome, ordem: data.ordem });
      setCarregando(false);
    }
    carregar();
  }, [resolvedParams.id]);

  async function atualizar(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nome) return alert("O nome da categoria é obrigatório!");
    
    setSalvando(true);
    const { error } = await supabase
      .from("site_ebd_categorias")
      .update(form)
      .eq("id", resolvedParams.id);
    
    if (!error) {
      router.push("/admin/ebd/categorias");
      router.refresh();
    } else {
      alert("Erro ao atualizar: " + error.message);
      setSalvando(false);
    }
  }

  async function excluir() {
    if (!confirm("⚠️ ATENÇÃO: Tem certeza que deseja excluir esta categoria?")) return;
    
    const { error } = await supabase
      .from("site_ebd_categorias")
      .delete()
      .eq("id", resolvedParams.id);

    if (!error) {
      router.push("/admin/ebd/categorias");
      router.refresh();
    }
  }

  if (carregando) return (
    <div className="flex items-center justify-center min-h-screen bg-[#f0f0f1]">
        <div className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em] animate-pulse">Carregando Categoria...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f0f0f1]">
      {/* HEADER FIXO - OCUPA TODA A LARGURA À DIREITA */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-30 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/admin/ebd/categorias" className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-all">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-ipa-escuro leading-none">Editar Categoria</h1>
            <p className="text-[9px] text-ipa-dourado font-black uppercase tracking-widest mt-1">ID: {resolvedParams.id.split('-')[0]}...</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
            <button 
                onClick={excluir}
                className="text-red-400 hover:text-red-600 text-[10px] font-black uppercase tracking-widest px-4 py-2 transition-all cursor-pointer"
            >
                Excluir
            </button>
            <button 
                onClick={atualizar}
                disabled={salvando}
                className="bg-ipa-verde hover:bg-ipa-escuro text-white px-10 py-2.5 rounded-lg font-black uppercase text-xs tracking-[0.15em] flex items-center gap-2 transition-all shadow-md disabled:opacity-50"
            >
                {salvando ? "Salvando..." : <><Save size={16} /> Atualizar Categoria</>}
            </button>
        </div>
      </header>

      {/* GRID DE DUAS COLUNAS */}
      <main className="max-w-[1400px] mx-auto p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLUNA ESQUERDA (PRINCIPAL) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-4 tracking-widest">Nome da Categoria</label>
            <input 
              required
              type="text"
              className="w-full text-3xl font-black text-ipa-verde border-none focus:ring-0 p-0 bg-transparent placeholder:text-gray-200"
              value={form.nome}
              onChange={e => setForm({...form, nome: e.target.value})}
            />
            <div className="mt-6 pt-6 border-t border-gray-50 flex items-start gap-3 text-gray-400">
              <Info size={16} className="mt-0.5" />
              <p className="text-xs font-medium leading-relaxed italic">
                Alterar este nome mudará o agrupamento de todos os materiais vinculados na página de Ensino.
              </p>
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA (ATRIBUTOS) */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-6 text-ipa-dourado">
                <LayoutGrid size={18} />
                <h3 className="text-[10px] font-black uppercase tracking-widest">Atributos</h3>
            </div>
            
            <div className="space-y-4">
              <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest">Ordem de Exibição</label>
              <div className="flex items-center bg-gray-50 rounded-xl px-4 border border-gray-100 focus-within:border-ipa-dourado transition-all">
                <Hash size={16} className="text-gray-300" />
                <input 
                  type="number"
                  className="w-full p-4 bg-transparent border-none focus:ring-0 font-bold text-ipa-escuro"
                  value={form.ordem}
                  onChange={e => setForm({...form, ordem: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm border-l-4 border-l-ipa-verde">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Status da Categoria</p>
            <span className="text-[10px] font-bold text-ipa-verde uppercase">Ativa na Biblioteca</span>
          </div>
        </aside>

      </main>
    </div>
  );
}