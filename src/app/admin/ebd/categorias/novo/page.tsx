// src/app/admin/ebd/categorias/novo/page.tsx
"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Hash, LayoutGrid, Info } from "lucide-react";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function NovaCategoriaEBD() {
  const router = useRouter();
  const [salvando, setSalvando] = useState(false);
  const [form, setForm] = useState({ nome: "", ordem: 0 });

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nome) return alert("O nome da categoria é obrigatório!");
    
    setSalvando(true);
    const { error } = await supabase.from("site_ebd_categorias").insert([form]);
    
    if (!error) {
      router.push("/admin/ebd/categorias");
      router.refresh();
    } else {
      alert(error.message);
      setSalvando(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f0f0f1]">
      {/* HEADER ESTILO WORDPRESS (OCUPA TODO O TOPO DIREITO) */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-30 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/admin/ebd/categorias" className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-all">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl font-bold text-ipa-escuro">Adicionar Nova Categoria</h1>
        </div>
        
        <button 
          onClick={salvar}
          disabled={salvando}
          className="bg-ipa-verde hover:bg-ipa-escuro text-white px-10 py-2.5 rounded-lg font-black uppercase text-xs tracking-[0.15em] flex items-center gap-2 transition-all shadow-md disabled:opacity-50"
        >
          {salvando ? "Salvando..." : <><Save size={16} /> Publicar Categoria</>}
        </button>
      </header>

      {/* ÁREA DE CONTEÚDO DISTRIBUÍDA */}
      <main className="max-w-[1200px] mx-auto p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLUNA DA ESQUERDA (DADOS PRINCIPAIS) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-4 tracking-widest">Nome da Categoria</label>
            <input 
              required
              type="text"
              placeholder="Digite o nome da categoria (ex: Teologia Sistemática)"
              className="w-full text-3xl font-black text-ipa-verde placeholder:text-gray-200 border-none focus:ring-0 p-0 bg-transparent"
              value={form.nome}
              onChange={e => setForm({...form, nome: e.target.value})}
            />
            <div className="mt-6 pt-6 border-t border-gray-50 flex items-start gap-3 text-gray-400">
              <Info size={16} className="mt-0.5" />
              <p className="text-xs font-medium leading-relaxed italic">
                Dica: Use nomes claros e objetivos. Esta categoria agrupará os materiais de estudo na página pública de Ensino.
              </p>
            </div>
          </div>
        </div>

        {/* COLUNA DA DIREITA (ATRIBUTOS DA PÁGINA) */}
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
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest italic mt-2">
                * Números menores aparecem primeiro na lista.
              </p>
            </div>
          </div>

          <div className="bg-ipa-verde/5 p-6 rounded-xl border border-ipa-verde/10">
            <p className="text-[9px] font-black text-ipa-verde uppercase tracking-widest mb-2">Status do Módulo</p>
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-ipa-verde rounded-full animate-pulse"></div>
                <span className="text-[10px] font-bold text-ipa-verde uppercase">Pronto para uso</span>
            </div>
          </div>
        </aside>

      </main>
    </div>
  );
}