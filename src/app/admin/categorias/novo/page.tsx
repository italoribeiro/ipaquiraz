// src/app/admin/categorias/novo/page.tsx
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

export default function NovaCategoriaPage() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [slug, setSlug] = useState("");
  const [carregando, setCarregando] = useState(false);

  // Função normal para gerar a URL amigável (remove acentos, espaços, etc)
  function gerarSlug(texto: string) {
    return texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") 
      .replace(/[^a-z0-9]+/g, "-") 
      .replace(/(^-|-$)+/g, ""); 
  }

  // Função normal para lidar com a digitação do nome
  function handleNomeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const valorDigitado = e.target.value;
    setNome(valorDigitado);
    setSlug(gerarSlug(valorDigitado)); // Preenche o slug sozinho!
  }

  // Função normal para salvar no Supabase
  async function salvarCategoria(e: React.FormEvent) {
    e.preventDefault(); // Evita recarregar a página
    setCarregando(true);

    const { error } = await supabase
      .from("site_sermoes_categorias")
      .insert([{ nome: nome, slug: slug }]);

    if (error) {
      alert("Erro ao salvar a categoria: " + error.message);
      setCarregando(false);
    } else {
      router.push("/admin/categorias"); // Volta para a tabela
      router.refresh(); // Atualiza os dados da tabela
    }
  }

  return (
    <div className="p-10 max-w-3xl">
      <Link href="/admin/categorias" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-ipa-verde transition-colors mb-8">
        <ChevronLeft size={16} /> Voltar para Categorias
      </Link>

      <h1 className="text-3xl font-black text-ipa-verde uppercase tracking-tighter mb-8">
        Adicionar Categoria
      </h1>

      <form onSubmit={salvarCategoria} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-6">
        
        {/* Campo Nome */}
        <div className="flex flex-col gap-2">
          <label htmlFor="nome" className="text-xs font-bold text-gray-500 uppercase tracking-widest">
            Nome da Categoria
          </label>
          <input
            id="nome"
            type="text"
            required
            value={nome}
            onChange={handleNomeChange}
            placeholder="Ex: Exposição em Romanos"
            className="p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ipa-verde/20 focus:border-ipa-verde transition-all"
          />
        </div>

        {/* Campo Slug (Apenas Leitura/Visualização) */}
        <div className="flex flex-col gap-2">
          <label htmlFor="slug" className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
            Slug (URL Gerada)
          </label>
          <input
            id="slug"
            type="text"
            readOnly
            value={slug}
            className="p-4 bg-gray-100 border border-gray-200 rounded-xl text-gray-400 font-mono text-sm cursor-not-allowed"
          />
          <p className="text-[10px] text-gray-400 uppercase tracking-wider">
            Esta será a URL da categoria: ipaquiraz.com.br/ensino/sermoes/categoria/<span className="font-bold text-ipa-verde">{slug || "..."}</span>
          </p>
        </div>

        {/* Botão Salvar */}
        <div className="pt-4 mt-2 border-t border-gray-100">
          <button
            type="submit"
            disabled={carregando}
            className="bg-ipa-verde hover:bg-green-800 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-sm flex items-center gap-3 transition-colors disabled:opacity-50"
          >
            {carregando ? "Salvando..." : <><Save size={18} /> Salvar Categoria</>}
          </button>
        </div>

      </form>
    </div>
  );
}