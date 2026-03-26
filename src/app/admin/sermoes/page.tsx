// src/app/admin/sermoes/page.tsx
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { Plus, BookOpen, Calendar, Pencil } from "lucide-react";

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function SermoesAdminPage() {
  const { data: sermoes } = await supabase
    .from("site_sermoes_mensagens")
    .select(`
      id,
      titulo,
      data_pregacao,
      site_sermoes_autores ( nome ),
      site_sermoes_categorias ( nome )
    `)
    .order("data_pregacao", { ascending: false });

  return (
    <div className="p-10">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-ipa-verde uppercase tracking-tighter">Sermões</h1>
          <p className="text-gray-500 font-medium mt-2">Gerencie todas as mensagens do acervo da igreja.</p>
        </div>
        <Link 
          href="/admin/sermoes/novo" 
          className="bg-ipa-dourado hover:bg-yellow-600 text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-sm flex items-center gap-2 transition-colors"
        >
          <Plus size={18} /> Nova Mensagem
        </Link>
      </header>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-widest text-gray-500">
              <th className="p-4 font-bold">Título da Mensagem</th>
              <th className="p-4 font-bold">Pregador</th>
              <th className="p-4 font-bold">Categoria</th>
              <th className="p-4 font-bold">Data</th>
              <th className="p-4 font-bold text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {sermoes?.map(function (sermao) {
              return (
                <tr key={sermao.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 font-bold text-ipa-escuro flex items-center gap-3">
                    <BookOpen size={16} className="text-ipa-dourado" />
                    {sermao.titulo}
                  </td>
                  <td className="p-4 text-gray-500 font-medium">
                   {sermao.site_sermoes_autores?.[0]?.nome || "Sem autor"}
                  </td>
                  <td className="p-4 text-gray-500 font-medium">
                    {sermao.site_sermoes_categorias?.[0]?.nome || "Sem categoria"}
                  </td>
                  <td className="p-4 text-gray-500 font-medium flex items-center gap-2">
                    <Calendar size={14} />
                    {new Date(sermao.data_pregacao).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="p-4 text-center">
                    <Link 
                      href={`/admin/sermoes/editar/${sermao.id}`}
                      className="inline-flex p-2 bg-gray-100 text-gray-500 hover:bg-ipa-dourado hover:text-white rounded-lg transition-colors"
                      title="Editar Sermão"
                    >
                      <Pencil size={16} />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {(!sermoes || sermoes.length === 0) && (
          <div className="p-10 text-center text-gray-400 font-medium">
            Nenhuma mensagem publicada ainda. Clique em "Nova Mensagem" para começar.
          </div>
        )}
      </div>
    </div>
  );
}