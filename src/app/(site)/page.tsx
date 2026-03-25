// src/app/admin/page.tsx
import { createClient } from "@supabase/supabase-js";
import { BookOpen, Users, FolderTree } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function AdminDashboard() {
  // Buscando estatísticas rápidas do banco para o Dashboard
  const { count: countSermoes } = await supabase.from('site_sermoes_mensagens').select('*', { count: 'exact', head: true });
  const { count: countAutores } = await supabase.from('site_sermoes_autores').select('*', { count: 'exact', head: true });
  const { count: countCategorias } = await supabase.from('site_sermoes_categorias').select('*', { count: 'exact', head: true });

  return (
    <div className="p-10">
      <header className="mb-10">
        <h1 className="text-3xl font-black text-ipa-verde uppercase tracking-tighter">Visão Geral</h1>
        <p className="text-gray-500 font-medium mt-2">Bem-vindo ao painel de gerenciamento da IP Aquiraz.</p>
      </header>

      {/* CARDS DE ESTATÍSTICAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-ipa-creme flex items-center justify-center text-ipa-verde">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sermões Publicados</p>
            <p className="text-3xl font-black text-ipa-verde">{countSermoes || 0}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-ipa-creme flex items-center justify-center text-ipa-verde">
            <Users size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Autores Cadastrados</p>
            <p className="text-3xl font-black text-ipa-verde">{countAutores || 0}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-ipa-creme flex items-center justify-center text-ipa-verde">
            <FolderTree size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Categorias</p>
            <p className="text-3xl font-black text-ipa-verde">{countCategorias || 0}</p>
          </div>
        </div>

      </div>
    </div>
  );
}