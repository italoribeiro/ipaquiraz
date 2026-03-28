"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { ChevronUp, ChevronDown } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface BotoesOrdemProps {
  id: string;
  ordemAtual: number;
  index: number;
  total: number;
  vizinhos: { id: string; ordem: number }[];
}

export default function BotoesOrdem({ id, ordemAtual, index, total, vizinhos }: BotoesOrdemProps) {
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);

  async function trocarOrdem(direcao: "subir" | "descer") {
    setCarregando(true);

    // Identifica o vizinho com quem vamos trocar de lugar
    const targetIndex = direcao === "subir" ? index - 1 : index + 1;
    const vizinho = vizinhos[targetIndex];

    if (!vizinho) {
      setCarregando(false);
      return;
    }

    // A mágica: trocamos os valores de 'ordem' entre os dois
    const updates = [
      { id: id, ordem: vizinho.ordem },
      { id: vizinho.id, ordem: ordemAtual }
    ];

    for (const item of updates) {
      await supabase
        .from("site_banners")
        .update({ ordem: item.ordem })
        .eq("id", item.id);
    }

    router.refresh();
    setCarregando(false);
  }

  return (
    <div className="flex flex-col gap-1 items-center">
      <button
        onClick={() => trocarOrdem("subir")}
        disabled={carregando || index === 0}
        className={`p-1 rounded-md transition-colors ${
          index === 0 ? "text-gray-200 cursor-not-allowed" : "text-gray-400 hover:bg-ipa-creme hover:text-ipa-verde"
        }`}
        title="Subir posição"
      >
        <ChevronUp size={20} />
      </button>
      
      <button
        onClick={() => trocarOrdem("descer")}
        disabled={carregando || index === total - 1}
        className={`p-1 rounded-md transition-colors ${
          index === total - 1 ? "text-gray-200 cursor-not-allowed" : "text-gray-400 hover:bg-ipa-creme hover:text-ipa-verde"
        }`}
        title="Descer posição"
      >
        <ChevronDown size={20} />
      </button>
    </div>
  );
}