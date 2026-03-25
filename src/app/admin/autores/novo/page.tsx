// src/app/admin/autores/novo/page.tsx
"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Save } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function NovoAutorPage() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [cargo, setCargo] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");
  const [carregando, setCarregando] = useState(false);

  function handleNomeChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNome(e.target.value);
  }

  function handleCargoChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCargo(e.target.value);
  }

  function handleFotoUrlChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFotoUrl(e.target.value);
  }

  async function salvarAutor(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);

    const { error } = await supabase
      .from("site_sermoes_autores")
      .insert([{ 
        nome: nome, 
        cargo: cargo,
        foto_url: fotoUrl || null // Se deixar em branco, salva como nulo
      }]);

    if (error) {
      alert("Erro ao salvar o autor: " + error.message);
      setCarregando(false);
    } else {
      router.push("/admin/autores");
      router.refresh();
    }
  }

  return (
    <div className="p-10 max-w-3xl">
      <Link href="/admin/autores" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-ipa-verde transition-colors mb-8">
        <ChevronLeft size={16} /> Voltar para Autores
      </Link>

      <h1 className="text-3xl font-black text-ipa-verde uppercase tracking-tighter mb-8">
        Adicionar Novo Autor
      </h1>

      <form onSubmit={salvarAutor} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-6">
        
        <div className="flex flex-col gap-2">
          <label htmlFor="nome" className="text-xs font-bold text-gray-500 uppercase tracking-widest">
            Nome do Pregador *
          </label>
          <input
            id="nome"
            type="text"
            required
            value={nome}
            onChange={handleNomeChange}
            placeholder="Ex: Rev. Hernandes Dias Lopes"
            className="p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ipa-verde/20 focus:border-ipa-verde transition-all"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="cargo" className="text-xs font-bold text-gray-500 uppercase tracking-widest">
            Cargo / Função
          </label>
          <input
            id="cargo"
            type="text"
            value={cargo}
            onChange={handleCargoChange}
            placeholder="Ex: Pastor Titular, Missionário, etc."
            className="p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ipa-verde/20 focus:border-ipa-verde transition-all"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="foto" className="text-xs font-bold text-gray-500 uppercase tracking-widest">
            URL da Foto (Opcional)
          </label>
          <input
            id="foto"
            type="url"
            value={fotoUrl}
            onChange={handleFotoUrlChange}
            placeholder="Ex: https://site.com/foto.jpg"
            className="p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ipa-verde/20 focus:border-ipa-verde transition-all"
          />
          <p className="text-[10px] text-gray-400 uppercase tracking-wider">
            Cole aqui o link direto para uma imagem.
          </p>
        </div>

        <div className="pt-4 mt-2 border-t border-gray-100">
          <button
            type="submit"
            disabled={carregando}
            className="bg-ipa-verde hover:bg-green-800 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-sm flex items-center gap-3 transition-colors disabled:opacity-50"
          >
            {carregando ? "Salvando..." : <><Save size={18} /> Salvar Autor</>}
          </button>
        </div>

      </form>
    </div>
  );
}