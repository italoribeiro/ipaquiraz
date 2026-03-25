// src/app/admin/autores/page.tsx
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { Plus, UserCircle } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function AutoresPage() {
  const { data: autores } = await supabase
    .from("site_sermoes_autores")
    .select("*")
    .order("nome");

  return (
    <div className="p-10">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-ipa-verde uppercase tracking-tighter">Autores</h1>
          <p className="text-gray-500 font-medium mt-2">Gerencie os pastores e pregadores convidados.</p>
        </div>
        <Link 
          href="/admin/autores/novo" 
          className="bg-ipa-dourado hover:bg-yellow-600 text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-sm flex items-center gap-2 transition-colors"
        >
          <Plus size={18} /> Novo Autor
        </Link>
      </header>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-widest text-gray-500">
              <th className="p-4 font-bold">Pregador</th>
              <th className="p-4 font-bold">Cargo/Função</th>
            </tr>
          </thead>
          <tbody>
            {autores?.map(function (autor) {
              return (
                <tr key={autor.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 font-bold text-ipa-escuro flex items-center gap-3">
                    {autor.foto_url ? (
                      <img src={autor.foto_url} alt={autor.nome} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                    ) : (
                      <UserCircle size={40} className="text-gray-300" />
                    )}
                    {autor.nome}
                  </td>
                  <td className="p-4 text-gray-500 font-medium">{autor.cargo || "Não informado"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {(!autores || autores.length === 0) && (
          <div className="p-10 text-center text-gray-400 font-medium">
            Nenhum autor cadastrado. Clique em "Novo Autor" para começar.
          </div>
        )}
      </div>
    </div>
  );
}