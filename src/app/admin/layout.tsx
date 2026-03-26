// src/app/admin/layout.tsx
import Link from "next/link";
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  FolderTree, 
  Library, 
  BookmarkCheck,
  LogOut 
} from "lucide-react";

export const metadata = {
  title: "Painel Administrativo | IP Aquiraz",
  robots: "noindex, nofollow", 
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* SIDEBAR TIPO WORDPRESS */}
      <aside className="w-68 bg-ipa-verde text-white flex flex-col shadow-2xl z-20 overflow-y-auto">
        
        {/* LOGO AREA */}
        <div className="p-8 border-b border-white/5 flex flex-col items-center">
          <span className="font-black tracking-widest text-lg uppercase leading-none">
            IP Aquiraz
          </span>
          <span className="text-ipa-dourado text-[10px] font-black uppercase tracking-[0.3em] mt-2">
            Painel Admin
          </span>
        </div>
        
        <nav className="flex-1 py-8 px-4 space-y-8">
          
          {/* DASHBOARD GERAL */}
          <div>
            <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-all text-[11px] font-black uppercase tracking-wider group">
              <LayoutDashboard size={18} className="text-ipa-dourado group-hover:scale-110 transition-transform" /> 
              Dashboard
            </Link>
          </div>

          {/* GRUPO 1: MINISTÉRIO DA PALAVRA */}
          <div className="space-y-1">
            <p className="px-4 text-[9px] font-black uppercase tracking-[0.2em] text-white/30 mb-3">
              Ministério da Palavra
            </p>
            <Link href="/admin/sermoes" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-all text-[11px] font-bold uppercase tracking-wider group">
              <BookOpen size={18} className="text-ipa-dourado group-hover:scale-110 transition-transform" /> Sermões
            </Link>
            <Link href="/admin/categorias" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-all text-[11px] font-bold uppercase tracking-wider group">
              <FolderTree size={18} className="text-ipa-dourado group-hover:scale-110 transition-transform" /> Categorias
            </Link>
            <Link href="/admin/autores" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-all text-[11px] font-bold uppercase tracking-wider group">
              <Users size={18} className="text-ipa-dourado group-hover:scale-110 transition-transform" /> Autores
            </Link>
          </div>

          {/* GRUPO 2: EDUCAÇÃO E EBD */}
          <div className="space-y-1">
            <p className="px-4 text-[9px] font-black uppercase tracking-[0.2em] text-white/30 mb-3">
              Educação e EBD
            </p>
            <Link href="/admin/ebd/materiais" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-all text-[11px] font-bold uppercase tracking-wider group">
              <Library size={18} className="text-ipa-dourado group-hover:scale-110 transition-transform" /> Biblioteca de Recursos
            </Link>
            <Link href="/admin/ebd/categorias" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-all text-[11px] font-bold uppercase tracking-wider group">
              <BookmarkCheck size={18} className="text-ipa-dourado group-hover:scale-110 transition-transform" /> Categorias de Ensino
            </Link>
          </div>

        </nav>

        {/* FOOTER DA SIDEBAR */}
        <div className="p-4 border-t border-white/5">
           <Link href="/" className="flex items-center justify-center gap-2 w-full py-3 bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-400 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest">
              <LogOut size={14} /> Sair do Painel
           </Link>
        </div>
      </aside>

      {/* ÁREA DE CONTEÚDO */}
      <main className="flex-1 overflow-y-auto bg-gray-50/50">
        {children}
      </main>
    </div>
  );
}