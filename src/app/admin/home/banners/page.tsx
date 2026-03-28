"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function BotaoExcluir({ id }: { id: string }) {
  const router = useRouter();
  const [excluindo, setExcluindo] = useState(false);

  async function handleExcluir() {
    // Trava de segurança para não apagar sem querer
    const confirmacao = window.confirm("Tem certeza que deseja excluir este banner definitivamente?");
    if (!confirmacao) return;

    setExcluindo(true);

    const { error } = await supabase
      .from("site_banners")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Erro ao excluir o banner: " + error.message);
      setExcluindo(false);
    } else {
      // Atualiza a tabela "por trás dos panos" instantaneamente
      router.refresh();
    }
  }

  return (
    <button
      onClick={handleExcluir}
      disabled={excluindo}
      className={`inline-flex p-2 rounded-lg transition-colors ${
        excluindo 
          ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
          : "bg-red-50 text-red-400 hover:bg-red-500 hover:text-white"
      }`}
      title="Excluir Banner"
    >
      <Trash2 size={16} />
    </button>
  );
}