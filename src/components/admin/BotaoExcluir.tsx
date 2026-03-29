"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface BotaoExcluirProps {
  id: string;
  tabela: "site_post_categories" | "site_post_authors" | "site_posts";
  nomeItem: string;
}

export default function BotaoExcluir({ id, tabela, nomeItem }: BotaoExcluirProps) {
  const [excluindo, setExcluindo] = useState(false);
  const router = useRouter();

  const handleExcluir = async () => {
    if (!confirm(`Tem certeza que deseja excluir "${nomeItem}"?`)) return;

    setExcluindo(true);
    console.log(`Tentando excluir ${id} da tabela ${tabela}...`);

    try {
      const { error } = await supabase
        .from(tabela)
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Erro do Supabase:", error);
        alert(`Erro ao excluir: ${error.message}\nVerifique as permissões de RLS no Supabase.`);
      } else {
        console.log("Excluído com sucesso!");
        router.refresh(); // Atualiza a lista na tela
      }
    } catch (err) {
      console.error("Erro inesperado:", err);
    } finally {
      setExcluindo(false);
    }
  };

  return (
    <button 
      onClick={handleExcluir}
      disabled={excluindo}
      className="p-2 bg-gray-50 text-gray-400 hover:bg-red-500 hover:text-white rounded-lg transition-all disabled:opacity-50"
    >
      {excluindo ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
    </button>
  );
}